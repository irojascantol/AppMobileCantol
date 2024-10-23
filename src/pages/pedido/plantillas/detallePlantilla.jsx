import React, { useContext, useEffect, useState } from 'react'
import { ListGroup } from 'react-bootstrap'
import { getDetallePedidoGeneral, getDetallePedidoLogistica, getDetallePedidoFinanzas, getDetallePedidoContenido} from '../../../services/pedidoService'
import { commercialContext } from '../../../context/ComercialContext';
import { getFormatShipDate_peru, getHumanDateFormat, getHumanDateReporte } from '../../../utils/humandateformat';
import { Contenido_Articulos } from './pedidoPlantilla';
// import { useLocation } from 'react-router-dom';

const params_ = {
  rechazado: (data)=>({numero_documento: data?.DocNum}),
  pendiente: (data)=>({documento_entrada: data?.DocEntry}),
  aprobado: (data)=>({numero_documento: data?.DocNum}),
}

function DetallePlantillaContenido({data, tipoPedido}) {
  const [componentData, setComponentData] = useState(null);
  const {tabActivePedido, indexPedidoCarusel, handleShow} = useContext(commercialContext)
  // const location = useLocation();
  // const query = new URLSearchParams(location.search).get('tipo');
  // console.log(query)
  //falta aqui redireccion

  useEffect(()=>{
    const getDetalleContenido = async () => {
      if(tabActivePedido==='contenido' && !!data?.DocEntry){
        const response = await getDetallePedidoContenido({documento_entrada: data?.DocEntry}, tipoPedido);
        //secure shield
        if(response !== undefined){
            await setComponentData(response)
        }else{
            handleShow();
        }
      }
    }
    getDetalleContenido();
   },[tabActivePedido, indexPedidoCarusel]);


  return (
    <>
    {componentData?.map((item, index)=>(
        <Contenido_Articulos key={(index+1).toString()} item={item}/>
    ))}
    </>
  )
}

function DetallePlantillaFinanzas({data, tipoPedido}) {
  const [componentData, setComponentData] = useState(null);
  const {tabActivePedido, indexPedidoCarusel, handleShow} = useContext(commercialContext)
  // const location = useLocation();
  // const query = new URLSearchParams(location.search).get('tipo');
  // console.log(query)
  
  useEffect(()=>{
    const getDetalleFinanzas = async () => {
      // if(tabActivePedido==='finanzas'){
      if(tabActivePedido==='finanzas' && data?.CardCode){
        // const response = await getDetallePedidoContenido({documento_entrada: data?.DocEntry}, tipoPedido);
        const response = await getDetallePedidoFinanzas({...params_[tipoPedido](data), card_code: data.CardCode}, tipoPedido);
        //secure shield
        if(response !== undefined){
            await setComponentData(response[0])
        }else{
            handleShow();
        }
      }
    }
    getDetalleFinanzas();
   },[tabActivePedido, indexPedidoCarusel]);


  return (
    <>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1 tw-border-t-2"
        variant="no style"
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-dark">Condición de pago:</div>
          <div className='text-secondary tw-text-lg'>{componentData?.condicion_pago || 'NO PRECISA'}</div>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1 tw-border-t-2 tw-border-b-2"
        variant='No style'
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-dark">Lista de precios:</div>
          <div className='text-secondary tw-text-lg'>{componentData?.lista_precio || 'NO PRECISA'}</div>
        </div>
      </ListGroup.Item>
    </>
  )
}

function DetallePlantillaLogistica({data, tipoPedido}) {
  const [componentData, setComponentData] = useState(null);
  const {tabActivePedido, indexPedidoCarusel, handleShow} = useContext(commercialContext)
  // const location = useLocation();
  // const query = new URLSearchParams(location.search).get('tipo');
  // console.log(query)

  useEffect(()=>{
    const getDetalleLogistica = async () => {
      if(tabActivePedido==='logistica' && !!data?.DocEntry){
        console.log(params_[tipoPedido](data))
        const response = await getDetallePedidoLogistica(params_[tipoPedido](data), tipoPedido);
        //secure shield
          if(response !== undefined){
            setComponentData(response[0])
          }else{
            handleShow();
          }
      }
    }
    getDetalleLogistica();
   },[tabActivePedido, indexPedidoCarusel]);

  return (
    <>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1 tw-border-t-2"
        variant='No style'
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-dark">Transportista:</div>
          <div className='text-secondary tw-text-base'>{componentData?.nombre_transportista || 'NO PRECISA'}</div>
          <div className='text-secondary tw-text-sm tw-font-semibold'>{componentData?.ruc_transportista || 'NO PRECISA'}</div>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1 tw-border-t-2"
        variant='No style'
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-dark">Dirección fiscal</div>
          <div className='text-secondary tw-text-base'>{componentData?.direccion_fiscal || 'NO PRECISA'}</div>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1 tw-border-t-2 tw-border-b-2"
        variant="no style"
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-dark">Dirección de entrega</div>
          <div className='text-secondary tw-text-base'>{componentData?.direccion_entrega || 'NO PRECISA'}</div>
        </div>
      </ListGroup.Item>
    </>
  )
}

function DetallePlantillaGeneral({data, tipoPedido}) {
  const [componentData, setComponentData] = useState(null);
  const {indexPedidoCarusel, tabActivePedido, handleShow} = useContext(commercialContext)
  // const location = useLocation();
  // const query = new URLSearchParams(location.search).get('tipo');
  // console.log(query)

  useEffect(()=>{
    const getDetalleGeneral = async () => {
      if(tabActivePedido==='general' && data?.DocEntry){
        const response = await getDetallePedidoGeneral(params_[tipoPedido](data), tipoPedido);
        //secure shield
        if(response !== undefined){
            await setComponentData(response[0])
        }else{
            handleShow();
        }
      }
    }
    getDetalleGeneral();
    }
   ,[indexPedidoCarusel, tabActivePedido]);

  return (
    <>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1 tw-border-t-2"
        variant="no style"
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-dark">Numero de documento:</div>
          <div className='text-secondary tw-text-lg'>{componentData?.DocNum}</div>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1 tw-border-t-2"
        variant='No style'
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-dark">Codigo de negocio:</div>
          <div className='text-secondary tw-text-lg'>{componentData?.codigo_negocio}</div>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1 tw-border-t-2"
        variant='No style'
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-dark">RUC:</div>
          <div className='text-secondary tw-text-lg'>{componentData?.ruc}</div>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1 tw-border-t-2"
        variant='No style'
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-dark">Razon social:</div>
          <div className='text-secondary tw-text-lg'>{componentData?.razon_social}</div>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1 tw-border-t-2"
        variant='No style'
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-dark">Comentario venta:</div>
          <div className='text-secondary tw-text-lg'>{componentData?.comentario_usuario || 'SIN COMENTARIO'}</div>
        </div>
      </ListGroup.Item>
      {/* Lo de abajo por defecto muestra el ruc de distrimax */}
      {/* <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1 tw-border-t-2"
        variant='No style'
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-dark">Comentario vendedor:</div>
          <div className='text-secondary tw-text-lg'>{componentData?.comentarios || 'SIN COMENTARIO'}</div>
        </div>
      </ListGroup.Item> */}
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1 tw-border-t-2"
        variant='No style'
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-dark">Fecha contable:</div>
          <div className='text-secondary tw-text-lg'>{getHumanDateReporte(componentData?.fecha_contable)}</div>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1 tw-border-t-2"
        variant='No style'
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-dark">Fecha de vencimiento:</div>
          <div className='text-secondary tw-text-lg'>{getHumanDateReporte(componentData?.fecha_vencimiento)}</div>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1 tw-border-t-2"
        variant='No style'
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-dark">Hora de creación:</div>
          <div className='text-secondary tw-text-lg'>{componentData?.hora_creacion}&nbsp;</div>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1 tw-border-t-2"
        variant='No style'
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-dark">Moneda:</div>
          <div className='text-secondary tw-text-lg'>{componentData?.tipo_moneda}</div>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1 tw-border-t-2"
        variant='No style'
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-dark">Subtotal:</div>
          <div className='text-secondary tw-text-lg'>{componentData?.unidad_moneda}.{componentData?.total_antes_descuento}</div>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1 tw-border-t-2 tw-border-b-2"
        variant='No style'
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-dark">Total:</div>
          <div className='text-secondary tw-text-lg'>{componentData?.unidad_moneda}.{componentData?.total}</div>
        </div>
      </ListGroup.Item>
    </>
  )
}

export { DetallePlantillaGeneral, DetallePlantillaLogistica, DetallePlantillaFinanzas, DetallePlantillaContenido}
