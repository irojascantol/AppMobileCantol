import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { MyListGroup } from '../pedido/componentes/MyListGroup';
import { decodeJWT } from '../../utils/decode';
import { obtenerEntregaCompleto, obtenerEntregaPendiente } from '../../services/entregaService';
import EntregaModal from '../../componentes/modal/entregaModal';
import { DetalleEntrega, RegistrarCobro, Selector } from './plantillas/modalPlantilla';

const tipoModal = {
  selector: (modalValues, handlemodal, handleModalDetalle)=>(<Selector modalValues={modalValues} handleModal={handlemodal} handleModalDetalle={handleModalDetalle}/>),
  detalle: (modalDetalle, handleModalDetalle) => (<DetalleEntrega modalDetalle={modalDetalle} handleModalDetalle={handleModalDetalle}/>),
  cobro: (modalDetalle, handleModalDetalle) => (<RegistrarCobro modalDetalle={modalDetalle} handleModalDetalle={handleModalDetalle}/>),
}

export default function Operacion() {
  const { estado } = useParams();
  const [dataList, setDataList] = useState([])
  //modal values
  const [modalValues, setModalValues] = useState({show: false, modalTitle: '', size: 'sm', returnedValue: undefined, options: [], tipomodal:null, operacion:null});
  const [modalDetalle, setModalDetalle] = useState({show: false, modalTitle: '', size: 'sm', returnedValue: undefined, options: [], tipomodal:null, operacion:null});
  const handleModal = (obj) => {setModalValues({...modalValues, ...obj})}
  const handleModalDetalle = (obj) => {setModalDetalle({...modalDetalle, ...obj})}

  //obtiene las entregas que estan pendientes y completadas
  useEffect(()=>{
      let response = [];
      const fetchList = async () => {
      let {username} = await decodeJWT()
      let body = {
        usuario_codigo: username
      }
      if(estado === 'completochofer'){
        response = await obtenerEntregaCompleto(body)
      }else if(estado === 'pendientechofer'){
        response = await obtenerEntregaPendiente(body)
      }
      Array.isArray(response) && setDataList([...response])
    }
    fetchList()
  },[estado])

  return (
    <>
      {/* /Modal Selector/ */}
      {!!modalValues.tipomodal && (
        <EntregaModal tipomodal={modalValues.tipomodal} size={modalValues.size} modalTitle={modalValues.modalTitle} handleClose={()=>handleModal({show: false})} show={modalValues.show}>
          {tipoModal[modalValues.tipomodal](modalValues, handleModal, handleModalDetalle)}
        </EntregaModal>
      )}

      {!!modalDetalle.tipomodal && (
        <EntregaModal tipomodal={modalDetalle.tipomodal} size={modalDetalle.size} modalTitle={modalDetalle.modalTitle} handleClose={()=>handleModalDetalle({show: false})} show={modalDetalle.show}>
          {tipoModal[modalDetalle.tipomodal](modalDetalle, handleModalDetalle)}
        </EntregaModal>
      )}

      <div>
        <MyListGroup data={dataList} plantilla={estado} modalValues={modalValues} handleModal={handleModal}/>
      </div>
    </>
  )
}
