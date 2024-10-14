import { useEffect, useState } from "react";
import { Dropdown, DropdownButton, Form, ListGroup } from "react-bootstrap";
import { BsFillWalletFill, BsListCheck, BsTruck } from "react-icons/bs"
import { obtenerEntregaDetalle, obtenerRegistro, registrarEntrega } from "../../../services/entregaService";
import { truncate } from "../../../utils/math";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import '../../../style/modalPlantillaEntrega.css'

function Selector({modalValues, handleModal, handleModalDetalle}){
    return (
        <div className="tw-flex tw-justify-evenly">
            <div className="tw-flex tw-flex-col tw-items-center tw-w-12">
                <button className="tw-p-2 tw-rounded"><BsListCheck size={22} onClick={()=>{
                    handleModal({show: false});
                    handleModalDetalle({show: true, tipomodal: 'detalle', modalTitle: 'Detalle de entrega', options: modalValues?.options});
                }}/></button>
                <p className="tw-text-center tw-leading-[19px]">Ver detalle</p>
            </div>
            <div className="tw-flex tw-flex-col tw-items-center tw-w-12">
                <button className="tw-p-2 tw-rounded"><BsFillWalletFill size={22} onClick={()=>{
                    handleModal({show: false});
                    handleModalDetalle({show: true, tipomodal: 'cobro', modalTitle: 'Registrar entrega', options: modalValues?.options});
                }}/></button>
                <p className="tw-text-center tw-leading-[19px]">Registrar entrega</p>
            </div>
            {/* <div className="tw-flex tw-flex-col tw-items-center tw-w-12">
                <button className="tw-p-2 tw-rounded"><BsTruck size={22}/></button>
                <p className="tw-text-center tw-leading-[19px]">Actualizar entrega</p>
            </div> */}
        </div>
    )
}

function DetalleEntrega({modalDetalle, handleModalDetalle}){
    //estado cabecera
    const [fields, setFields] = useState(
    [
        {key:'Estado de entrega:', value: null , clave: 'estado_entrega'},
        {key:'Estado de liquidación:', value: null , clave: 'estado_liquidacion'},
        {key:'Comentario chofer:', value: null , clave: 'comentario_chofer'},
        {key:'Contacto:', value: null , clave: 'contacto'},
        {key:'Telefono:', value: null , clave: 'telefono'},
        {key:'Condición de pago', value: null , clave: 'condicion_pago'},
        {key:'Total', value: null , clave: 'total'},
        {key:'Moneda', value: null , clave: 'tipo_moneda'},
    ]
    )

    //estado productos
    const [products, setProducts] = useState([])

    const handleFields = (fields_) => setFields(fields_);
    const handleProducts = (obj) => setProducts(obj);

    //const fetch cabecera y detalle
     useEffect(()=>{
         const fetchDetalleEntrega = async () => {
            
            let body = {
                numero_documento: modalDetalle?.options?.numero_documento,
            }
            const response = await obtenerEntregaDetalle(body);
            //aqui llena con data los valores de los campos
            if (Array.isArray(response) && !!response.length){
                let tmpFields = [...fields];
                Object.keys(response[0]).forEach(key=>{
                    let index = fields.findIndex(item=>item.clave === key);
                    if (index !== -1){
                        let tmpField = {...fields[index]};
                        tmpField = {...tmpField, value: response[0][key]};
                        tmpFields[index] = tmpField;
                    }
                })
                handleFields(tmpFields)
                //aqui actualiza los productos
                let tmpLines = [...response[0]?.lineas]
                handleProducts(tmpLines)
            }
        }
        fetchDetalleEntrega();
     }, []) 
     
        const objeto = fields.reduce((acc, {key, value, clave}) => {
        acc[clave] = value;
        return acc;
        }, {});

         return (
                <>
                <Tabs
                    defaultActiveKey="home"
                    id="uncontrolled-tab-example"
                    className="mb-3"
                >
                    <Tab eventKey="home" title="General" className="custom-tab">
                        <ListGroup as="ol" className='tw-flex tw-gap-2 tw-pb-1'>
                            {fields.map((item, index)=>(
                                <ListGroup.Item className='tw-px-2 tw-py-1 tw-gap-0' variant='secondary' key={(index + 3).toString()}>
                                    <div className='myFontFamily tw-font-medium tw-text-left tw-w-[188px]'>{item?.key}</div>
                                    <div className='tw-flex tw-justify-start tw-w-full'>
                                        {`${item?.value || ''}`}&nbsp;
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Tab>
                    <Tab eventKey="products" title="Productos" className="custom-tab">
                        <div className="tw-bg-white tw-h-[517px] tw-p-1 tw-rounded-md tw-overflow-y-scroll" style={{border: '1px solid gray'}}>
                            <ListGroup as="ol" className='tw-flex tw-gap-2 tw-pb-1'>
                                {products.map((item, index)=>(
                                    <ListGroup.Item className='tw-px-2 tw-py-2 tw-flex tw-justify-between' variant='secondary' key={(index + 3).toString()}>
                                        <div>
                                            <div>
                                            <div className="tw-text-sm tw-font-medium">Descripción:</div>
                                            <div className='myFontFamily tw-font-normal tw-text-left tw-text-sm'>{item?.descripcion}</div>
                                            </div>
                                            <div>
                                            <div className="tw-text-sm tw-font-medium">Código:</div>
                                            <div className='myFontFamily tw-font-normal tw-justify-betweenm tw-text-left'>{item?.codigo_articulo}</div>
                                            </div>
                                        </div>
                                        <div className="tw-flex tw-flex-col tw-justify-between">
                                            <div>
                                            <div className="tw-text-sm tw-font-medium">Cantidad:</div>
                                            <div className='myFontFamily tw-font-normal tw-text-left'>{item?.cantidad}</div>
                                            </div>
                                            <div>
                                            <div className="tw-text-sm tw-font-medium">Precio:</div>
                                            <div className='myFontFamily tw-font-normal tw-text-left'>{`${objeto?.tipo_moneda} ${truncate(item?.precio,2)}`}</div>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </div>
                    </Tab>
                </Tabs>

                <button className='button-4 tw-w-full tw-mt-3' onClick={()=>{handleModalDetalle({show: false})}}>
                    {'Regresar'}
                </button>
                </>

            )
        }

const estado_entrega = {
    1: "Pendiente",
    2: "Despacho sin cobranza",
    3: "Despacho con cobranza",
    4: "Despacho a courier",
    5: "No despachado",
}

const estado_liquidacion = {
    1: "Pendiente de liquidación",
    2: "Liquidado",
    3: "Rechazado",
}

const tipo_pago = {
    1: "Efectivo",
    2: "Transferencia/Deposito",
}



function RegistrarCobro({modalDetalle, handleModalDetalle}){
    //body state
    const [body, setBody] = useState({entrega: null , liquidacion: null, tipopago: null, monto: null, nrooperacion: '', comentarios: '', docTotal: 0});
    //handler body
    const handleBody = (obj) => setBody({...body, ...obj})
    //hadler select
    const handleSelect = (dropdown, eventKey) => {
        if (dropdown === 'entrega'){
            if(eventKey === '3'){
                handleBody({entrega:  eventKey})
            }else{
                handleBody({entrega: eventKey, liquidacion: null, tipopago: null, monto: null, nrooperacion: ''})
            }
        }else if(dropdown === 'liquidacion'){
            if(eventKey === '2'){
                handleBody({liquidacion:  eventKey})
            }else{
                handleBody({liquidacion: eventKey, tipopago: null, monto: null, nrooperacion: ''})
            }
        }else if(dropdown === 'tipopago'){
            handleBody({tipopago:  eventKey})
        }
     }

     useEffect(()=>{
        let response = null;
        const obtenerDatos = async () => {
            let body_params = {
                DocEntry: (modalDetalle?.options?.DocEntry).toString()
            }
            response = await obtenerRegistro(body_params)
            handleBody({
                entrega: (response?.U_MSS_ESTRA || '1'),
                liquidacion:  (response?.U_MSS_ESLI),
                tipopago: response?.U_MSS_TIPAG,
                nrooperacion: (response?.U_MSS_NUMOP || ''),
                comentarios:  (response?.U_MSSM_COM || ''),
                docTotal: response?.DocTotal,
                monto: (response?.U_MSS_MONLIQ || 0)
            })
        }
        obtenerDatos();
        }, [])

     //guardar
     const guardarRegistro = async() =>
        {
            if(body?.entrega !== null){
                let body_ = {
                    DocEntry: modalDetalle?.options?.DocEntry || null,
                    U_MSS_TIPAG: body?.tipopago || null,
                    U_MSS_MONEDA: modalDetalle?.options?.tipo_moneda || null,
                    U_MSS_MONLIQ: body?.monto || null,
                    U_MSS_NUMOP: body?.nrooperacion  || null,
                    U_MSS_ESLI: body?.liquidacion || null,
                    U_MSS_ESTRA: body?.entrega || null,
                    U_MSS_ESTLIQ: body?.entrega || null,
                    U_MSSM_COM: body?.comentarios || null,
                }
                let response = await registrarEntrega(body_);
                if (response === 200){
                    alert('Registrado satisfactoriamente')
                    handleModalDetalle({show: false})
                }else{
                    alert('Error al guardar')
                }
            }else{
                alert("Debe ingresar estado de entrega")
            }
        }

         return (
                <>
                <div className="tw-bg-red tw-h-fit tw-p-1 tw-rounded-md">
                    <ListGroup as="ol" className='tw-flex tw-gap-2 tw-pb-1'>
                        <ListGroup.Item className='tw-min-h-fit tw-h-fit tw-px-2 tw-py-2 tw-flex tw-flex-col tw-justify-between tw-gap-3'>
                            
                            <Form>
                                <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label>Estado de entrega:</Form.Label>
                                <Dropdown data-bs-theme="light" onSelect={(eventKey) => handleSelect('entrega', eventKey)}>
                                    <Dropdown.Toggle id="dropdown-button-dark-example1" variant={body?.entrega?"success":'secondary'}>
                                        {estado_entrega[body?.entrega] || 'Estado entrega'}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className="tw-w-full" style={{ backgroundColor: '#f8f9fa', color: '#000' }}>
                                        <Dropdown.Item eventKey="1">Pendiente</Dropdown.Item>
                                        <Dropdown.Item eventKey="2">Despacho sin cobranza</Dropdown.Item>
                                        <Dropdown.Item eventKey="3">Despacho con cobranza</Dropdown.Item>
                                        <Dropdown.Item eventKey="4">Despacho a courier</Dropdown.Item>
                                        <Dropdown.Item eventKey="5">No despachado</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                </Form.Group>
                            </Form>


                            {body?.entrega === '3' && (
                                <Form>
                                <Form.Group controlId="exampleForm.ControlSelect2">
                                <Form.Label>Estado de liquidación:</Form.Label>
                                <Dropdown data-bs-theme="light" onSelect={(eventKey) => handleSelect('liquidacion', eventKey)}>
                                    <Dropdown.Toggle id="dropdown-button-dark-example2" variant={body?.liquidacion?"success":'secondary'}>
                                    {estado_liquidacion[body?.liquidacion] || 'Estado de liquidación'}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className="tw-w-full" style={{ backgroundColor: '#f8f9fa', color: '#000' }}>
                                        <Dropdown.Item eventKey={'1'}>Pendiente de liquidación</Dropdown.Item>
                                        <Dropdown.Item eventKey={'2'}>Liquidado</Dropdown.Item>
                                        <Dropdown.Item eventKey={'3'}>Rechazado</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                </Form.Group>
                            </Form>
                                )
                            }   
                  
                            {body?.liquidacion === '2' && (
                                <Form>
                                    <Form.Group controlId="exampleForm.ControlSelect3">
                                    <Form.Label>Tipo de pago:</Form.Label>
                                    <Dropdown data-bs-theme="light" onSelect={(eventKey) => handleSelect('tipopago', eventKey)}>
                                        <Dropdown.Toggle id="dropdown-button-dark-example3" variant={body?.tipopago?"success":'secondary'}>
                                            {tipo_pago[body?.tipopago] || 'Tipo de pago'}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="tw-w-full" style={{ backgroundColor: '#f8f9fa', color: '#000' }}>
                                            <Dropdown.Item eventKey={'1'}>Efectivo</Dropdown.Item>
                                            <Dropdown.Item eventKey={'2'}>Transferencia/Deposito</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    </Form.Group>
                                </Form>
                                )
                            }
                            {(body?.tipopago == '1' || body?.tipopago == '2' ) && (
                                <Form onSubmit={(event)=>{event.preventDefault()}}>
                                    <Form.Label>{`Monto a liquidar: (Max: ${body?.docTotal})`}</Form.Label>
                                    <Form.Control type="number" placeholder="s/." value={(body?.monto || '').toString()} max={100} onChange={(e)=>{
                                        if(Number(e.target.value) <= Number(body?.docTotal)){
                                            handleBody({monto: Number(e.target.value)});
                                        }else{
                                            alert('Monto no puede ser mayor al total del documento');
                                        }
                                    }}/>   
                                </Form>
                                )
                            }

                            {body?.tipopago === '2' && (
                                <Form onSubmit={(event)=>{event.preventDefault()}}>
                                    <Form.Label>Numero de operación:</Form.Label>
                                    <Form.Control type="text" value={(body?.nrooperacion || '').toString()} onChange={(e)=>handleBody({nrooperacion: e.target.value})}/>   
                                </Form>
                                )
                            }
                            <hr className="tw-my-0"/>
                            <Form>
                                <Form.Label>Observaciones:</Form.Label>
                                <Form.Control as="textarea" rows={3}  value={body?.comentarios || ''} onChange={(e)=>handleBody({comentarios: e.target.value})} />
                            </Form>
                        </ListGroup.Item>
                    </ListGroup>
                </div>
                <button className='button-4 tw-w-full tw-mt-3' onClick={guardarRegistro}>
                    {'Registrar'}
                </button>
                </>

            )
        }
        
export {Selector, DetalleEntrega, RegistrarCobro}