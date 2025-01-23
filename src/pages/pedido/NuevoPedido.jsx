import { useContext, useEffect, useState } from 'react'
import Accordion from 'react-bootstrap/Accordion';
import { MyListGroup } from './componentes/MyListGroup';
import '../../style/accordion.css'
import PedidoModal from '../../componentes/modal/pedidoModal';
import { Anticipo_Credito, BuscarModal, IngresarFecha, IngresarTexto, SelectorCombo , Institucional_Campo } from './plantillas/modalPlantilla';
import { commercialContext } from '../../context/ComercialContext';
import { getNuevoPedidoClave, guardarNuevaOferta, guardarNuevoPedido } from '../../services/pedidoService';
import { decodeJWT } from '../../utils/decode';
import { getFormatShipDate} from '../../utils/humandateformat';
import Spinner from 'react-bootstrap/Spinner';
import { getCurrentLocation } from '../../utils/location';
import { makeSaleOrderBody } from './utils';
import { useNavigate, useParams } from 'react-router-dom';
import { delay } from '../../utils/delay';
// import { delay } from '../../utils/delay';

const tipoModal = {
  text: (nuevopedido, modalValues, handlemodal, setSaleOrder, isQuotation)=>(<IngresarTexto nuevopedido={nuevopedido} modalValues={modalValues} handleInputTextModal={handlemodal} handleNewSaleOrder={setSaleOrder} type={'number'} isQuotation={isQuotation}/>),
  combo: (nuevopedido, modalValues, handlemodal, setSaleOrder)=>(<SelectorCombo nuevopedido={nuevopedido} modalValues={modalValues} handleInputTextModal={handlemodal} handleNewSaleOrder={setSaleOrder} type={'text'}/>),
  date: (nuevopedido, modalValues, handlemodal, setSaleOrder)=>(<IngresarFecha nuevopedido={nuevopedido} modalValues={modalValues} handleInputTextModal={handlemodal} handleNewSaleOrder={setSaleOrder} type={'date'}/>),
  Anticipo_Credito: (nuevopedido, modalValues, handlemodal, setSaleOrder, tipo)=>(<Anticipo_Credito nuevopedido={nuevopedido} modalValues={modalValues} handleInputTextModal={handlemodal} handleNewSaleOrder={setSaleOrder} />),
  Institucional_Campos: (nuevopedido, modalValues, handlemodal, setSaleOrder, tipo)=>(<Institucional_Campo nuevopedido={nuevopedido} modalValues={modalValues} handleInputTextModal={handlemodal} handleNewSaleOrder={setSaleOrder} />),
}
// Final_Pedido: (nuevopedido, modalValues, handlemodal, setSaleOrder)=>(<Final_Pedido nuevopedido={nuevopedido} modalValues={modalValues} handleInputTextModal={handlemodal} handleNewSaleOrder={setSaleOrder}/>)

const tipoPedido = {venta: 'ORDEN DE VENTA',
                    oferta: 'COTIZACIÓN'};

const grabarCuerpo ={
    venta: (body)=>guardarNuevoPedido(body),
    oferta: (body)=>guardarNuevaOferta(body),
}

export default function NuevoPedido() {
  const { 
          //Handle nuevo cliente
          handleSearchModal, 
          searchClientModal: buscarModalValues,
          //handle nuevo pedido
          nuevoPedido,
          handleNewSaleOrder, 
          // handleSaleOrder2Init,
          //handle input modals combo/ date/ text field
          showInputTextModal: modalValues,
          //valor para conocer si cambio cliente
          // isClientChanged, //detectar el cambio de socio
          handleInputTextModal,
          //secure shield
          handleShow,
        } = useContext(commercialContext);
  
  const tipo =  useParams().tipo in tipoPedido ? tipoPedido[useParams().tipo] : null;
  const tipo_root = useParams().tipo in tipoPedido ? useParams().tipo : null;
  const [isLoading, setIsLoading] = useState(false)
  const [location, setLocation] = useState(false)
  const navigate = useNavigate();
  
  //primera vez y cuando cambio en la ruta
  useEffect(()=>{
    const doFetch = async () => 
      {
        const data_token = await decodeJWT();
        const response = await getNuevoPedidoClave({usuario_codigo: data_token.username});
        // //secure shield
        response === 406 && handleShow()
        // //
        if(response !== 406 && !!response){
          handleNewSaleOrder({cliente_codigo: null, comentarios: {vendedor: '', nota_anticipo: ''}, numero: response.code_sale, 
          fcontable: response.fecha, ruc:'', razonsocial:'', telefono: '',
          fentrega: getFormatShipDate({fechacontable: new Date(response.fecha), moredays: 1}), direccionentrega:'', ructransporte: '', moneda:'', 
          codigogrupo: '', condicionpago:'', products: [], grupo_familia: null, ubicacion: null, montos: {anticipo: 0, descuento: 0, impuesto: 0, nota_credito: 0, total: 0, total_cred_anti: 0,
          unidad: '', valor_venta: 0}, institucional: {cmp1: '', cmp2: '', cmp3: '', oc: ''}})
        //   if(!nuevoPedido?.numero){ //sirve para generar code_sale
        // }
        }else if(response !== 406 && !response){
          alert('Error durante ejecución, contactar con TI')
        }
      }

    //verifica que la ruta sea venta u oferta
    if(tipo){
        //obtiene clave  mobile y fecha contable
        doFetch();
    }else{
      console.log("Si entra aqui")
      //aqui deberia enviar al apagina 404
      //deberia en condicion de inicial el cuerpo del context
      navigate('/main/home')
    }
  },[tipo])

  /**
   * Equivalente a un F5
   */
  const refreshPage = () => {
    window.location.reload()
  };
  
  //valida que todos los campos esten correctos OV antes de guardar
  const validarCampos = async () => {
    // verifica si registro cliente
    if(!!nuevoPedido?.razonsocial){
        //verifica existe producto en lista
        if(!!nuevoPedido?.products?.length){
          //verifica que no haya cambiado de cliente, pendiente actualizacion de descuento
          // if(!isClientChanged.active){ // ahora funciona cuando cambia cliente, los descuentos se quitan
            if(!!nuevoPedido?.ructransporte){
              try{
                //Logica que solicita dos veces los permisos de geolocalizacion
                let currentLocation = null
                try{
                  currentLocation = await getCurrentLocation(2);
                }catch(error){
                  console.log('Localizacion desactivada en navegador: ', error.message)
                }
                setLocation(!!currentLocation)
                setIsLoading(true);
                // await delay(1000)
                let body = makeSaleOrderBody(nuevoPedido, currentLocation)
    
                const [response, status] = !!tipo_root ? await grabarCuerpo[tipo_root](body): [null, 206];
                // //
                status === 406 && handleShow()
                //aca se devuelve una respuesta cuando concluye el proceso
                setIsLoading(false);
                status !== 200 && alert(response)
                if(status === 200 && typeof(response[1]) === 'number' && typeof(response[2]) === 'number'){
                  alert('¡Orden de venta y borrador creados!\nRedireccion a pedidos pendientes')
                  navigate('/main/pedido/pendiente')
                }else if(status === 200 && typeof(response[1]) === 'number' && typeof(response[2]) !== 'number'){
                  alert('¡Borrador creado!\nRedireccion a pedidos pendientes')
                  navigate('/main/pedido/pendiente')
                }else if(status === 200 && typeof(response) === 'string'){
                  alert(response)
                  refreshPage() // aqui se refresca la pagina cuando se crea un nuevo pedido
                }
              }catch(error){
                setIsLoading(false);
                alert ('¡Error al generar pedido!\nContactar con el area de TI')
                console.error("An error occurred:", error.message);
              }
          }else{
            alert('Debe seleccionar un transportista en la cabecera')
          }
        }else{
          alert("Debe agregar productos")
        }
      }else{
        alert("Debe registrar un socio de negocios")
      }
    }

  return (
    <div className='tw-relative'>
      {/* modal buscar cliente y buscar producto */}
      <PedidoModal modalTitle={buscarModalValues.modalTitle} handleClose={()=>handleSearchModal({show: false})} show={buscarModalValues.show}>
        <BuscarModal buscarModalValues={buscarModalValues} handleNewSaleOrder={handleNewSaleOrder} handleCloseModal={()=>handleSearchModal({show: false})} isQuotation={tipo_root==='oferta'}/>
      </PedidoModal>
      
      {/* modal general para tipo combo / text field / date */}
      {!!modalValues.tipomodal && (
        <PedidoModal tipomodal={modalValues.tipomodal} size={modalValues.size} modalTitle={modalValues.modalTitle} handleClose={()=>handleInputTextModal({show: false})} show={modalValues.show}>
          {tipoModal[modalValues.tipomodal](nuevoPedido, modalValues, handleInputTextModal, handleNewSaleOrder, tipo_root==='oferta')}
        </PedidoModal>
      )}
      <h6 className='tw-text-center bg-secondary tw-text-white tw-rounded-md' style={{marginBottom: 0, padding: "5px 0"}}>{tipo? `NUEVA ${tipo}`:'*************'}</h6>
      <div className='tw-absolute tw-w-full'>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Datos del cliente</Accordion.Header>
          <Accordion.Body>
            <MyListGroup plantilla="nuevopedidocabecera" data={undefined}/>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Productos</Accordion.Header>
          <Accordion.Body>
            <MyListGroup plantilla="nuevopedidoproductos" data={undefined}/>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      {/* </div> */}
      <div className='tw-flex tw-flex-col tw-items-center tw-border-2'>
        <button className='button-14 tw-w-2/3 tw-h-10 tw-my-4 tw-font-sans tw-font-medium' disabled={isLoading?true:false} style={{margin: '0 auto'}} onClick={validarCampos}>
          {isLoading ? (
            <>
              Grabando.....
              <Spinner animation="grow" role="status" size='sm' className='tw-ml-2'>
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </>
          ):(
            <>
              {tipo? `Grabar ${tipo.toLowerCase()}`:'*************'}
            </>
          )}
        </button>
        </div>
      </div>
      {
      isLoading && (<div className='glass_layer'>
        <h3>{`Grabando ${tipoPedido[tipo_root].toLowerCase()}...${location?'◾':''}`}</h3>
      </div>)
      }
    </div>
  );
}

export { NuevoPedido }
       
       
       
       