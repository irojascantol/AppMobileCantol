import React, { useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card';
import '../../style/accordion.css'
import { SearchClientButton } from './Componentes/botones';
import {PedidoModal} from '../../componentes/modal/pedidoModal';
import { BuscarModal } from '../pedido/plantillas/modalPlantilla';
import { ListGroup } from 'react-bootstrap';
import { DocumentoCard } from './Componentes/tarjetas';
import { getFacturaPDF, getListarFacturas, getListarNotaCredito } from '../../services/clienteService';
import PDFVisualizer from './Componentes/PDFVisualizer';
import { ReporteClienteModal } from '../../componentes/modal/reporteClienteModal';
import { BsDownload } from 'react-icons/bs';
import { Combate } from '../../componentes/Selector';
// import { DisabledByDefault } from '@mui/icons-material';


// const titles = {
//     factura: 'FACTURAS POR CLIENTE',
//     notacredito: 'NOTAS DE CREDITO POR CLIENTE',
// }


const documents = [
    {
        id: -1,
        text: 'Tipo de documento',
    },
    {
        id: 0,
        text: 'Facturas',
    },
    {
        id: 1,
        text: 'Notas de credito'
    }
]



function Documentos({tipo}) {
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

    // selector tipo documento
    const [docType, setDocType] =  useState('-1') // -1 para Seleccionar documento

    // PDF Handler
    const handlePDF = async (route) => {
        try {
            let params = {
                ruta: route
            };
            const response = await getFacturaPDF(params);
            const pdfUrl = URL.createObjectURL(response);

            const downloadPdfFile = (route_) => {
                const fileName = route_.split('\\').pop()
                // Crear un enlace para descargar el archivo
                const a = document.createElement('a');
                a.href = pdfUrl;
                a.download = fileName;  // Nombre con el que se descargará el archivo
                a.click();  // Simula el clic para iniciar la descarga

                // Liberamos la URL del Blob para evitar fugas de memoria
                URL.revokeObjectURL(pdfUrl);
            }
            

            //aqui vamos a poner el boton de descargar el pdf
            // handlePdfVisualizer({show: true, title: (<div></div>)'Visualizador 🔍', URL: pdfUrl});
            handlePdfVisualizer({show: true, title: (<div className='tw-flex tw-gap-10 tw-items-center'>
                                                        <p className='tw-my-0'>Visualizador 🔍</p>
                                                        <button 
                                                        className='button-14 tw-p-1 tw-h-fit tw-flex tw-items-center tw-gap-2 tw-mt-2'
                                                        onClick={()=>downloadPdfFile(route)}
                                                        >
                                                        <p className='tw-py-0 tw-mb-0'>Descargar</p>
                                                        <BsDownload size={15}/></button>
                                                    </div>), URL: pdfUrl});
        } catch (error) {
            console.error(error);
        }
    }
    
    //fetch dato estado de cuenta
    const fetchFacturas = async () => {
        try {
            if(docType === '0'){ // 0 para facturas
                let params = {
                    cardCode: searchClientModal.returnedValue.cardCode
                };
                const response = await getListarFacturas(params);
                handleFacturas({lista: response.result});
                handleSearchClientModal({show:false})
            }else if(docType === '1'){ // 1 para notas de credito
                let params = {
                    cardCode: searchClientModal.returnedValue.cardCode
                };
                const response = await getListarNotaCredito(params);
                handleFacturas({lista: response.result});
                handleSearchClientModal({show:false});
            }
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

    //handler Combate
    const onChange = (event) => {
        const {value, name} = event.target;
        if(name === 'cmb_tipo_doc'){
            setDocType(value.toString())
            handleFacturas({lista: []}); //limpia lista
        }
    }
    
    return (
    <>
    {/* Aca vamos a reciclar el modal para buscar cliente de NuevoPedido */}
    <PedidoModal modalTitle={searchClientModal.title} handleClose={()=>handleSearchClientModal({show: false})} show={searchClientModal.show}>
        <BuscarModal buscarModalValues={searchClientModal} handleNewSaleOrder={handleSearchClientModal} handleCloseModal={()=>handleSearchClientModal({show: false})}/>
    </PedidoModal>

    <div className='tw-relative'>
        {/* <h6 className='tw-text-center bg-secondary tw-text-white tw-rounded-md' style={{marginBottom: 0, padding: "5px 0"}}>{titles[tipo] || ''}</h6> */}
        <h6 className='tw-text-center bg-secondary tw-text-white tw-rounded-md' style={{marginBottom: 0, padding: "5px 0"}}>Documentos por cliente</h6>
        <Card >
        <Card.Header className='tw-px-2'>
            <Combate options={documents} onChange={onChange} cmb_name={'cmb_tipo_doc'} value={docType}/>
        </Card.Header> 
        <Card.Header className='tw-px-2'>
            <SearchClientButton disabled={docType === '-1'} onClick={()=>{handleSearchClientModal({title: 'Buscar cliente', 
            show: true, 
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
                            <DocumentoCard key={(index+1).toString()} item={item} handlePDF={handlePDF} tipo={docType}/>
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

export default Documentos