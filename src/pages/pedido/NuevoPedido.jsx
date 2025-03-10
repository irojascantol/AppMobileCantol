import { useContext, useEffect, useRef, useState } from 'react'
import Accordion from 'react-bootstrap/Accordion';
import { MyListGroup } from './componentes/MyListGroup';
import '../../style/accordion.css'
import {PedidoModal, PedidoModal_Oferta} from '../../componentes/modal/pedidoModal';
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
import { ServerError } from '@azure/msal-browser';
import { BsGeoAltFill } from 'react-icons/bs';
// import { delay } from '../../utils/delay';

const tipoModal = {
  text: (nuevopedido, modalValues, handlemodal, setSaleOrder, isQuotation)=>(<IngresarTexto nuevopedido={nuevopedido} modalValues={modalValues} handleInputTextModal={handlemodal} handleNewSaleOrder={setSaleOrder} type={'number'} isQuotation={isQuotation}/>),
  combo: (nuevopedido, modalValues, handlemodal, setSaleOrder, tipo, handleDescuentoDoc)=>(<SelectorCombo nuevopedido={nuevopedido} modalValues={modalValues} handleInputTextModal={handlemodal} handleNewSaleOrder={setSaleOrder} type={'text'} handleDescuentoDoc={handleDescuentoDoc}/>),
  date: (nuevopedido, modalValues, handlemodal, setSaleOrder, tipo, handleDescuentoDoc)=>(<IngresarFecha nuevopedido={nuevopedido} modalValues={modalValues} handleInputTextModal={handlemodal} handleNewSaleOrder={setSaleOrder} type={'date'}/>),
  Anticipo_Credito: (nuevopedido, modalValues, handlemodal, setSaleOrder, tipo, handleDescuentoDoc)=>(<Anticipo_Credito nuevopedido={nuevopedido} modalValues={modalValues} handleInputTextModal={handlemodal} handleNewSaleOrder={setSaleOrder} />),
  Institucional_Campos: (nuevopedido, modalValues, handlemodal, setSaleOrder, tipo, handleDescuentoDoc)=>(<Institucional_Campo nuevopedido={nuevopedido} modalValues={modalValues} handleInputTextModal={handlemodal} handleNewSaleOrder={setSaleOrder} />),
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
          //descuento estado
          dsctFormato,
          //manejo nueva politica descuento 27/01/25
          handleDescuento,
          handleDescuentoDoc,
          setNuevoPedido
        } = useContext(commercialContext);
  
  const tipo =  useParams().tipo in tipoPedido ? tipoPedido[useParams().tipo] : null;
  const tipo_root = useParams().tipo in tipoPedido ? useParams().tipo : null;
  const [isLoading, setIsLoading] = useState(false)
  const [location, setLocation] = useState(false)

  // //aqui se ve el tipo de cotizacion
  const [showDialogCoti, setShowDialogCoti] = useState(false)
  
  const recoverOrder = useRef(false)
  const navigate = useNavigate();

  
  const setInitialcondition = async () => {
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
    }else if(response !== 406 && !response){
      alert('Error durante ejecución, contactar con TI')
    }
  }

  //primera vez y cuando cambio en la ruta
  useEffect(()=>{
    const doFetch = async () => 
      {
        // if(!!sessionStorage.getItem('draft_order') && !recoverOrder.current){
        // if(!!sessionStorage.getItem('draft_order')){
        if(false){
          console.log('Proceso para continuar una OV pendiente')
          //ESTOOOOO ES PARA GUARDAR UNA OV QUE ESTA EN PROCESO
          //   let resultado = confirm("Existe un pedido en curso\n¿Desea restablecerlo?");
          //   recoverOrder.current = true
          //   if (resultado){
          //     console.log('Si entra aqui 1')
          //     let draft_order = JSON.parse(sessionStorage.getItem('draft_order'));
          //     console.log(draft_order)
          //     handleNewSaleOrder(draft_order)
          //     sessionStorage.removeItem('draft_order')
          // }else{
          //   sessionStorage.removeItem('draft_order')
          //   await setInitialcondition()
          // }
        }else{
          // if (!recoverOrder.current){
            // console.log('Si entra aqui 2')
            await setInitialcondition()
        }
      }
      //verifica que la ruta sea venta u oferta
      if(tipo){
        //obtiene clave  mobile y fecha contable
        doFetch();
        //Activa consulta en cotización
        tipo  === 'COTIZACIÓN' && setShowDialogCoti(true)
      }else{
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

  // console.log(JSON.stringify(nuevoPedido, null, 2))
  // console.log(JSON.stringify(nuevoPedido))
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
                setIsLoading(true); //Bloqueo ventana antes de pedir geolocalizacion
                try{
                  currentLocation = await getCurrentLocation(2);
                }catch(error){
                  console.log('Localizacion desactivada en navegador: ', error.message)
                }
                setLocation(!!currentLocation) //esto para enviar el cuadrado negro en frond
                let body = makeSaleOrderBody(nuevoPedido, currentLocation, dsctFormato)
                // console.log(body)
                // await delay(2000)
                const [response, status] = !!tipo_root ? await grabarCuerpo[tipo_root](body): [null, 206];
                // const [response, status] = ['OV Creada!', 200];
                // await delay(2000)
                // //
                status === 406 && handleShow()
                //aca se devuelve una respuesta cuando concluye el proceso
                setIsLoading(false);
                status !== 200 && alert(JSON.stringify(response))
                if(status === 200 && typeof(response[1]) === 'number' && typeof(response[2]) === 'number'){
                  alert('¡Orden de venta y borrador creados!\nRedireccion a pedidos pendientes')
                  sessionStorage.removeItem('draft_order')
                  navigate('/main/pedido/pendiente')
                }else if(status === 200 && typeof(response[1]) === 'number' && typeof(response[2]) !== 'number'){
                  alert('¡Borrador creado!\nRedireccion a pedidos pendientes')
                  sessionStorage.removeItem('draft_order')
                  navigate('/main/pedido/pendiente')
                }else if(status === 200 && typeof(response) === 'string'){
                  alert(response)
                  sessionStorage.removeItem('draft_order')
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

      <PedidoModal_Oferta show={showDialogCoti} handleTipoCoti={(x)=>{setShowDialogCoti(false); handleNewSaleOrder({tipocotizacion: x || null});}}/>

      {/* modal buscar cliente y buscar producto */}
      <PedidoModal modalTitle={buscarModalValues.modalTitle} handleClose={()=>handleSearchModal({show: false})} show={buscarModalValues.show}>
        <BuscarModal buscarModalValues={buscarModalValues} handleNewSaleOrder={handleNewSaleOrder} handleCloseModal={()=>handleSearchModal({show: false})} isQuotation={tipo_root==='oferta'}/>
      </PedidoModal>
      
      {/* modal general para tipo combo / text field / date */}
      {!!modalValues.tipomodal && (
        <PedidoModal tipomodal={modalValues.tipomodal} size={modalValues.size} modalTitle={modalValues.modalTitle} handleClose={()=>handleInputTextModal({show: false})} show={modalValues.show}>
          {tipoModal[modalValues.tipomodal](nuevoPedido, modalValues, handleInputTextModal, handleNewSaleOrder, tipo_root==='oferta', handleDescuentoDoc)}
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
        <div className='tw-flex tw-justify-center tw-items-start'>
          <h3>{`Grabando ${tipoPedido[tipo_root].toLowerCase()}...`}</h3>
          {location && (
            <div><BsGeoAltFill color='black' size={20}/></div>
          )}
        </div>

      </div>)
      }
    </div>
  );
}

export { NuevoPedido }
       
       
       
       