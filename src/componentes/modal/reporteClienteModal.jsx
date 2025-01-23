import React from 'react'
import { Modal } from 'react-bootstrap'

function ReporteClienteModal({size, children, handleClose, show, modalTitle}) {
  return (
    <Modal show={show} onHide={handleClose} backdrop="static" size={size}>
        <Modal.Header closeButton>
            <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {children}
        </Modal.Body>
    </Modal>
  )
}

export {ReporteClienteModal}
