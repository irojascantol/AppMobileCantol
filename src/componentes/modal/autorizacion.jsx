import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { commercialContext } from '../../context/ComercialContext';
import Modal from 'react-bootstrap/Modal';

export default function NoAutorizado() {
  const navigate = useNavigate()
  const {
    showSecurity,
    handleClose,
    handleTabPedido,
  } = useContext(commercialContext);
  const handleExit = () => {handleTabPedido('xxx'), sessionStorage.removeItem('CDTToken'); handleClose(); navigate('/');}

  return (
    <>
      <Modal
        show={showSecurity}
        // onHide={()=>{console.log("Hola Mundo")}}
        backdrop={true}
        // backdrop="static"
        // keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Aviso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          La sesion ha caducado, vuelva a ingresar nuevamente.
        </Modal.Body>
        <Modal.Footer>
          {/* <button onClick={handleExit}>Ir a login</button> */}
          <button onClick={handleClose}>Ir a login</button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export { NoAutorizado }
