import React from 'react'
import {DetallePlantillaGeneral, DetallePlantillaLogistica, DetallePlantillaFinanzas, DetallePlantillaContenido} from '../plantillas/detallePlantilla';
import { Pendiente, Aprobado, Rechazado, PendienteChofer, CompletoChofer, Facturado } from '../plantillas/pedidoPlantilla'; 
import { Badge, ListGroup } from 'react-bootstrap'
import { NuevoPedidoCabecera, NuevoPedidoProductos } from '../plantillas/nuevopedidoPlantilla';
import { truncate } from '../../../utils/math';

const plantillas = {
  pendiente: (item)=><Pendiente item={item}/>,
  aprobado:  (item)=><Aprobado item={item}/>,
  rechazado:  (item)=><Rechazado item={item}/>,
  facturado:  (item)=><Facturado item={item}/>,
  pendientechofer: (item)=><PendienteChofer item={item}/>,
  completochofer: (item)=><CompletoChofer item={item}/>,
  general: (data, tipoPedido, tipoDoc)=><DetallePlantillaGeneral data={data} tipoPedido={tipoPedido} tipoDoc={tipoDoc} />,
  logistica: (data, tipoPedido, tipoDoc)=><DetallePlantillaLogistica data={data} tipoPedido={tipoPedido} tipoDoc={tipoDoc} />,
  finanzas: (data, tipoPedido, tipoDoc)=><DetallePlantillaFinanzas data={data} tipoPedido={tipoPedido} tipoDoc={tipoDoc} />,
  contenido: (data, tipoPedido, tipoDoc)=><DetallePlantillaContenido data={data} tipoPedido={tipoPedido} tipoDoc={tipoDoc} />,
  nuevopedidocabecera: (data, y)=><NuevoPedidoCabecera data={data}/>,
  nuevopedidoproductos: (data, y)=><NuevoPedidoProductos data={data}/>,
  nuevopedidototal: (x,y)=><div></div>,
}

const bgColor = {
  aprobado: 'bg-success',
  pendiente: 'bg-warning',
  rechazado:  'bg-danger',
  facturado: 'bg-info'
}

function MyListGroup({data, plantilla, handleCarusel, tipoPedido, modalValues, handleModal, tipoDoc}) {
  //tipoDoc: pedido, entrega
  if(['pendiente', 'aprobado', 'rechazado', 'facturado'].includes(plantilla)){
    return (
      <ListGroup as="ol">
          {/* color de cabecera */}
            <li className={`${bgColor[plantilla] || 'secondary'} tw-h-2 tw-p-0`}/>
            <li className="tw-h-6 bg-secondary tw-flex tw-justify-between tw-items-center">
              <Badge className={`tw-text-black ${bgColor[plantilla] || 'secondary'}`}>{`${plantilla}s`}</Badge>
              <Badge bg="dark" pill>
                Total:&nbsp;&nbsp;S/.{truncate(data?.reduce((acc, cur)=> acc + cur.DocTotal, 0), 2).toLocaleString()}
              </Badge>
            </li>
        {data.map((item, index)=>(
            <li key={(index + 1).toString()} onClick={()=>{handleCarusel(item)}}>
                {plantillas[plantilla](item)}
            </li>
        ))}
      </ListGroup>
    )
  }else if(['pendientechofer', 'completochofer'].includes(plantilla)){
    return (
      <ListGroup as="ol">
        {data.map((item, index)=>(
            <li key={(index + 1).toString()} onClick={()=>{
              handleModal({show: true, modalTitle: 'Seleccione operación',tipomodal: 'selector', options: {numero_documento: item?.numero_documento, DocEntry: item?.DocEntry, tipo_moneda: item?.tipo_moneda}});
              }}>
                {plantillas[plantilla](item)}
            </li>
        ))}
      </ListGroup>
    )
  }
  else if(['general', 'logistica', 'finanzas', 'contenido', 'nuevopedidocabecera', 'nuevopedidoproductos', 'nuevopedidototal' ].includes(plantilla)){
    return(
      <ListGroup as="ol" className={"tw-h-fit tw-bg-gray-500"}>
        {plantillas[plantilla](data, tipoPedido, tipoDoc)}
      </ListGroup>
    )
  }
}

export {MyListGroup}