// import Button from 'react-bootstrap/Button';
import React, { useContext, useEffect, useRef, useState } from 'react'
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Spinner from 'react-bootstrap/Spinner';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import { useDebounce } from 'use-debounce';
import { getClientePorFiltro, getProductoPorFiltro, getTransportistaPorFiltro } from '../../../services/clienteService';
import { decodeJWT } from '../../../utils/decode';
import { BsCheckCircle, BsSearch } from 'react-icons/bs';
import { upSelectedOption } from '../../../utils/array';
import { commercialContext } from '../../../context/ComercialContext';
import { getCreditoAnticipo, obtenerDescuentoDocumento } from '../../../services/pedidoService';
import { addOneDecimal } from '../../../utils/math';
import { Button } from 'react-bootstrap';
import { useSnackbar } from 'notistack';

const fetchFunctions = {
    Cliente: (body)=>getClientePorFiltro(body),
    SoloCliente: (body)=>getClientePorFiltro(body),
    Producto: (body, isQuotation)=>getProductoPorFiltro(body, isQuotation),
    Transportista: (body)=>getTransportistaPorFiltro(body)
}

const body = {
    Cliente: (item)=>(<><div className="tw-font-medium tw-text-md">{item.razon_social}</div>
                <div className='text-secondary tw-text-sm'>{item.numero_documento}</div></>),
    SoloCliente: (item)=>(<><div className="tw-font-medium tw-text-md">{item.razon_social}</div>
                <div className='text-secondary tw-text-sm'>{item.numero_documento}</div></>),
    Producto: (item, isQuotation, isSelected = false)=>(<>
                <div className='tw-flex tw-gap-1'>
                    <div className="tw-font-medium tw-text-sm">{item?.descripcion}</div>
                    {isSelected && <div><BsCheckCircle className='tw-flex tw-flex-col bg-success tw-rounded-lg' color='white'/></div>}
                </div>
                <div className='text-secondary tw-font-medium tw-text-sm'>{item.codigo}</div>
                <div className='tw-flex tw-justify-between'>
                    <div className='text-secondary tw-font-medium tw-text-sm'>Precio: <span className='text-dark'>{item?.unidad_moneda} {item.precio}</span></div>
                    <div className='text-secondary tw-font-medium tw-text-sm'>{!isQuotation?'Stock Real: ': 'Stock en transito'} <span className='text-dark'>{item.stock}</span></div>
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
        condicionpago: upSelectedOption(item.condicion_pago_general, item.codigo_grupo_pago, 'condicionpago'),
        ruc: item.numero_documento,
        razonsocial: item.razon_social,
        telefono: item.telefono,
        moneda: item.tipo_moneda,
        direccionentrega: item?.direccion_entrega,
        grupo_familia: item.grupo_familia,
        montos: {...nuevoPedido.montos, total_cred_anti: nuevoPedido.montos.total, anticipo: 0, nota_credito: 0},
        canal_familia: {codigo_canal: item?.codigo_canal_cliente, nombre_canal: item?.canal_cliente},
        ubicacion: item?.ubicacion_cliente,
        descuento: item?.descuento,
        dsctCateName: item?.descuento?.categoria_cliente || '',
        dsctCateCode: item?.categoria_cliente_codigo || null,
        segmentacion_cliente: item?.segmentacion_cliente || null,
        fecha_compra: item?.fecha_compra || null,
        monto_facturado: item?.monto_facturado || null,
        ructransporte: !item?.codigo_transportista ? null : { //aqui se agrega los datos del transportista cuando es zona Lima
            codigo_transporte: item?.codigo_transportista,
            nombre_transporte: item?.nombre_transporte,
            documento_transporte: item?.ruc_transportista,
            direccion_transportista: item?.direccion_trasnportista,
            distrito_transportista: item?.distrito_transportista
        }
    }),
    SoloCliente: (item, nuevoPedido)=>({
        cardCode: item.codigo,
        ruc: item.numero_documento,
        razonsocial: item.razon_social,
    }),
    Producto: (items, products, nuevoPedido)=>{
        return {products: [...products].concat(items)}
    },
    // Producto: (item, products, nuevoPedido)=>{
    //     return {products: [...products, item]}
    // },
    Transportista: (item)=>({
        ructransporte: {
            codigo_transporte: item?.codigo_trasnportista,
            nombre_transporte: item?.nombre_transporte,
            documento_transporte: item?.ruc_transportista,
            direccion_transportista: item?.direccion_trasnportista,
            distrito_transportista: item?.distrito_transportista
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

function BuscarModal({buscarModalValues, handleNewSaleOrder, handleCloseModal, isQuotation}) {
    const [isCollapse,  setIsCollapse] = useState({toggle: false, state: false});
    const [dataSearch, setDataSearch ] = useState([]);
    const [textFilter, setTextFilter ] = useState('');
    const [isSpinner,  setIsSpinner] = useState(false);

    //Items retenidos para seleccion masiva
    const [heldItems, setHeldItems]  = useState([]); 


    const [debounceTextFilter] = useDebounce(textFilter, 500);
    const {handleInputTextModal, showInputTextModal, nuevoPedido, isClientChanged, handleClienteChange, handleClose, dsctFormato, handleDescuento} = useContext(commercialContext)
    const prevState = useRef(false)

    const { enqueueSnackbar } = useSnackbar();

    const imprimir_mensaje = (itemName, variant) => {
        enqueueSnackbar(itemName, { variant, autoHideDuration: 1000 });
    }

    useEffect(()=>{
        const doFetch = async () => {
            if(!!textFilter){
                let value = await decodeJWT()
                setIsSpinner(true)
                let response = []
                response = await fetchFunctions[buscarModalValues.operacion]({usuario_codigo: value?.username, filtro: textFilter, cliente_codigo: buscarModalValues?.options[0]?.cliente_codigo}, isQuotation)
                setDataSearch([...response.slice(0, 100)])
                setIsSpinner(false)
                if(!![...response.slice(0, 100)].length && !!textFilter){
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

    const agregarItem = async (item) => {
        //revisar si el producto ya esta agregado
        if(buscarModalValues?.operacion === 'Producto') {
            
            let tmpList = buscarModalValues.options[0]?.products;

            //verifica item que no este en lista principal
            if(tmpList.findIndex((item_list)=>(item_list.codigo === item.codigo)) === -1){
                
                //verifica si pedido es mayor al stock y si no es cotizacion
                if(item.stock < 1 && !isQuotation){
                    imprimir_mensaje('Producto sin stock', 'secondary')
                }else{
                    let copiedHeldItems = [...heldItems]
                    let index = copiedHeldItems.findIndex((item_)=>(item_.codigo === item.codigo)) 
                    //verifica item que no este en lista suspendida
                    if( index === -1){
                        setHeldItems([...heldItems].concat({...item, cantidad: 1, descuento: 0, dsct_porcentaje: 0, stockMax: item.stock})) //agrega el item a la lista de items suspendidos
                        // imprimir_mensaje(`Agregado: ${item?.descripcion}`, 'secondary')
                    }
                    else{ 
                        copiedHeldItems.splice(index, 1); //elimina item
                        setHeldItems(copiedHeldItems) //setea lista a estado lista suspedndida
                        imprimir_mensaje('¡Producto eliminado!', 'error')
                    }
                }
            }else{
                imprimir_mensaje('Ya existe en la lista principal', 'warning')
            }

        }else if(buscarModalValues?.operacion === 'Cliente'){
            let tmpCliente = fillData[buscarModalValues?.operacion](item, nuevoPedido)
            
            //obtener por primera vez el descuento por documento
            if (!!tmpCliente?.condicionpago[0] && tmpCliente?.canal_familia){
                let body = {
                    PaymentGroupCode: (tmpCliente?.condicionpago[0]?.PaymentGroupCode).toString(),
                    codigo_canal_cliente: (tmpCliente?.canal_familia?.codigo_canal).toString(),
                }
                let descuentoDoc = await obtenerDescuentoDocumento(body)

                //ESTA PARTE DEFINE LAS CONDICIONES INICIALES DE LOS DESCUENTOS QUE NO SON DE CATEGORIA
                let { categoria, ...restoDesc} = tmpCliente.descuento;
                // Iterar sobre las propiedades de descuento y agregar el campo "selected"
                for (let key in restoDesc) {
                    if (restoDesc[key].hasOwnProperty('dft')) {
                        restoDesc[key].selected = 0.0; //carga por defecto 0 sin descuento
                    }
                }

                handleDescuento({
                    dsctDoc: {
                        dsct1: {
                            // selected: parseFloat(tmpCliente?.descuento?.categoria?.dft) || 0.0,  
                            selected: parseFloat(tmpCliente?.descuento?.categoria?.dft) || 0.0,
                            min: parseFloat(tmpCliente?.descuento?.categoria?.min) || 0.0, 
                            max: parseFloat(tmpCliente?.descuento?.categoria?.max) || 0.0,
                            catName: tmpCliente?.descuento?.categoria?.nombre || '',
                            default: parseFloat(tmpCliente?.descuento?.categoria?.dft) || 0.0,
                        },  //por categoria cliente general
                        dsctFP: {value: descuentoDoc?.descuento_documento, enabled: false}, //forma de pago
                        ...{restoDesc} //otros descuentos que son evaluados a nivel de detalle
                        }
                })

                descuentoDoc === 406 && handleClose() //Si retorna 406, activa ventana bloqueo 
                
                if (descuentoDoc !== 406 && !!descuentoDoc){ //Verifica que exista data en consulta descuento_documento
                    //activa el caso de que se cambie un cliente, debe actualizas descuentos
                    // if(!!isClientChanged.dsct){handleClienteChange({active: true})}
                    //solo identificamos el cambio del cliente
                    
                    handleClienteChange({active: !isClientChanged.active}) //revisar para que existe esta parte

                    handleNewSaleOrder({...fillData[buscarModalValues?.operacion](item, nuevoPedido), montos: {...nuevoPedido.montos,
                        // descuento: descuentoDoc?.descuento_documento, //esto se reemplaza por nuevo codigo, inicia en 0.0
                        descuento: 0.0, 
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
        }else if(buscarModalValues?.operacion === 'SoloCliente'){
            let tmpCliente = fillData[buscarModalValues?.operacion](item, nuevoPedido)
            if(!!tmpCliente){
                handleNewSaleOrder({returnedValue: {cardCode: tmpCliente.cardCode, ruc: tmpCliente.ruc, razonsocial: tmpCliente.razonsocial}})
                //el modal se cierra el useEffect
            }
        }else if(buscarModalValues?.operacion === 'Transportista'){
            handleNewSaleOrder(fillData[buscarModalValues?.operacion](item));
            handleCloseModal();
        }
    }

    /**
     * Funcion que migra lista suspendida a lista principal
     */
    const migrarListaSuspendida = () => {
        handleNewSaleOrder(fillData[buscarModalValues?.operacion]([...heldItems], buscarModalValues?.options[0]?.products))
        handleCloseModal(); //cierra modal
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
                            <Button 
                                variant="success" 
                                id="button-addon2" 
                                className={`tw-flex tw-justify-center tw-items-center tw-px-0 ${heldItems.length ? '!tw-w-36' : '!tw-w-12'}`}
                                onClick={migrarListaSuspendida}
                                disabled={!heldItems.length}
                            >
                                {isSpinner ? 
                                    (<Spinner animation="border" role='status' size='sm' variant='white'/>) : 
                                    (!heldItems.length ? 
                                        (<BsSearch size={15}/>) : 
                                        (<h className='tw-text-sm tw-h-fit'>{`Agregar (${heldItems.length})`}</h>))
                                    }
                                {/* Agregar */}
                            </Button>
                        </Form.Group>
                        <CustomToggle eventKey="0" isCollapse={isCollapse} setIsCollapse={setIsCollapse} prevState={prevState}>Click me!</CustomToggle>
                    </div>
                    {/* </Card.Header> */}
                    <Accordion.Collapse eventKey="0">
                        {/* Aca se va colocar la altura del scroll */}
                        <ListGroup className='tw-max-h-[800px] tw-overflow-y-scroll'> 
                            {dataSearch.map((item, index)=>(
                                <ListGroup.Item key={(index+3).toString()} className='active:tw-border-yellow-400 active:tw-border-2'>
                                    <div className="ms-0 me-auto" onClick={()=>{
                                        agregarItem(item);
                                        }}>
                                        <div>
                                            {/* Si el item existe en lista temporal, envia true para pintar circle check icon, lo de abajo*/}
                                            {/*(([...heldItems].findIndex((item_)=>(item_.codigo === item.codigo))) !== -1)*/}
                                            {body[buscarModalValues?.operacion](item, isQuotation, (([...heldItems].findIndex((item_)=>(item_.codigo === item.codigo))) !== -1) )}
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

function IngresarTexto({modalValues, handleInputTextModal, handleNewSaleOrder, type, isQuotation}){
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

                        //verifica si pedido es mayor al stock y si no es cotizacion
                        if(value > modalValues?.options?.stock && !isQuotation){
                            alert('La cantidad debe ser menor al stock')
                        }else{
                            if(Number(value)<1)
                                // verifica que no se negativo
                                alert('La cantidad no debe ser menor a 1')
                            else
                                handleInputTextModal({show: false, returnedValue: {value, itemCode: modalValues?.options?.itemCode}});
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

function SelectorCombo({modalValues, handleInputTextModal, handleNewSaleOrder, type, handleDescuentoDoc}){
    const {dsctFormato} = useContext(commercialContext)
    return(
    <Form.Select aria-label="Default select example" onChange={async (x)=>{
        let tmpObj = {}
        //cuando operacion es "Condicionpago" ordena el item seleccinado a primera posicion por grupo de pago
        tmpObj[modalValues.operacion] = upSelectedOption(modalValues.options, x.target.value, modalValues.operacion);
        if (modalValues.operacion === 'condicionpago'){
            //actualizar el dsct documento
            if(!!modalValues?.data?.canal_familia?.codigo_canal && !!tmpObj?.condicionpago){
                //cambios a tipo de dato string por que backend no acepta otros formatos
                let body = {
                    PaymentGroupCode: (tmpObj?.condicionpago[0]?.PaymentGroupCode).toString(),
                    codigo_canal_cliente: (modalValues?.data?.canal_familia?.codigo_canal).toString(),
                }

                let descuentoDoc = await obtenerDescuentoDocumento(body)
                descuentoDoc === 406 && handleClose()

                //formato de llegada {"descuento_documento": valor}
                //seteo del descuento para todo el documento
                if (descuentoDoc !== 406 && !!descuentoDoc){
                    let dsctReducir = dsctFormato?.dsctDoc?.dsctFP?.enabled ? dsctFormato?.dsctDoc?.dsctFP?.value : 0
                    handleNewSaleOrder({...tmpObj, 
                        montos: {...modalValues?.data?.montos, 
                        descuento: (modalValues?.data?.montos?.descuento - dsctReducir)}}); //Quita descuento F. Pago al descuento total documento, mantiene por categoria
                        // descuento: (dsctReducir)}}); //Quita descuento F. Pago al descuento total documento, mantiene por categoria
                    handleDescuentoDoc({dsctFP: {value: descuentoDoc?.descuento_documento, enabled: false}})
                    handleInputTextModal({show: false});
                }else if(descuentoDoc !== 406){
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
            response === 406 && alert("Su sesión ha caducado, vuelva ingresar nuevamente.")
            if (response !== 406 && !!response){
                setDataClient(response[0])
            }
        }
        dataclient === null && fetchData()
    },[])

    return(
        <ListGroup as="ol" className='tw-flex tw-gap-2 tw-pb-1'>
            <ListGroup.Item className='tw-px-2 tw-py-1 tw-flex tw-justify-start tw-flex-col tw-gap-2' variant='secondary'>
                <div className='myFontFamily tw-font-medium tw-text-left tw-w-[188px]'>Total facturas de anticipo:</div>
                <div className='tw-flex tw-justify-start tw-gap-2'>
                    <div className='myFontFamily tw-font-medium tw-text-right tw-w-[188px]'>{`Disponible: S/.${!!dataclient?.anticipo?addOneDecimal(dataclient?.anticipo):addOneDecimal(0)}`}</div>
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
                    <div className='myFontFamily tw-font-medium tw-text-right tw-w-[188px]'>{`Disponible: S/.${!!dataclient?.nota_credito?addOneDecimal(dataclient?.nota_credito):addOneDecimal(0)}`}</div>
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
    const {oc, cmp1, cmp2, cmp3} = params?.nuevopedido?.institucional
    const [input, setinput] = useState({oc: oc || '', cmp1: cmp1 || '', cmp2: cmp2 || '', cmp3: cmp3 || ''});
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

export {BuscarModal, IngresarTexto, IngresarFecha, SelectorCombo, Anticipo_Credito, Institucional_Campo}