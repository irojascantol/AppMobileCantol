import React, { useEffect, useState } from 'react'
// import { Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import '../../style/accordion.css'
import { SearchClientButton } from './Componentes/botones';
import {PedidoModal} from '../../componentes/modal/pedidoModal';
import { BuscarModal } from '../pedido/plantillas/modalPlantilla';
import { getEstadoCuentaCliente } from '../../services/clienteService';
import { CuentaEstadoCard } from './Componentes/tabla';

function EstadoCuenta() {
    //search modal state
    const [searchClientModal,  setSearchClientModal] = useState({show: false, title: '', returnedValue: {cardCode: null, ruc: null, razonsocial: null}, options: [], operacion: null, placeholder: null});
    
    //estado cuesta state list
    const [estadocuenta, setEstadoCuenta] = useState({cliente: {doc: null, name: null}, cuentas: []});

    // searchClientHandler
    const handleSearchClientModal = (obj) =>setSearchClientModal({...searchClientModal, ...obj})
    
    // estadocuenta handler
    const handleEstadoCuenta = (obj) =>setEstadoCuenta({...estadocuenta, ...obj})
    

    //fetch dato estado de cuenta
    const fetchEstadoCuenta = async () => {
        try {
            let params = {
                cardCode: searchClientModal.returnedValue.cardCode
            };
            const response = await getEstadoCuentaCliente(params);
            handleEstadoCuenta({cuentas: response});
            handleSearchClientModal({show:false})
        } catch (error) {
            console.error(error);
        }
    }

    //activa cuando se selecciona un cliente
    useEffect(()=>{
        if(!!searchClientModal.returnedValue.cardCode){
            fetchEstadoCuenta()
        }
    },[searchClientModal.returnedValue.cardCode])
    
    return (
    <>
    {/* Aca vamos a reciclar el modal para buscar cliente de NuevoPedido */}
    <PedidoModal modalTitle={searchClientModal.title} handleClose={()=>handleSearchClientModal({show: false})} show={searchClientModal.show}>
        <BuscarModal buscarModalValues={searchClientModal} handleNewSaleOrder={handleSearchClientModal} handleCloseModal={()=>handleSearchClientModal({show: false})}/>
    </PedidoModal>

    <div className='tw-relative'>
        <h6 className='tw-text-center bg-secondary tw-text-white tw-rounded-md' style={{marginBottom: 0, padding: "5px 0"}}>{'ESTADO DE CUENTA'}</h6>
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
            {
                estadocuenta?.cuentas?.map((item, index)=>{
                    return (<CuentaEstadoCard key={(index + 1 ).toString()} bodyItem={item}/>)
                })
            }
        </Card.Body>
        </Card>
    </div>
    </>
    )
}

export default EstadoCuenta


