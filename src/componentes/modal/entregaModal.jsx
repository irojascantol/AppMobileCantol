import Modal from 'react-bootstrap/Modal';
// import '../../style/pedidoModal.css'

function EntregaModal({size, children, handleClose, show, modalTitle}) {
  return (
    <>
      <Modal size={size} show={show} onHide={handleClose} backdrop='static'>
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

export default EntregaModal;