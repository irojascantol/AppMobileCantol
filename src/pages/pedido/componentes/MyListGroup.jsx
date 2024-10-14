import React from 'react'
import {DetallePlantillaGeneral, DetallePlantillaLogistica, DetallePlantillaFinanzas, DetallePlantillaContenido} from '../plantillas/detallePlantilla';
import { Pendiente, Aprobado, Rechazado, PendienteChofer, CompletoChofer } from '../plantillas/pedidoPlantilla'; 
import { ListGroup } from 'react-bootstrap'
import { NuevoPedidoCabecera, NuevoPedidoProductos } from '../plantillas/nuevopedidoPlantilla';

const plantillas = {
  pendiente: (item)=><Pendiente item={item}/>,
  aprobado:  (item)=><Aprobado item={item}/>,
  rechazado:  (item)=><Rechazado item={item}/>,
  pendientechofer: (item)=><PendienteChofer item={item}/>,
  completochofer: (item)=><CompletoChofer item={item}/>,
  general: (data, tipoPedido)=><DetallePlantillaGeneral data={data} tipoPedido={tipoPedido}/>,
  logistica: (data, tipoPedido)=><DetallePlantillaLogistica data={data} tipoPedido={tipoPedido}/>,
  finanzas: (data, tipoPedido)=><DetallePlantillaFinanzas data={data} tipoPedido={tipoPedido}/>,
  contenido: (data, tipoPedido)=><DetallePlantillaContenido data={data} tipoPedido={tipoPedido}/>,
  nuevopedidocabecera: (data, y)=><NuevoPedidoCabecera data={data}/>,
  nuevopedidoproductos: (data, y)=><NuevoPedidoProductos data={data}/>,
  nuevopedidototal: (x,y)=><div></div>,
}

const bgColor = {
  aprobado: 'bg-success',
  pendiente: 'bg-warning',
  rechazado:  'bg-danger',
}

function MyListGroup({data, plantilla, handleCarusel, tipoPedido, modalValues, handleModal}) {
  if(['pendiente', 'aprobado', 'rechazado'].includes(plantilla)){
    return (
      <ListGroup as="ol">
          {/* color de cabecera */}
            <li className={`${bgColor[plantilla] || 'secondary'} tw-h-3`}></li>
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
        {plantillas[plantilla](data, tipoPedido)}
      </ListGroup>
    )
  }
}

export {MyListGroup}