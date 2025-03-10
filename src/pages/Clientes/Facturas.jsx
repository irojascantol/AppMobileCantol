import React, { useEffect, useState } from 'react'
// import { Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import '../../style/accordion.css'
import { SearchClientButton } from './Componentes/botones';
import {PedidoModal} from '../../componentes/modal/pedidoModal';
import { BuscarModal } from '../pedido/plantillas/modalPlantilla';
import { ListGroup } from 'react-bootstrap';
import { FacturaCard } from './Componentes/tarjetas';
import { getFacturaPDF, getListarFacturas } from '../../services/clienteService';
import PDFVisualizer from './Componentes/PDFVisualizer';
import { ReporteClienteModal } from '../../componentes/modal/reporteClienteModal';



function FacturasCliente() {
    //search modal state
    const [searchClientModal,  setSearchClientModal] = useState({show: false, title: '', returnedValue: {cardCode: null, ruc: null, razonsocial: null}, options: [], operacion: null, placeholder: null});
    
    //PDF Visualizer modal
    const [pdfVisualizer,  setPdfVisualizer] = useState({show: false, title: '', URL: null, size: 'lg'});

    // handle PDF Visualizer modal
    const handlePdfVisualizer = (obj) => setPdfVisualizer({...pdfVisualizer, ...obj})
    
    // state for client receipt
    const [facturas, setFacturas] = useState({cliente: {doc: null, name: null}, lista: []});

    // searchClientHandler
    const handleSearchClientModal = (obj) =>setSearchClientModal({...searchClientModal, ...obj})
    
    // facturas handler
    const handleFacturas = (obj) =>setFacturas({...facturas, ...obj})

    // PDF Handler
    const handlePDF = async (route) => {
        try {
            let params = {
                ruta: route
            };
            const response = await getFacturaPDF(params);
            const pdfUrl = URL.createObjectURL(response);
            handlePdfVisualizer({show: true, title: 'Visualizador 🔍', URL: pdfUrl});
        } catch (error) {
            console.error(error);
        }
    }
    
    //fetch dato estado de cuenta
    const fetchFacturas = async () => {
        try {
            let params = {
                cardCode: searchClientModal.returnedValue.cardCode
            };
            const response = await getListarFacturas(params);
            handleFacturas({lista: response.result});
            handleSearchClientModal({show:false})
        } catch (error) {
            console.error(error);
        }
    }

    //activa cuando se selecciona un cliente
    useEffect(()=>{
        if(!!searchClientModal.returnedValue.cardCode){
            fetchFacturas()
        }
    },[searchClientModal.returnedValue.cardCode])

    
    return (
    <>
    {/* Aca vamos a reciclar el modal para buscar cliente de NuevoPedido */}
    <PedidoModal modalTitle={searchClientModal.title} handleClose={()=>handleSearchClientModal({show: false})} show={searchClientModal.show}>
        <BuscarModal buscarModalValues={searchClientModal} handleNewSaleOrder={handleSearchClientModal} handleCloseModal={()=>handleSearchClientModal({show: false})}/>
    </PedidoModal>

    <div className='tw-relative'>
        <h6 className='tw-text-center bg-secondary tw-text-white tw-rounded-md' style={{marginBottom: 0, padding: "5px 0"}}>{'FACTURAS POR CLIENTE'}</h6>
        <Card >
        <Card.Header className='tw-px-2'>
            <SearchClientButton onClick={()=>{handleSearchClientModal({title: 'Buscar cliente', show: true, 
            operacion: 'SoloCliente', 
            placeholder: 'Ingrese Razon Social o RUC', 
            returnedValue: {cardCode: null, ruc: searchClientModal.returnedValue.ruc, razonsocial: searchClientModal.returnedValue.razonsocial }})}}/>
        </Card.Header> 
        <Card.Header className='tw-flex tw-flex-col tw-items-start tw-py-1 tw-gap-1'>
            <div className='tw-flex tw-justify-center'>
                <Card.Title className='tw-text-base tw-mb-0'>RUC/DNI:&nbsp;</Card.Title>
                {/* <Card.Text>{searchClientModal?.returnedValue.ruc || (<>&nbsp;</>)}</Card.Text> */}
                <Card.Text>{searchClientModal?.returnedValue.ruc || (<span className='tw-text-gray-500'>[********************]</span>)}</Card.Text>
            </div>
            <div className='tw-flex tw-justify-center'>
                <Card.Title className='tw-text-base tw-mb-0'>Razón social:&nbsp;</Card.Title>
                {/* <Card.Text>{searchClientModal?.returnedValue.razonsocial || (<>&nbsp;</>)}</Card.Text> */}
                <Card.Text>{searchClientModal?.returnedValue.razonsocial || (<span className='tw-text-gray-500'>[********************]</span>)}</Card.Text>
            </div>
        </Card.Header>
        <Card.Body className='tw-flex tw-flex-col tw-gap-3'>
            <ListGroup as="ul" className='tw-flex tw-gap-2'>
            {
                facturas.lista.map((item, index)=>{
                    return (
                        // <ListGroup.Item key={(index+1).toString()} as="li" disabled={false}>
                            <FacturaCard key={(index+1).toString()} item={item} handlePDF={handlePDF} />
                        // </ListGroup.Item>
                            )
                 })
             }
            </ListGroup>
        </Card.Body>
        </Card>
    </div>
    <ReporteClienteModal size={pdfVisualizer.size} handleClose={()=>handlePdfVisualizer({show:false})} show={pdfVisualizer.show} modalTitle={pdfVisualizer.title}>
        <PDFVisualizer pdfFile={pdfVisualizer.URL}/>
    </ReporteClienteModal>
    </>
    )
}

export default FacturasCliente