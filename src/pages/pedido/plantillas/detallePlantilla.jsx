import React, { useContext, useEffect, useState } from 'react'
import { ListGroup } from 'react-bootstrap'
import { getDetallePedidoGeneral, getDetallePedidoLogistica, getDetallePedidoFinanzas, getDetallePedidoContenido} from '../../../services/pedidoService'
import { commercialContext } from '../../../context/ComercialContext';
import { getHumanDateFormat } from '../../../utils/humandateformat';
import { Contenido_Articulos } from './pedidoPlantilla';

const params_ = {
  rechazado: (data)=>({numero_documento: data?.DocNum}),
  pendiente: (data)=>({documento_entrada: data?.DocEntry}),
  aprobado: (data)=>({numero_documento: data?.DocNum}),
}

function DetallePlantillaContenido({data, tipoPedido}) {
  const [componentData, setComponentData] = useState(null);
  const {tabActivePedido, indexPedidoCarusel} = useContext(commercialContext)

  useEffect(()=>{
    const getDetalleGeneral = async () => {
      if(tabActivePedido==='contenido'){
        const response = await getDetallePedidoContenido({documento_entrada: data?.DocEntry}, tipoPedido);
        setComponentData(response)
      }
    }
    getDetalleGeneral();
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
  const {tabActivePedido, indexPedidoCarusel} = useContext(commercialContext)
  
  useEffect(()=>{
    const getDetalleGeneral = async () => {
      if(tabActivePedido==='finanzas'){
        const response = await getDetallePedidoFinanzas({...params_[tipoPedido](data), card_code: data.CardCode}, tipoPedido);
        setComponentData(response[0])
      }
    }
    getDetalleGeneral();
   },[tabActivePedido, indexPedidoCarusel]);


  return (
    <>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1"
        variant="no style"
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-primary">Condición de pago:</div>
          <div className='text-secondary tw-text-lg'>{componentData?.condicion_pago || 'NO PRECISA'}</div>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1"
        variant='No style'
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-primary">Lista de precios:</div>
          <div className='text-secondary tw-text-lg'>{componentData?.lista_precio || 'NO PRECISA'}</div>
        </div>
      </ListGroup.Item>
    </>
  )
}

function DetallePlantillaLogistica({data, tipoPedido}) {
  const [componentData, setComponentData] = useState(null);
  const {tabActivePedido, indexPedidoCarusel} = useContext(commercialContext)
  

  useEffect(()=>{
    const getDetalleGeneral = async () => {
      if(tabActivePedido==='logistica'){
        const response = await getDetallePedidoLogistica(params_[tipoPedido](data), tipoPedido);
        setComponentData(response[0])
      }
    }
    getDetalleGeneral();
   },[tabActivePedido, indexPedidoCarusel]);


  return (
    <>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1"
        variant='No style'
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-primary">Direccion fiscal</div>
          <div className='text-secondary tw-text-base'>{componentData?.direccion_fiscal || 'NO PRECISA'}</div>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1"
        variant="no style"
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-primary">Dirección de entrega</div>
          <div className='text-secondary tw-text-base'>{componentData?.direccion_entrega || 'NO PRECISA'}</div>
        </div>
      </ListGroup.Item>
    </>
  )
}

function DetallePlantillaGeneral({data, tipoPedido}) {
  const [componentData, setComponentData] = useState(null);
  const {indexPedidoCarusel, tabActivePedido} = useContext(commercialContext)
  useEffect(()=>{
    const getDetalleGeneral = async () => {
      if(tabActivePedido==='general'){
        const response = await getDetallePedidoGeneral(params_[tipoPedido](data), tipoPedido);
        setComponentData(response[0])
      }
    }
    getDetalleGeneral();
   },[indexPedidoCarusel, tabActivePedido]);

  return (
    <>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1"
        variant="no style"
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-primary">Numero de documento:</div>
          <div className='text-secondary tw-text-lg'>{componentData?.DocNum}</div>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1"
        variant='No style'
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-primary">Codigo de negocio:</div>
          <div className='text-secondary tw-text-lg'>{componentData?.codigo_negocio}</div>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1"
        variant='No style'
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-primary">RUC:</div>
          <div className='text-secondary tw-text-lg'>{componentData?.ruc}</div>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1"
        variant='No style'
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-primary">Razon social:</div>
          <div className='text-secondary tw-text-lg'>{componentData?.razon_social}</div>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1"
        variant='No style'
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-primary">Comentario cliente:</div>
          <div className='text-secondary tw-text-lg'>{componentData?.comentario_usuario || 'SIN COMENTARIO'}</div>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1"
        variant='No style'
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-primary">Comentario vendedor:</div>
          <div className='text-secondary tw-text-lg'>{componentData?.comentarios || 'SIN COMENTARIO'}</div>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1"
        variant='No style'
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-primary">Fecha contable:</div>
          <div className='text-secondary tw-text-lg'>{getHumanDateFormat(componentData?.fecha_contable)}</div>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1"
        variant='No style'
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-primary">Fecha de vencimiento:</div>
          <div className='text-secondary tw-text-lg'>{getHumanDateFormat(componentData?.fecha_vencimiento)}</div>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1"
        variant='No style'
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-primary">Hora de creación:</div>
          <div className='text-secondary tw-text-lg'>{componentData?.hora_creacion}</div>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1"
        variant='No style'
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-primary">Moneda:</div>
          <div className='text-secondary tw-text-lg'>{componentData?.tipo_moneda}</div>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1"
        variant='No style'
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-primary">Total antes del descuento:</div>
          <div className='text-secondary tw-text-lg'>{componentData?.unidad_moneda}.{componentData?.total_antes_descuento}</div>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1"
        variant='No style'
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-primary">Total:</div>
          <div className='text-secondary tw-text-lg'>{componentData?.unidad_moneda}.{componentData?.total}</div>
        </div>
      </ListGroup.Item>
    </>
  )
}

export { DetallePlantillaGeneral, DetallePlantillaLogistica, DetallePlantillaFinanzas, DetallePlantillaContenido}
