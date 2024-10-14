import { useContext, useEffect, useState } from 'react'
import Accordion from 'react-bootstrap/Accordion';
import { MyListGroup } from './componentes/MyListGroup';
import '../../style/accordion.css'
import PedidoModal from '../../componentes/modal/pedidoModal';
import { Anticipo_Credito, BuscarModal, IngresarFecha, IngresarTexto, SelectorCombo , Institucional_Campo } from './plantillas/modalPlantilla';
import { commercialContext } from '../../context/ComercialContext';
import { getNuevoPedidoClave, guardarNuevoPedido } from '../../services/pedidoService';
import { decodeJWT } from '../../utils/decode';
import { getFormatShipDate} from '../../utils/humandateformat';
import Spinner from 'react-bootstrap/Spinner';
import { getCurrentLocation } from '../../utils/location';
import { makeSaleOrderBody } from './utils';

const tipoModal = {
  text: (nuevopedido, modalValues, handlemodal, setSaleOrder)=>(<IngresarTexto nuevopedido={nuevopedido} modalValues={modalValues} handleInputTextModal={handlemodal} handleNewSaleOrder={setSaleOrder} type={'number'}/>),
  combo: (nuevopedido, modalValues, handlemodal, setSaleOrder)=>(<SelectorCombo nuevopedido={nuevopedido} modalValues={modalValues} handleInputTextModal={handlemodal} handleNewSaleOrder={setSaleOrder} type={'text'}/>),
  date: (nuevopedido, modalValues, handlemodal, setSaleOrder)=>(<IngresarFecha nuevopedido={nuevopedido} modalValues={modalValues} handleInputTextModal={handlemodal} handleNewSaleOrder={setSaleOrder} type={'date'}/>),
  Anticipo_Credito: (nuevopedido, modalValues, handlemodal, setSaleOrder, tipo)=>(<Anticipo_Credito nuevopedido={nuevopedido} modalValues={modalValues} handleInputTextModal={handlemodal} handleNewSaleOrder={setSaleOrder} />),
  Institucional_Campos: (nuevopedido, modalValues, handlemodal, setSaleOrder, tipo)=>(<Institucional_Campo nuevopedido={nuevopedido} modalValues={modalValues} handleInputTextModal={handlemodal} handleNewSaleOrder={setSaleOrder} />),
}
// Final_Pedido: (nuevopedido, modalValues, handlemodal, setSaleOrder)=>(<Final_Pedido nuevopedido={nuevopedido} modalValues={modalValues} handleInputTextModal={handlemodal} handleNewSaleOrder={setSaleOrder}/>)

export default function NuevoPedido() {
  const { 
          //Handle nuevo cliente
          handleSearchModal, 
          searchClientModal: buscarModalValues,
          //handle nuevo pedido
          nuevoPedido,
          handleNewSaleOrder, 
          handleSaleOrder2Init,
          //handle input modals combo/ date/ text field
          showInputTextModal: modalValues,
          //valor para conocer si cambio cliente
          isClientChanged,
          handleInputTextModal} = useContext(commercialContext);
        
  const [isLoading, setIsLoading] = useState(false)

  useEffect(()=>{
    const doFetch = async () => 
      {
        const data_token = await decodeJWT();
        const response = await getNuevoPedidoClave({usuario_codigo: data_token.username});
        !!response && handleNewSaleOrder({cliente_codigo: null, comentarios: {vendedor: '', nota_anticipo: ''}, numero: response.code_sale, fcontable: response.fecha, ruc:'', razonsocial:'', telefono: '', 
        fentrega: getFormatShipDate({fechacontable: new Date(response.fecha), moredays: 1}), direccionentrega:'', ructransporte: '', moneda:'', 
        codigogrupo: '', condicionpago:'', products: [], grupo_familia: null, ubicacion: null, montos: {anticipo: 0, descuento: 0, impuesto: 0, nota_credito: 0, total: 0, total_cred_anti: 0,
        unidad: '', valor_venta: 0}, institucional: {cmp1: '', cmp2: '', cmp3: '', oc: ''}})
      }
      //obtiene clave  mobile y fecha contable
      doFetch();

  },[])

  //valida que todos los campos esten correctos OV antes de guardar
  const validarCampos = async () => {
    // aca tiene que ir la logica antes de guardar el pedido
    // verifica si registro cliente
    if(!!nuevoPedido?.razonsocial){
        //verifica existe producto en lista
        if(!!nuevoPedido?.products?.length){
          //verifica que no haya cambiado de cliente, pendiente actualizacion de descuento
          if(!isClientChanged.active){
            setIsLoading(true);
            let currentLocation = await getCurrentLocation();
            let body = makeSaleOrderBody(nuevoPedido, currentLocation)
            const [response, status] = await guardarNuevoPedido(body);
            //aca se devuelve una respuesta cuando concluye el proceso
            setIsLoading(false);
            status !== 200 && alert('Alerta, problemas con el servidor')
            status === 200 && typeof(response[1]) === 'number' && typeof(response[2]) === 'number' && alert('¡Orden de venta y borrador creados!')
            status === 200 && typeof(response[1]) === 'number' && typeof(response[2]) !== 'number' && alert('¡Borrador creado!')
          }else{
            alert("Debe aplicar descuentos nuevamente")
            //CHECK IF VARIABLE IS NUMBER?
          }
        }else{
          alert("Debe agregar productos")
        }
      }else{
        alert("Debe registrar un socio de negocios")
      }
    }

  return (
    <>
    {/* modal buscar cliente y buscar producto */}
    <PedidoModal modalTitle={buscarModalValues.modalTitle} handleClose={()=>handleSearchModal({show: false})} show={buscarModalValues.show}>
      <BuscarModal buscarModalValues={buscarModalValues} handleNewSaleOrder={handleNewSaleOrder} handleCloseModal={()=>handleSearchModal({show: false})}/>
    </PedidoModal>
    
    {/* modal general para tipo combo / text field / date */}
    {!!modalValues.tipomodal && (
      <PedidoModal tipomodal={modalValues.tipomodal} size={modalValues.size} modalTitle={modalValues.modalTitle} handleClose={()=>handleInputTextModal({show: false})} show={modalValues.show}>
        {tipoModal[modalValues.tipomodal](nuevoPedido, modalValues, handleInputTextModal, handleNewSaleOrder)}
      </PedidoModal>
    )}

    <h6 className='tw-text-center bg-secondary tw-text-white tw-rounded-md' style={{marginBottom: 0, padding: "5px 0"}}>NUEVA ORDEN DE VENTA</h6>
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
          <MyListGroup plantilla="nuevopedidoproductos"/>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
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
            Grabar Orden de Venta
          </>
        )}
      </button>
    </div>
    </>
  );
}

export { NuevoPedido }