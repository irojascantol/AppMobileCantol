import Modal from 'react-bootstrap/Modal';
import '../../style/pedidoModal.css'
import { Button } from 'react-bootstrap';

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

function PedidoModal_Oferta({show, handleTipoCoti}) {
  return (
    <>
      <Modal show={show} backdrop="static" size='sm'>
        <Modal.Header closeButton>
          <Modal.Title className='tw-text-lg tw-font-medium'>¿Tipo de cotización?</Modal.Title>
        </Modal.Header>
        <Modal.Footer className='tw-flex tw-justify-evenly'>
          <Button variant="primary" onClick={()=>{handleTipoCoti('N')}} size='sm'>
            Venta sin stock
          </Button>
          <Button variant="primary" onClick={()=>{handleTipoCoti('Y')}} size='sm'>
            Propuesta de venta
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export {PedidoModal, PedidoModal_Oferta} ;