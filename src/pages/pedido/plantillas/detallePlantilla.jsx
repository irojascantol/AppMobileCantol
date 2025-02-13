import { ListGroup } from 'react-bootstrap'
import React, { useContext, useEffect, useState } from 'react'
import { getDetallePedidoGeneral, getDetallePedidoLogistica, getDetallePedidoFinanzas, getDetallePedidoContenido} from '../../../services/pedidoService'
import { commercialContext } from '../../../context/ComercialContext';
import { getHumanDateReporte } from '../../../utils/humandateformat';
import { Contenido_Articulos } from './pedidoPlantilla';

const params_ = {
  rechazado: (data)=>({numero_documento: data?.DocNum}),
  pendiente: (data)=>({documento_entrada: data?.DocEntry}),
  aprobado: (data)=>({numero_documento: data?.DocNum}),
  facturado: (data)=>({documento_entrada: data?.DocEntry}),
}

function DetallePlantillaContenido({data, tipoPedido, tipoDoc}) {
  const [componentData, setComponentData] = useState(null);
  const {tabActivePedido, indexPedidoCarusel, handleShow} = useContext(commercialContext)

  useEffect(()=>{
    const getDetalleContenido = async () => {
      if(tabActivePedido==='contenido' && !!data?.DocEntry && !tipoDoc){
        const response = await getDetallePedidoContenido({documento_entrada: data?.DocEntry}, tipoPedido);
        //secure shield
        if(response !== undefined){
            await setComponentData(response)
        }else{
            handleShow();
        }
      }else if(tabActivePedido==='contenido' && !!data?.DocEntry && !!tipoDoc){
        const response = await getDetallePedidoContenido({documento_entrada: data?.DocEntry}, tipoPedido, tipoDoc);
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

function DetallePlantillaFinanzas({data, tipoPedido, tipoDoc}) {
  const [componentData, setComponentData] = useState(null);
  const {tabActivePedido, indexPedidoCarusel, handleShow} = useContext(commercialContext)
  
  useEffect(()=>{
    const getDetalleFinanzas = async () => {
      // if(tabActivePedido==='finanzas'){
      if(tabActivePedido==='finanzas' && data?.CardCode){
        // const response = await getDetallePedidoContenido({documento_entrada: data?.DocEntry}, tipoPedido);
        const response = await getDetallePedidoFinanzas({...params_[tipoPedido](data), card_code: data.CardCode}, tipoPedido, tipoDoc);
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
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1 tw-border-t-2 tw-mb-[1px] tw-py-[2px]"
        variant="no style"
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-dark">Condición de pago:</div>
          <div className='text-secondary tw-text-base'>{componentData?.condicion_pago || 'NO PRECISA'}</div>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1 tw-border-t-2 tw-mb-[1px] tw-py-[2px]"
        variant="no style"
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-dark">Dsct. Categoría cliente (%):</div>
          <div className='text-secondary tw-text-base'>{componentData?.descuento || 'NO PRECISA'}</div>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1 tw-border-t-2 tw-border-b-2 tw-mb-[1px] tw-py-[2px]"
        variant='No style'
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-dark">Lista de precios:</div>
          <div className='text-secondary tw-text-base'>{componentData?.lista_precio || 'NO PRECISA'}</div>
        </div>
      </ListGroup.Item>
    </>
  )
}

function DetallePlantillaLogistica({data, tipoPedido, tipoDoc}) {
  const [componentData, setComponentData] = useState(null);
  const {tabActivePedido, indexPedidoCarusel, handleShow} = useContext(commercialContext)

  useEffect(()=>{
    const getDetalleLogistica = async () => {
      if(tabActivePedido==='logistica' && !!data?.DocEntry){
        const response = await getDetallePedidoLogistica(params_[tipoPedido](data), tipoPedido, tipoDoc);
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
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1 tw-border-t-2 tw-mb-[1px] tw-py-[2px]"
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
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1 tw-border-t-2 tw-mb-[1px] tw-py-[2px]"
        variant='No style'
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-dark">Dirección fiscal</div>
          <div className='text-secondary tw-text-base'>{componentData?.direccion_fiscal || 'NO PRECISA'}</div>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1 tw-border-t-2 tw-border-b-2 tw-mb-[1px] tw-py-[2px]"
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

function DetallePlantillaGeneral({data, tipoPedido, tipoDoc}) {
  const [componentData, setComponentData] = useState(null);
  const {indexPedidoCarusel, tabActivePedido, handleShow} = useContext(commercialContext)
  //tipoPedido : pendiente, rechazado y aprobado

  // console.log(data, tipoPedido, tipoDoc)


  useEffect(()=>{
    const getDetalleGeneral = async () => {
      // console.log(tipoPedido, tabActivePedido, indexPedidoCarusel, data?.DocEntry, tipoDoc)
      if(tabActivePedido==='general' && indexPedidoCarusel === 1 && data?.DocEntry && !tipoDoc){
        const response = await getDetallePedidoGeneral(params_[tipoPedido](data), tipoPedido);
        //secure shield
        if(response !== undefined){
            // console.log('1')
            await setComponentData(response[0])
          }else{
            handleShow();
          }
        }else if(!!data?.DocEntry && !!tipoDoc){
          const response = await getDetallePedidoGeneral(params_[tipoPedido](data), tipoPedido, tipoDoc);
        //secure shield
        if(response !== undefined){
          // console.log('2')
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
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1 tw-border-t-2 tw-mb-[1px] tw-py-[2px]"
        variant="no style"
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-dark">Número de documento:</div>
          <div className='text-secondary tw-text-base'>{componentData?.DocNum}</div>
        </div>
      </ListGroup.Item>
      {!!componentData?.factura_folio && (
        <ListGroup.Item
          as="li"
          className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1 tw-border-t-2 tw-mb-[1px] tw-py-[2px]"
          variant="no style"
        >
          <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
            <div className="tw-font-semibold text-dark">Folio:</div>
            <div className='text-secondary tw-text-base'>{componentData?.factura_folio}</div>
          </div>
        </ListGroup.Item>
      )}
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1 tw-border-t-2 tw-mb-[1px] tw-py-[2px]"
        variant='No style'
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-dark">Código de negocio:</div>
          <div className='text-secondary tw-text-base'>{componentData?.codigo_negocio}</div>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1 tw-border-t-2 tw-mb-[1px] tw-py-[2px]"
        variant='No style'
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-dark">RUC:</div>
          <div className='text-secondary tw-text-base'>{componentData?.ruc}</div>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1 tw-border-t-2 tw-mb-[1px] tw-py-[2px]"
        variant='No style'
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-dark">Razón social:</div>
          <div className='text-secondary tw-text-base'>{componentData?.razon_social}</div>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1 tw-border-t-2 tw-mb-[1px] tw-py-[2px]"
        variant='No style'
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-dark">Categoría SN:</div>
          <div className='text-secondary tw-text-base'>{componentData?.categoria_cliente}&nbsp;</div>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1 tw-border-t-2 tw-mb-[1px] tw-py-[2px]"
        variant='No style'
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-dark">Comentario venta:</div>
          {/* <div className='text-secondary tw-text-base'>{componentData?.comentario_usuario || 'SIN COMENTARIO'}</div> */}
          <div className='text-secondary tw-text-base'>{componentData?.comentario_usuario}&nbsp;</div>
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
          <div className='text-secondary tw-text-base'>{componentData?.comentarios || 'SIN COMENTARIO'}</div>
        </div>
      </ListGroup.Item> */}
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1 tw-border-t-2 tw-mb-[1px] tw-py-[2px]"
        variant='No style'
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-dark">Fecha contable:</div>
          <div className='text-secondary tw-text-base'>{tipoPedido === 'facturado'? `${getHumanDateReporte(componentData?.fecha_contable)} ${componentData?.hora}` : getHumanDateReporte(componentData?.fecha_contable)}</div>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1 tw-border-t-2 tw-mb-[1px] tw-py-[2px]"
        variant='No style'
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-dark">Fecha de vencimiento:</div>
          <div className='text-secondary tw-text-base'>{getHumanDateReporte(componentData?.fecha_vencimiento)}</div>
        </div>
      </ListGroup.Item>
      {tipoPedido !== 'facturado' && ( // aqui se muestra la seccion de la hora creacion cuando no es facturado
        <ListGroup.Item
          as="li"
          className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1 tw-border-t-2 tw-mb-[1px] tw-py-[2px]"
          variant='No style'
        >
          <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
            <div className="tw-font-semibold text-dark">Hora de creación:</div>
            <div className='text-secondary tw-text-base'>{componentData?.hora}&nbsp;</div>
          </div>
        </ListGroup.Item>
      )}
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1 tw-border-t-2 tw-mb-[1px] tw-py-[2px]"
        variant='No style'
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-dark">Moneda:</div>
          <div className='text-secondary tw-text-base'>{componentData?.tipo_moneda}</div>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1 tw-border-t-2 tw-mb-[1px] tw-py-[2px]"
        variant='No style'
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-dark">Subtotal:</div>
          <div className='text-secondary tw-text-base tw-font-semibold'>{componentData?.unidad_moneda}.{componentData?.total_antes_descuento}</div>
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1 tw-border-t-2 tw-border-b-2 tw-py-[2px]"
        variant='No style'
      >
        <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
          <div className="tw-font-semibold text-dark">Total:</div>
          <div className='text-secondary tw-text-base tw-font-semibold'>{componentData?.unidad_moneda}.{componentData?.total}</div>
        </div>
      </ListGroup.Item>
    </>
  )
}

export { DetallePlantillaGeneral, DetallePlantillaLogistica, DetallePlantillaFinanzas, DetallePlantillaContenido}
