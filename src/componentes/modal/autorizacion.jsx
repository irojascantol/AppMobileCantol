import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { commercialContext } from '../../context/ComercialContext';
import Modal from 'react-bootstrap/Modal';

export default function NoAutorizado() {
  const navigate = useNavigate()
  const {
    showSecurity,
    handleClose,
  } = useContext(commercialContext);
  const handleExit = () => {sessionStorage.removeItem('CDTToken'); handleClose(); navigate('/');}

  return (
    <>
      <Modal
        show={showSecurity}
        onHide={()=>{console.log("Hola Mundo")}}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Aviso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          No cuenta con autorización para revisar  este contenido.
        </Modal.Body>
        <Modal.Footer>
          <button onClick={handleExit}>Ir a inicio</button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export { NoAutorizado }
