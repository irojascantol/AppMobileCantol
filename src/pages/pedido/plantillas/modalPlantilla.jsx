import React, { useContext, useEffect, useRef, useState } from 'react'
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Spinner from 'react-bootstrap/Spinner';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import { useDebounce } from 'use-debounce';
import { getClientePorFiltro, getProductoPorFiltro, getTransportistaPorFiltro } from '../../../services/clienteService';
import { decodeJWT } from '../../../utils/decode';
import { BsSearch } from 'react-icons/bs';
import { upSelectedOption } from '../../../utils/array';
import { commercialContext } from '../../../context/ComercialContext';
import { getCreditoAnticipo, obtenerDescuentoDocumento } from '../../../services/pedidoService';
import { useAsyncError } from 'react-router-dom';
import { mergeComments } from '../utils';
import ReCAPTCHA from 'react-google-recaptcha';
import { getCurrentLocation } from '../../../utils/location';


const fetchFunctions = {
    Cliente: (body)=>getClientePorFiltro(body),
    Producto: (body)=>getProductoPorFiltro(body),
    Transportista: (body)=>getTransportistaPorFiltro(body)
}

const body = {
    Cliente: (item)=>(<><div className="tw-font-medium tw-text-md">{item.razon_social}</div>
                <div className='text-secondary tw-text-sm'>{item.numero_documento}</div></>),
    Producto: (item)=>(<>
                <div className="tw-font-medium tw-text-sm">{item?.descripcion}</div>
                <div className='text-secondary tw-font-medium tw-text-sm'>{item.codigo}</div>
                <div className='tw-flex tw-justify-between'>
                    <div className='text-secondary tw-font-medium tw-text-sm'>Precio: <span className='text-dark'>{item?.unidad_moneda} {item.precio}</span></div>
                    <div className='text-secondary tw-font-medium tw-text-sm'>Stock Real: <span className='text-dark'>{item.stock}</span></div>
                </div>
                </>),
    Transportista:  (item)=>(<>
                <div className="tw-font-medium tw-text-md">{item?.nombre_transporte}</div>
                <div className='text-secondary tw-text-sm'>{item?.ruc_transportista}</div>
                </>),
}

const fillData = {
    Cliente: (item, nuevoPedido)=>({
        cliente_codigo: item.codigo,
        codigogrupo: item.codigo_grupo_pago,
        condicionpago: upSelectedOption(item.condicion_pago_general, item.condicion_pago),
        ruc: item.numero_documento,
        razonsocial: item.razon_social,
        telefono: item.telefono,
        moneda: item.tipo_moneda,
        direccionentrega: item.direccion_entrega,
        grupo_familia: item.grupo_familia,
        montos: {...nuevoPedido.montos, total_cred_anti: nuevoPedido.montos.total, anticipo: 0, nota_credito: 0},
        canal_familia: {codigo_canal: item?.codigo_canal_cliente, nombre_canal: item?.canal_cliente},
        ubicacion: item?.ubicacion_cliente,
    }),
    Producto: (item, products, nuevoPedido)=>{
        return {products: [...products, item]}
    },
    Transportista: (item)=>({
        ructransporte: {
            codigo_transporte: item?.codigo_trasnportista,
            nombre_transporte: item?.nombre_transporte,
            documento_transporte: item?.ruc_transportista,
            }
        })
    }


function CustomToggle({ children, eventKey, isCollapse, setIsCollapse, prevState}) {
    const buttonRef = useRef(null);
    const clickHandler = (event) => {
        undefined
    }

    useEffect(() => {
        buttonRef.current.addEventListener('click', clickHandler);
    }, []);
    
    useEffect(() => {
        if(isCollapse.state == true && prevState.current == false){
            buttonRef.current.click();
            prevState.current = true;
        }else if(isCollapse.state == false && prevState.current == true){
            buttonRef.current.click();
            prevState.current = false;
        }
      }, [isCollapse]);

    const decoratedOnClick = useAccordionButton(eventKey);
  
    return (
      <button
        ref={buttonRef}
        type="button"
        style={{ backgroundColor: 'pink' , visibility: 'hidden'}}
        className='tw-h-0'
        onClick={decoratedOnClick}
      >
        {children}
      </button>
    );
  }

function BuscarModal({buscarModalValues, handleNewSaleOrder, handleCloseModal}) {
    const [isCollapse,  setIsCollapse] = useState({toggle: false, state: false});
    const [dataSearch, setDataSearch ] = useState([]);
    const [textFilter, setTextFilter ] = useState('');
    const [isSpinner,  setIsSpinner] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [debounceTextFilter] = useDebounce(textFilter, 500);
    const {handleInputTextModal, showInputTextModal, nuevoPedido, isClientChanged, handleClienteChange} = useContext(commercialContext)
    const prevState = useRef(false)

    useEffect(()=>{
        const doFetch = async () => {
            if(!!textFilter){
                let value = await decodeJWT()
                setIsSpinner(true)
                let response = []
                response = await fetchFunctions[buscarModalValues.operacion]({usuario_codigo: value?.username, filtro: textFilter, cliente_codigo: buscarModalValues?.options[0]?.cliente_codigo})
                setDataSearch([...response.slice(0, 14)])
                setIsSpinner(false)
                if(!![...response.slice(0, 14)].length && !!textFilter){
                    if(!!isCollapse.state){prevState.current = isCollapse.state;}
                    setIsCollapse({toggle: !isCollapse.toggle, state: true});
                }else{
                    if(!!isCollapse.state){prevState.current = isCollapse.state;}
                    setIsCollapse({toggle: !isCollapse.toggle, state: false});
                }
            }else{
                if(!!isCollapse.state){prevState.current = isCollapse.state;}
                setIsCollapse({toggle: !isCollapse.toggle, state: false});
            }
        }
        doFetch()
    },[debounceTextFilter])


    //aqui se define la cantidad del producto seleccionado
    useEffect(()=>{
        if (Number(showInputTextModal.returnedValue) > 0){
            handleNewSaleOrder(fillData[buscarModalValues?.operacion]({...currentItem, cantidad: Number(showInputTextModal.returnedValue), descuento: 0, dsct_porcentaje: 0}, buscarModalValues?.options[0]?.products))
            handleInputTextModal({returnedValue: null}) //deja en null returnedValue para en el primer render no se active estas condicionales
            handleCloseModal();
        }else if(showInputTextModal.returnedValue !== null && Number(showInputTextModal.returnedValue) === 0){
            alert("La cantidad debe ser mayor a cero")
        }
    },[showInputTextModal.returnedValue])
    
    const agregarItem = async (item) => {
        //revisar si el producto ya esta agregado
        if(buscarModalValues?.operacion === 'Producto') {
            let tmpList = buscarModalValues.options[0]?.products;
            if(tmpList.findIndex((item_list)=>(item_list.codigo === item.codigo)) === -1){
                //abre el modal para ingresar la cantidad
                handleInputTextModal({show: true, modalTitle: 'Ingrese cantidad', tipomodal: 'text', operacion: 'agregarProducto', returnedValue: null, options: {stock: item.stock}})
                //graba el item seleccionado para grabar cantidad en useeffect
                setCurrentItem(item)

        }else{alert("El producto ya se encuentra agregado");}
        }else if(buscarModalValues?.operacion === 'Cliente'){
            let tmpCliente = fillData[buscarModalValues?.operacion](item, nuevoPedido)
            //obtener por primera vez el descuento por documento
            if (!!tmpCliente?.condicionpago[0] && tmpCliente?.canal_familia){
                let body = {
                    PaymentGroupCode: tmpCliente?.condicionpago[0]?.PaymentGroupCode,
                    codigo_canal_cliente: tmpCliente?.canal_familia?.codigo_canal,
                }
                let descuentoDoc = await obtenerDescuentoDocumento(body)
                //formato de llegada {"descuento_documento": valor}
                //seteo del descuento para todo el documento
                if (!!descuentoDoc){
                    //activa el caso de que se cambie un cliente, debe actualizas descuentos
                    if(!!isClientChanged.dsct){handleClienteChange({active: true})}
                    handleNewSaleOrder({...fillData[buscarModalValues?.operacion](item, nuevoPedido), montos: {...nuevoPedido.montos,
                        descuento: descuentoDoc?.descuento_documento, 
                        anticipo: 0, nota_credito: 0, 
                        total_cred_anti: (nuevoPedido?.montos.total || 0)},
                        comentarios: {...nuevoPedido.comentarios, nota_anticipo: ''}, 
                    });
                    handleCloseModal();
                }else{
                    handleNewSaleOrder(fillData[buscarModalValues?.operacion](item, nuevoPedido));
                    handleCloseModal();
                }
            }
        }else if(buscarModalValues?.operacion === 'Transportista'){
            handleNewSaleOrder(fillData[buscarModalValues?.operacion](item));
            handleCloseModal();
        }
    }

    return (
        <>
        <Accordion defaultActiveKey="1" flush>
            <Card>
                <div className='tw-h-12'>
                    <Form.Group className="tw-w-100 tw-flex" controlId="PedidoModalForm.ControlInput1">
                        <Form.Control
                        type="text"
                        placeholder={buscarModalValues.placeholder}
                        onChange={(x)=>{setTextFilter(x.target.value)}}
                        autoComplete='off'
                        />
                        <InputGroup.Text className='tw-w-10 tw-block tw-h-10'>
                            {isSpinner ? (<Spinner animation="border" role='status' size='sm' variant='secondary'/>): <BsSearch size={15}/>}
                        </InputGroup.Text>
                    </Form.Group>
                    <CustomToggle eventKey="0" isCollapse={isCollapse} setIsCollapse={setIsCollapse} prevState={prevState}>Click me!</CustomToggle>
                </div>
                {/* </Card.Header> */}
                <Accordion.Collapse eventKey="0">
                    <ListGroup>
                        {dataSearch.map((item, index)=>(
                            <ListGroup.Item key={(index+3).toString()} className='active:tw-border-yellow-400 active:tw-border-2'>
                                <div className="ms-0 me-auto" onClick={()=>{
                                    agregarItem(item);
                                    }}>
                                    <div>
                                        {body[buscarModalValues?.operacion](item)}
                                    </div>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Accordion.Collapse>
            </Card>
        </Accordion>
        </>
  )
}

function IngresarTexto({modalValues, handleInputTextModal, handleNewSaleOrder, type}){
    let initComment = modalValues?.operacion === 'comentarios' ? (modalValues?.options?.vendedor || ''): '';
    type = modalValues?.operacion === 'comentarios' ? 'text' : type;
    let rows = modalValues?.operacion === 'comentarios' ? 3 : 1;
    let as = modalValues?.operacion === 'comentarios' ? 'textarea' : 'input';
    const [ value,  setValue ] = useState(initComment)
    return(
    <Form onSubmit={(x)=>{x.preventDefault()}}>
        <Form.Control
        type={type}
        id="inputPassword5"
        value={value}
        autoComplete='off'
        onChange={(x)=>{
            setValue(x.target.value);
        }}
        rows={rows}
        as={as}
      />
        <div className='tw-w-full tw-flex tw-justify-end'>
            <button className='button-4 tw-w-fit tw-mt-2 tw-text-yellow-400 bg-dark' onClick={()=>{
                    if(modalValues.operacion === 'comentarios'){
                        handleNewSaleOrder({comentarios: {...modalValues?.options, vendedor: value.toString().trim()}}); 
                        handleInputTextModal({show: false});
                    }else if(modalValues.operacion === 'agregarProducto'){
                        if(value > modalValues?.options?.stock){
                            alert('La cantidad debe ser menor al stock')
                        }else{
                            handleInputTextModal({show: false, returnedValue: value});
                        }
                    }else{
                        handleNewSaleOrder({ructransporte: value}); 
                        handleInputTextModal({show: false});
                    }
                    }}>
                    Ingresar
            </button>
        </div>
    </Form>
    )
}

function IngresarFecha({nuevopedido, modalValues, handleInputTextModal, handleNewSaleOrder, type}){
    return(
        <Form.Group controlId="duedate">
        <Form.Control
            type={type}
            min={modalValues.options}
            value={nuevopedido?.fentrega}
            onChange={(e) =>{handleNewSaleOrder({fentrega: e.target.value}), handleInputTextModal({show: false})}}
          />
    </Form.Group>
    )
}

function SelectorCombo({modalValues, handleInputTextModal, handleNewSaleOrder, type}){
    return(
    <Form.Select aria-label="Default select example" onChange={async (x)=>{
        let tmpObj = {}
        //cuando operacion es "Condicionpago" ordena el item seleccinado a primera posicion por grupo de pago
        tmpObj[modalValues.operacion] = upSelectedOption(modalValues.options, x.target.value, modalValues.operacion);
        if (modalValues.operacion === 'condicionpago'){
            //actualizar el dsct documento
            if(!!modalValues?.data?.canal_familia?.codigo_canal && !!tmpObj?.condicionpago){
                let body = {
                    PaymentGroupCode: tmpObj?.condicionpago[0]?.PaymentGroupCode,
                    codigo_canal_cliente: modalValues?.data?.canal_familia?.codigo_canal,
                }
                let descuentoDoc = await obtenerDescuentoDocumento(body)
                //formato de llegada {"descuento_documento": valor}
                //seteo del descuento para todo el documento
                if (!!descuentoDoc){
                    handleNewSaleOrder({...tmpObj, montos: {...modalValues?.data?.montos, descuento: descuentoDoc?.descuento_documento}});
                    handleInputTextModal({show: false});
                }else{
                    handleNewSaleOrder(tmpObj);
                    handleInputTextModal({show: false});
                }
            }
        }else{
            handleNewSaleOrder(tmpObj);
            handleInputTextModal({show: false});
        }

    }}>

    {modalValues.options.map((x, index)=>{
        if(modalValues?.operacion === 'direccionentrega'){
            return (
                    <option key={(index+1).toString()} value={x?.direccion_codigo}>{x?.direccion_entrega}</option>
                ) 
            }
        else if(modalValues?.operacion === 'condicionpago'){
                return (
                    <option key={(index+1).toString()} value={x?.PaymentGroupCode}>{x?.PymntGroup}</option>
                )
        }else{
                return (
                    <option key={(index+1).toString()} value={x}>{x}</option>
                )
            }
        })
    }
    </Form.Select>
    )
}

function Anticipo_Credito({nuevopedido, modalValues, handleInputTextModal, handleNewSaleOrder}){
    const [inputNC, setInputNC] = useState(modalValues.options.nota_credito);
    const [inputFA, setInputFA] = useState(modalValues.options.anticipo);
    const [dataclient, setDataClient] = useState(null);
    useEffect(()=>{
        //obtiene credito y anticipo
        const fetchData = async() =>{
            let response = await getCreditoAnticipo({cliente_codigo: nuevopedido.cliente_codigo});
            setDataClient(response[0])
        }
        dataclient === null && fetchData()
    },[])

    return(
        <ListGroup as="ol" className='tw-flex tw-gap-2 tw-pb-1'>
            <ListGroup.Item className='tw-px-2 tw-py-1 tw-flex tw-justify-start tw-flex-col tw-gap-2' variant='secondary'>
                <div className='myFontFamily tw-font-medium tw-text-left tw-w-[188px]'>Total facturas de anticipo:</div>
                <div className='tw-flex tw-justify-start tw-gap-2'>
                    <div className='myFontFamily tw-font-medium tw-text-right tw-w-[188px]'>{`Disponible: S/.${!!dataclient?.anticipo?dataclient?.anticipo:'0'}`}</div>
                    <input type='number' value={!inputFA ? '': inputFA} disabled={!dataclient?.anticipo} onChange={(event)=>{setInputFA(event.target.value)}} 
                    className='tw-block tw-min-w-[130px] tw-bg-white' placeholder='Ingrese monto' onBlur={e => {
                        if (inputFA && !isNaN(inputFA))
                            setInputFA(Math.min(dataclient?.anticipo, Math.max(0, inputFA)));
                      }}/>
                </div>
            </ListGroup.Item>
            <ListGroup.Item className='tw-px-2 tw-py-1 tw-flex tw-justify-start tw-flex-col tw-gap-2' variant='secondary'>
                <div className='myFontFamily tw-font-medium tw-text-left tw-w-[188px]'>Total notas de crédito:</div>
                <div className='tw-flex tw-justify-start tw-gap-2 tw-w-full'> 
                    <div className='myFontFamily tw-font-medium tw-text-right tw-w-[188px]'>{`Disponible: S/.${!!dataclient?.nota_credito?dataclient?.nota_credito:'0'}`}</div>
                    <input type='number' value={!inputNC ? '': inputNC} disabled={!dataclient?.nota_credito} onChange={(event)=>{setInputNC(event.target.value)}} 
                    className='tw-min-w-[130px] tw-bg-white' placeholder='Ingrese monto' onBlur={e => {
                        if (inputNC && !isNaN(inputNC))
                            setInputNC(Math.min(dataclient?.nota_credito, Math.max(0, inputNC)));
                      }}/>
                </div>
            </ListGroup.Item>
            <ListGroup.Item className='tw-px-2 tw-py-1 tw-flex tw-justify-start tw-flex-col tw-gap-2' variant='secondary'>
            <button className='button-4 tw-w-full' onClick={()=>{handleInputTextModal({show: false, returnedValue: {anticipo: Number(inputFA), nota_credito: Number(inputNC)}})}}>
                    {(!!dataclient?.nota_credito || !!dataclient?.anticipo) ? 'Aplicar' : 'Regresar'}
            </button>
            </ListGroup.Item>
        </ListGroup>
    )
}

function Institucional_Campo(params){
    const [input, setinput] = useState({oc: '', cmp1: '', cmp2: '', cmp3: ''});
    const handleInput = (obj) => setinput({...input, ...obj})

    const guardarDatosInstitucional = () => {
        //oc obligatorio
        //quita espacio en blanco
        let newOc = input.oc.trim();
        if(!!newOc.length){
            params.handleNewSaleOrder({institucional: input})
            params.handleInputTextModal({show: false})
            // params.handleInputTextModal({show: false, returnedValue: {body: input}})
        }else{
            alert("Ingrese orden de compra")
        }
    }

    return (
        <ListGroup as="ol" className='tw-flex tw-gap-2 tw-pb-1'>
            <ListGroup.Item className='tw-px-2 tw-py-1 tw-flex tw-justify-start tw-flex-row tw-gap-1' variant='secondary'>
                <div className='myFontFamily tw-font-medium tw-text-left tw-w-[188px]'>Orden de compra:</div>
                <input type='text' value={input.oc.toUpperCase()} disabled={false} onChange={(event)=>{handleInput({oc: event.target.value})}} className='tw-block tw-bg-white' placeholder='Ingrese OC'/>
            </ListGroup.Item>
            <ListGroup.Item className='tw-px-2 tw-py-1 tw-flex tw-justify-start tw-flex-col tw-gap-2' variant='secondary'>
                <div className='myFontFamily tw-font-medium tw-text-left tw-w-[188px]'>Campo 1:</div>
                <div className='tw-flex tw-justify-start tw-gap-1 tw-w-full'> 
                    <input type='text' value={input.cmp1} disabled={false} onChange={(event)=>{handleInput({cmp1 :event.target.value})}} 
                    className='tw-bg-white tw-w-full' placeholder='Ingrese nombre de proyecto'/>
                </div>
            </ListGroup.Item>
            <ListGroup.Item className='tw-px-2 tw-py-1 tw-flex tw-justify-start tw-flex-col tw-gap-2' variant='secondary'>
                <div className='myFontFamily tw-font-medium tw-text-left tw-w-[188px]'>Campo 2:</div>
                <div className='tw-flex tw-justify-start tw-gap-1 tw-w-full'> 
                    <input type='text' value={input.cmp2} disabled={false} onChange={(event)=>{handleInput({cmp2 :event.target.value})}}
                    className='tw-bg-white tw-w-full' placeholder='Ingrese dirección de entrega'/>
                </div>
            </ListGroup.Item>
            <ListGroup.Item className='tw-px-2 tw-py-1 tw-flex tw-justify-start tw-flex-col tw-gap-2' variant='secondary'>
                <div className='myFontFamily tw-font-medium tw-text-left tw-w-[188px]'>Campo 3:</div>
                <div className='tw-flex tw-justify-start tw-gap-1 tw-w-full'> 
                    <input type='text' value={input.cmp3} disabled={false} onChange={(event)=>{handleInput({cmp3 :event.target.value})}}
                    className='tw-bg-white tw-w-full' placeholder='Ingrese contacto'/>
                </div>
            </ListGroup.Item>
            <ListGroup.Item className='tw-px-2 tw-py-1 tw-flex tw-justify-start tw-flex-col tw-gap-2' variant='secondary'>
            <button className='button-4 tw-w-full' onClick={guardarDatosInstitucional}>
            {/* <button className='button-4 tw-w-full'> */}
                {'Guardar'}
            </button>
            </ListGroup.Item>
        </ListGroup>
    )
}

// // function Final_Pedido({
// //     nuevopedido,
// //     modalValues,
// //     handleInputTextModal,
// //     handleNewSaleOrder,
// // }){
    // const guardarOV = async () => {
        //obtiene latitud y longitud
        // let currentLocation = await getCurrentLocation();
        // //crea cuerpo de post para enviar al SL
        // let body = {
        //     CardCode: nuevopedido?.cliente_codigo,
        //     DocDueDate: nuevopedido?.fentrega,
        //     U_MSSM_CLM: nuevopedido?.numero,
        //     DiscountPercent: nuevopedido?.montos?.descuento || 0,
        //     Comments: mergeComments(nuevopedido?.comentarios.vendedor, nuevopedido?.comentarios.nota_anticipo),
        //     PaymentGroupCode: nuevopedido?.condicionpago[0]?.PaymentGroupCode,
        //     FederalTaxID: nuevopedido?.ruc || '',
        //     ShipToCode: nuevopedido?.direccionentrega[0]?.direccion_codigo || '',
        //     U_MSSL_RTR: nuevopedido?.ructransporte?.documento_transporte || '',
        //     U_MSSF_CEX1: nuevopedido?.institucional?.cmp1,
        //     U_MSSF_CEX2: nuevopedido?.institucional?.cmp2,
        //     U_MSSF_CEX3: nuevopedido?.institucional?.cmp3,
        //     U_MSSF_ORDC: nuevopedido?.institucional?.oc,
        //     grupo_familia: nuevopedido?.grupo_familia,
        //     ubicacion: nuevopedido?.ubicacion,
        //     U_DIS_LATITU: currentLocation?.latitud?.toString() || null,
        //     U_DIS_LONGIT: currentLocation?.longitud?.toString() || null,
        //     DocumentLines: nuevopedido?.products?.map((product)=>({
        //       ItemCode: product?.codigo,
        //       Quantity: product?.cantidad,
        //       TaxCode: product?.impuesto?.codigo,
        //       UnitPrice: product?.precio,
        //       DiscountPercent: product?.dsct_porcentaje,
        //       U_MSSC_NV1: product?.dsct_porcentaje,
        //       U_MSSC_NV2: 0,
        //       U_MSSC_NV3: 0,
        //       U_MSSC_DSC: product?.dsct_porcentaje,
        //       U_MSS_ITEMBONIF: ('tipo' in product)?'Y':'N',
        //       U_MSSC_BONI: ('tipo' in product)?'Y':'N',
        //     }))
        // }
// //         console.log(body)
// //         const response = await guardarNuevoPedido(body);
// //     }
// //     // funcion para el catpcha

// //     function onChange(value) {
// //       console.log("Captcha value:", value);
// //     }

// //     return(
// //         <>
// //         <div className='tw-h-20'>
// //             <ReCAPTCHA
// //               sitekey="6Lfiy1MqAAAAAHcepIzS3inu4JEisDbyKWfaXuDp"
// //               onChange={onChange}
// //               style={{transform: 'scale(.89)', transformOrigin: '0 0'}}
// //             />,
// //         </div>
// //         <div>
// //             <button className='button-14 tw-w-full tw-h-10 tw-my-4 tw-font-sans tw-font-medium' disabled={false} style={{margin: '0 auto'}} onClick={guardarOV}>
// //                 Validar Operación
// //             </button>
// //         </div>
// //         </>
// //     )
// // }



export {BuscarModal, IngresarTexto, IngresarFecha, SelectorCombo, Anticipo_Credito, Institucional_Campo}