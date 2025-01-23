import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { MyListGroup } from '../pedido/componentes/MyListGroup';
import { decodeJWT } from '../../utils/decode';
import { obtenerEntregaCompleto, obtenerEntregaPendiente } from '../../services/entregaService';
import EntregaModal from '../../componentes/modal/entregaModal';
import { DetalleEntrega, RegistrarCobro, Selector } from './plantillas/modalPlantilla';

const tipoModal = {
  selector: (modalValues, handlemodal, handleModal_Detalle)=>(<Selector modalValues={modalValues} handleModal={handlemodal} handleModalDetalle={handleModal_Detalle}/>),
  detalle: (modalDetalle, handleModal_Detalle) => (<DetalleEntrega modalDetalle={modalDetalle} handleModalDetalle={handleModal_Detalle}/>),
  cobro: (modalDetalle, handleModal_Detalle) => (<RegistrarCobro modalDetalle={modalDetalle} handleModalDetalle={handleModal_Detalle}/>),
}

export default function Operacion() {
  const { estado } = useParams();
  const [dataList, setDataList] = useState([])
  //modal values
  const [modalValues, setModalValues] = useState({show: false, modalTitle: '', size: 'sm', returnedValue: undefined, options: [], tipomodal:null, operacion:null});
  const [modalDetalle, setModalDetalle] = useState({show: false, modalTitle: '', size: 'sm', returnedValue: undefined, options: [], tipomodal:null, operacion:null, success: false});
  const handleModal = (obj) => {setModalValues({...modalValues, ...obj})}
  const handleModalDetalle = (obj) => {setModalDetalle({...modalDetalle, ...obj})}

  const fetchList = async () => {
    let response = [];
    let {username} = await decodeJWT() || { undefined }
    let body = {
      usuario_codigo: username
    }
    // if(estado === 'completochofer'){
    //   response = await obtenerEntregaCompleto(body)
    // }else if(estado === 'pendientechofer'){
    if(estado === 'pendientechofer' && !!username){
      response = await obtenerEntregaPendiente(body)
      console.log("llega hasta aqui")
      Array.isArray(response) && setDataList([...response])
    }
}

  //obtiene las entregas que estan pendientes y completadas
  useEffect(()=>{
    fetchList()
  },[estado])

  
  //DETECTA CAMBIO DE REGISTRO DE ENTREGA
  useEffect (() => {
    if (modalDetalle.success) {
      fetchList()
    }
  }, [modalDetalle.success])


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
