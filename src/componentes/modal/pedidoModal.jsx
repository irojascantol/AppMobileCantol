import Modal from 'react-bootstrap/Modal';
import '../../style/pedidoModal.css'

function PedidoModal({tipomodal, size, children, handleClose, show, modalTitle}) {
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" className={tipomodal === 'Final_Pedido'?'custom-modal':''}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {children}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default PedidoModal;