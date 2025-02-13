import React, { useContext, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import { ListGroup } from 'react-bootstrap'
import { BsArchive, BsArrowClockwise, BsArrowRightShort, BsBootstrap, BsCalendar3, BsChatLeftText, BsCurrencyExchange, BsExclamationTriangleFill, BsFileEarmarkPerson, BsFillPeopleFill, BsFillPersonBadgeFill, BsList, BsPlusSquareFill, BsSearch, BsTextWrap, BsTrash, BsTrash3Fill, BsX } from 'react-icons/bs';
import { commercialContext } from '../../../context/ComercialContext';
import { getCurrentDate, getFormatShipDate, getFormatShipDate_peru, getHumanDateFormat, getHumanDateFormat_plus } from '../../../utils/humandateformat';
import { addOneDecimal, dsctEquiv, truncate } from '../../../utils/math';
import { getProductosBonificacion, postaplicarDescuento } from '../../../services/pedidoService';
import { InputNumberSpinner } from '../../../componentes/globales/input';
import { DiscountOvDialog } from '../componentes/DiscountOvDialog'; 
import '../../../style/inputform.css'


//Cofiguracion para discount dialog
// DiscountOvDialog.propTypes = {
//     onClose: PropTypes.func.isRequired,
//     open: PropTypes.bool.isRequired,
// };


const retornaDatos = (data, key) => {
    if (!!data){
        return data[key]
    }else{
        return ''
    }
}

let operation = {
    down: (value)=>value-1,
    up: (value)=>value+1
}

function NuevoPedidoCabecera({data}) {
    const { handleSearchModal, handleInputTextModal, nuevoPedido} = useContext(commercialContext);

    return (
    <>
        <ListGroup.Item
            as="li"
            className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1"
            variant="no style"
            >
            <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
                <div className="header_section_title">ID Venta:</div>
                <div className='header_section_content' dangerouslySetInnerHTML={{__html: `${nuevoPedido?.numero}&nbsp;`}}/>
            </div>
        </ListGroup.Item>
        <ListGroup.Item
            as="li"
            className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1"
            variant="no style"
            >
            <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
            <div className="header_section_title">R.U.C:</div>
            <div className='header_section_content' dangerouslySetInnerHTML={{__html: `${retornaDatos(nuevoPedido, "ruc")}&nbsp;`}}/>
            </div>
        </ListGroup.Item>
        <ListGroup.Item
            as="li"
            className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1"
            variant="no style"
            >
            <div className="tw-ml-2 tw-mr-5  tw-flex tw-justify-between tw-w-full">
                <div className='tw-min-w-[310px]'>
                    <div className="header_section_title">Razón social:</div>
                    <div className='header_section_content' dangerouslySetInnerHTML={{__html: `${retornaDatos(nuevoPedido, "razonsocial")}&nbsp;`}}/>
                </div>
                <div className='tw-w-[20px]'>
                    <Button variant="outline-secondary" id="button-addon2" onClick={()=>handleSearchModal({show: true, modalTitle: 'Buscar cliente', operacion: 'Cliente', placeholder: 'Ingrese Razon Social o RUC'})} className='tw-px-3 tw-h-12'>
                        <BsSearch className='tw-text-black' size={20}/>
                    </Button>
                </div>
            </div>
        </ListGroup.Item>
        <ListGroup.Item
            as="li"
            className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1"
            variant="no style"
            >
            <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
            <div className="header_section_title">Telefono:</div>
            <div className='header_section_content' dangerouslySetInnerHTML={{__html: `${retornaDatos(nuevoPedido, "telefono")}&nbsp;`}}/>
            </div>
        </ListGroup.Item>
        <ListGroup.Item
            as="li"
            className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1"
            variant="no style"
            >
            <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
            <div className="header_section_title">Fecha Contable:</div>
            <div className='header_section_content' dangerouslySetInnerHTML={{__html: `${getHumanDateFormat(nuevoPedido?.fcontable)}&nbsp;`}}/>
            </div>
        </ListGroup.Item>
        <ListGroup.Item
            as="li"
            className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1"
            variant="no style"
            >
            <div className="tw-ml-2 tw-mr-5  tw-flex tw-justify-between tw-w-full">
                <div className='tw-min-w-[310px]'>
                    <div className="header_section_title">Fecha de entrega:</div>
                    <div className='header_section_content' dangerouslySetInnerHTML={{__html: `${getFormatShipDate_peru({fecha: new Date(nuevoPedido?.fentrega)})}&nbsp;`}}/>
                </div>
                <div className='tw-w-[20px]'>
                    <Button variant="outline-secondary" id="button-addon2" onClick={()=>{
                        if(!!nuevoPedido.ruc && !!nuevoPedido.razonsocial){
                            handleInputTextModal({show: true, options: getFormatShipDate({fechacontable: new Date(nuevoPedido?.fcontable), moredays: 1}), modalTitle: 'Ingresar fecha de entrega', tipomodal: 'date', operacion: 'direccionentrega'})
                        }else{alert("Debe seleccionar un cliente")}}} className='tw-px-3 tw-h-12'>
                        <BsCalendar3 className='tw-text-black' size={20}/>
                    </Button>
                </div>
            </div>
        </ListGroup.Item>
        <ListGroup.Item
            as="li"
            className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1"
            variant="no style"
            >
            <div className="tw-ml-2 tw-mr-5  tw-flex tw-justify-between tw-w-full">
                <div className='tw-min-w-[310px]'>
                    <div className="header_section_title">Dirección de entrega:</div>
                    <div className='header_section_content' dangerouslySetInnerHTML={{__html: `${!!nuevoPedido.direccionentrega && nuevoPedido?.direccionentrega[0]?.direccion_entrega || ''}&nbsp;`}}/>
                </div>
                <div className='tw-w-[20px]'>
                    <Button variant="outline-secondary" onClick={()=>{
                        if(!!nuevoPedido.ruc && !!nuevoPedido.razonsocial){
                            handleInputTextModal({show: true, options: nuevoPedido.direccionentrega, modalTitle: 'Seleccionar dirección de entrega', tipomodal: 'combo', operacion: 'direccionentrega'})
                        }else{alert("Debe seleccionar un cliente")}
                    }}
                    className='tw-px-3 tw-h-12'>
                        <BsList className='tw-text-black' size={20}/>
                    </Button>
                </div>
            </div>
        </ListGroup.Item>
        <ListGroup.Item
            as="li"
            className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1"
            variant="no style"
            >
            <div className="tw-ml-2 tw-mr-5  tw-flex tw-justify-between tw-w-full">
                <div className='tw-min-w-[310px]'>
                    <div className="header_section_title">RUC transportista <span className='tw-text-red-500 tw-font-bold'>(*)</span>:</div>
                    <div className='header_section_content' dangerouslySetInnerHTML={{__html: `${retornaDatos(nuevoPedido, "ructransporte")?.nombre_transporte || '&nbsp'};`}}/>
                    <div className='tw-text-xs tw-font-semibold' dangerouslySetInnerHTML={{__html: `${retornaDatos(nuevoPedido, "ructransporte")?.documento_transporte || '&nbsp'}&nbsp;`}}/>
                </div>
                <div className='tw-w-[20px]'>
                    <Button variant="outline-secondary" id="button-addon2" onClick={()=>{
                        if(!!nuevoPedido.ruc && !!nuevoPedido.razonsocial){
                            handleSearchModal({show: true, modalTitle: 'Buscar transportista', operacion: 'Transportista', placeholder: 'Ingrese Razon Social o RUC'})       
                        }else{alert("Debe seleccionar un cliente")}
                        }}
                    className='tw-px-3 tw-h-12'>
                        <BsSearch className='tw-text-black' size={20}/>
                    </Button>
                </div>
            </div>
        </ListGroup.Item>

        <ListGroup.Item
            as="li"
            className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1"
            variant="no style"
            >
            <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
            <div className="header_section_title">Moneda:</div>
            <div className='header_section_content' dangerouslySetInnerHTML={{__html: `${retornaDatos(nuevoPedido, "moneda")}&nbsp;`}}/>
            </div>
        </ListGroup.Item>
        {/* <ListGroup.Item
            as="li"
            className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1"
            variant="no style"
            >
            <div className="ms-2 me-auto tw-border-4 tw-border-indigo-600">
            <div className="header_section_title">Grupo familiar:</div>
            <div className='header_section_content' dangerouslySetInnerHTML={{__html: `${retornaDatos(nuevoPedido, "grupo_familia") || 'NO TIENE'}&nbsp;`}}/>
            </div>
        </ListGroup.Item> */}
        <ListGroup.Item
            as="li"
            className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1"
            variant="no style"
            >
        <div className="tw-ml-2 tw-mr-5  tw-flex tw-justify-between tw-w-full">
            <div className='tw-min-w-[310px]'>
                <div className="header_section_title">Condicion de pago:</div>
                <div className='header_section_content' dangerouslySetInnerHTML={{__html: `${!!nuevoPedido.condicionpago && nuevoPedido?.condicionpago[0].PymntGroup || ''}&nbsp;`}}/>
            </div>
            <div className='tw-w-[20px]'>
                <Button variant="outline-secondary" onClick={()=>{
                    if(!!nuevoPedido.ruc && !!nuevoPedido.razonsocial){
                        handleInputTextModal({show: true, modalTitle: 'Ingresar metodo de pago', tipomodal: 'combo', options: nuevoPedido?.condicionpago, operacion: 'condicionpago', data: {canal_familia: nuevoPedido?.canal_familia, montos: nuevoPedido?.montos}})
                    }else{alert("Debe seleccionar un cliente")}
                    }} 
                    className='tw-px-3 tw-h-12'>
                    <BsCurrencyExchange className='tw-text-black' size={20}/>
                </Button>
            </div>
        </div>
        </ListGroup.Item>
        <ListGroup.Item
            as="li"
            className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1 tw-relative"
            variant="no style"
            >
        <div className="tw-ml-2 tw-mr-5  tw-flex tw-justify-between tw-w-full">
            <div className='tw-min-w-[310px]'>
                <div className="header_section_title">Canal de venta(*):</div>
                <div className='header_section_content' dangerouslySetInnerHTML={{__html: `${nuevoPedido?.canal_familia?.nombre_canal || '&nbsp;'}&nbsp;`}}/>
            </div>
            <div className='tw-w-[20px]'>
                <Button variant="outline-secondary" onClick={()=>{
                    if(!!nuevoPedido.ruc && !!nuevoPedido.razonsocial){
                        handleInputTextModal({show: true, modalTitle: 'Campos obligatorios', tipomodal: 'Institucional_Campos', options: nuevoPedido?.condicionpago, operacion: 'condicionpago'})
                    }else{alert("Debe seleccionar un cliente")}
                    }} 
                    className='tw-px-3 tw-h-12'>
                    <BsFillPeopleFill  className='tw-text-black' size={20}/>
                </Button>
            </div>
        </div>
        </ListGroup.Item>
        <ListGroup.Item
            as="li"
            className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1 tw-relative"
            variant="no style"
            >
        <div className="tw-ml-2 tw-mr-5  tw-flex tw-justify-between tw-w-full">
            <div className='tw-min-w-[310px]'>
                <div className="header_section_title">Comentarios del vendedor(*):</div>
                <div className='header_section_content tw-max-w-[330px] tw-h-7 tw-overflow-y-hidden tw-overflow-x-hidden' dangerouslySetInnerHTML={{__html: `${nuevoPedido?.comentarios?.vendedor || '&nbsp;'}&nbsp;`}}/>
            </div>
            <div className='tw-w-[20px]'>
                <Button variant="outline-secondary" onClick={()=>{
                    if(!!nuevoPedido.ruc && !!nuevoPedido.razonsocial){
                        handleInputTextModal({show: true, modalTitle: 'Ingrese comentarios', tipomodal: 'text', options: nuevoPedido?.comentarios, operacion: 'comentarios'})
                    }else{alert("Debe seleccionar un cliente")}
                    }} 
                    className='tw-px-3 tw-h-12'>
                    <BsChatLeftText   className='tw-text-black' size={20}/>
                </Button>
            </div>
        </div>
        </ListGroup.Item>
    </>
  )
}

function NuevoPedidoProductos(){
    //maneja la apertura de modal de busqueda de productos
    //apertura del comercialcontext
    const {nuevoPedido, 
            handleSearchModal, 
            handleNewSaleOrder, 
            handleInputTextModal, 
            showInputTextModal: modalValues, 
            handleClienteChange,
            handleDescuento, 
            isClientChanged, 
            handleShow,
            handleNewSaleMontos,
            dsctFormato} = useContext(commercialContext);

    // //activate los botones para eliminar productos
    const [deleteMode,  setDeleteMode] = useState(false);
    const [isFirstRender, setIsFirstRender] = useState(true);
    
    /**
     * Estados para el Discount Dialog
     */
    const [open, setOpen] = useState({show: false, accepted: false});
    const handleShowDsctDialog = (obj) => setOpen({...open, ...obj});
    /** */

    
    // //verifica cliente agregado en cabecera
    const isClientExits = !!nuevoPedido?.ruc && !!nuevoPedido?.razonsocial;
    const largo_productos = nuevoPedido?.products?.length;

    //activa solo cuando se modifica la tabla productos
    useEffect(()=>{
        !!largo_productos && calcularTotal()
        !largo_productos && setearCero()
        //desactiva el boton de eliminar
        !largo_productos && setDeleteMode(false)
    }, [nuevoPedido.products, nuevoPedido.montos.descuento])

    //aplica el descuento por anticipo y nota de credito
    useEffect(()=>{
        let condition = (modalValues?.returnedValue === null || modalValues?.returnedValue === undefined)
        if((!condition) && typeof(modalValues?.returnedValue) === 'object' && 'anticipo' in modalValues?.returnedValue && 'nota_credito' in modalValues?.returnedValue){
            setearDescuentoCredAnti(modalValues.returnedValue)
        }
    }, [modalValues.returnedValue])

    //quita descuento y bonificacion cuando cambia cliente
    useEffect(()=>{
        if (isFirstRender) {
            setIsFirstRender(false);
            return; // No hacer nada en el primer renderizado
          }else{
              eliminar_Dsct_Bonificado(false, dsctFormato?.dsctDoc?.dsct1?.selected, false)
          }
    }, [isClientChanged.active])

    //Despues de aplicar descuento en DiscountOvDialog (APLICAR!!!!)
    //Ahora tambien va pasar cuando cambiemos el c
    useEffect(()=>{
        if(!open.show && open.accepted){
            console.log('Aplica descuento')
            aplicarDescuento()
        }
    },[open.show])
    // },[open.show, nuevoPedido.products])
    
    const eliminarProducto = (item) => {
        let deleted_index = nuevoPedido?.products.findIndex((element)=>(element.codigo === item.codigo && element?.tipo === item?.tipo))
        let ghost_products = [...nuevoPedido?.products]
        //borrar hijos cuando es padre
        //primero buscamos si es padre
        if(ghost_products[deleted_index]?.tipo !== 'bonificado'){
            //verifica si existe mas productos del mismo codigo
            let indexes = ghost_products.reduce(function(a, e, i){ if ((e?.codigo === ghost_products[deleted_index]?.codigo)) a.push(i); return a}, [])
            //si es 1 o mayor elimina todos
            if(!!indexes.length){
                //ordenar indices de mayor a menor
                indexes.sort((a,b)=>b-a)
                for (let index of indexes){
                    ghost_products.splice(index, 1);
                }
            }
        }else{
            ghost_products.splice(deleted_index, 1);
        }
        handleNewSaleOrder({products: ghost_products})
    }

    const aplicarBonificacion = async() => {
        //se filtra los productos que nos son bonificados
        let request_body = nuevoPedido.products.map((item)=>{if(!('tipo' in item)) return {codigo_articulo: item?.codigo, cantidad: item?.cantidad, precio: item?.precio}});
        request_body = request_body.filter((item)=>item !== undefined);
        let response = await getProductosBonificacion(request_body);
        response === 406 && handleShow()
        if (response !== 406 && !!response?.length){
            //elimina los productos de tipo bonificados
            let ghost_products_for_delete = [...nuevoPedido.products]
            let indexes = ghost_products_for_delete.reduce(function(a, e, i){ if (('tipo' in e) && (e?.tipo === 'bonificado')) a.push(i); return a}, [])
            if(!!indexes.length){
                //ordenar indices de mayor a menor
                indexes.sort((a,b)=>b-a)
                //esto de aca abajo se puede hacer con un foreach
                for (let index of indexes){
                    ghost_products_for_delete.splice(index, 1)              
                }
            }
        //crea arrays de las bonificaciones aplicadas
            let tmpResponse = response.map((item)=>({...item, maxLimit: item?.cantidad, impuesto: {codigo: 'IGV_EXE', valor: 0}, descuento: 100, dsct_porcentaje: 100, tipo: 'bonificado'}))
            handleNewSaleOrder({products: [...ghost_products_for_delete, ...tmpResponse]})
        }
    }

    const aplicarDescuento = async() => {
        //1-Primero, solo elimina descuentos, no bonificados
        //SIRVE PARA DESCUENTOS DE PROMOCIONES
            // eliminar_Dsct_Bonificado(true)

        //2-Aplica descuento al documento
            let dsctCateCliente = !!dsctFormato.dsctDoc.dsct1.selected ? parseFloat(dsctFormato.dsctDoc.dsct1.selected) : 0.0
            let dsctCondPago = !!dsctFormato.dsctDoc.dsctFP.enabled ? dsctFormato.dsctDoc.dsctFP.value : 0.0
            let dsctDocTotal = dsctCateCliente + dsctCondPago

            // handleNewSaleMontos({descuento: dsctDocTotal})

        //3-Aplica promociones al detalle de productos
            if(!!dsctFormato?.promociones?.enabled){
                let response = null
                //obtener cuerpo para aplicar descuentos
                let productos_ = nuevoPedido?.products?.filter((x)=>(!('tipo' in x)))
                let requestBody = {
                    codigo_cliente: nuevoPedido?.cliente_codigo,
                    ubicacion_cliente: Number(nuevoPedido?.ubicacion),
                    grupo_familiar:  nuevoPedido?.grupo_familia,
                    fecha_promocion: getCurrentDate(),
                    productos: productos_?.map((x)=>({
                        "codigo_articulo": x?.codigo,
                        "codigo_familia": x?.codigo_familia,
                        "codigo_subfamilia": x?.codigo_subfamilia,
                        "cantidad": x?.cantidad,
                        "precio": x?.precio,
                    }))}
        
                //consulta descuentos solo si hay productos en lista
                //descuento: es el total descuento
                //dsct_porcentaje: el el porcentaje % por und
            
                if(!!(productos_?.length)){
                    response = await postaplicarDescuento(requestBody)
                    response === 406 && handleShow()
                    if(response !== 406 && !!response?.length){
                        // //aca se agrega la actualizacion
                        let ghost_products = [...nuevoPedido?.products]
                            for( const objRes of response){
                                ghost_products.forEach((item, index) => {
                                    if(!('tipo' in item) && item?.codigo === objRes?.codigo_articulo){
                                        // item.descuento = objRes?.total_descuento_n1 || "0";
                                        item.descuento = Number(objRes?.total_descuento_n1 || 0);
                                        item.dsct_porcentaje = Number(objRes?.descuento_n1 || 0);
                                        // item.descuento2 = objRes?.total_descuento_n2 || "0";
                                        item.descuento2 = Number(objRes?.total_descuento_n2 || 0);
                                        item.dsct_porcentaje2 = Number(objRes?.descuento_n2 || 0);
                                    }
                                })
                            }
                        //el calculo desl descuento subtotal va en la parte del  map
                        handleNewSaleOrder({products: [...ghost_products], montos: {...nuevoPedido?.montos, ...{descuento: dsctDocTotal}}})
                        // isClientChanged.dsct ? handleClienteChange({active: false}): handleClienteChange({dsct: true})
                    }
                }
            }else{
                eliminar_Dsct_Bonificado(true, dsctDocTotal)
            }
    }

    const calcularValorVenta = () => {
        if (largo_productos){
            //calcular el valor de venta de producto menos el descuento
            // let valorVenta = nuevoPedido?.products.reduce((acc, item)=>(((item?.precio * (1 - (item?.dsct_porcentaje * 0.01))) * item?.cantidad) + acc), 0); //DESACTIVADO POR UN MOMENTO
            let valorVenta = nuevoPedido?.products.reduce((acc, item)=>((item?.precio * item?.cantidad) + acc), 0);
            //calcular descuento total de productos
            let itemsNoBonificados = nuevoPedido?.products.filter((item)=>!('tipo' in item))
            let valorDescuentoProductos = itemsNoBonificados.reduce((acc, item)=>((item?.precio * dsctEquiv(item?.dsct_porcentaje, item?.dsct_porcentaje2) * 0.01 * item?.cantidad) + acc), 0);
            
            // valorVenta = truncate(valorVenta, 2)
            //revisa que todos los productos esten con la misma unidad de moneda
            let unidad = {...nuevoPedido}?.products.map((item)=>(item?.unidad_moneda))
            unidad = unidad.filter((item, index)=>(unidad.indexOf(item) === index))
            if(unidad?.length === 1){
                return [valorVenta, unidad[0], valorDescuentoProductos]
            }else{
                let temporal_montos = {...nuevoPedido.montos, valor_venta: 0, unidad: null}
                alert("Unidades de precio deben ser iguales")
                return [0, null, null]
            }
        }else{
            let temporal_montos = {...nuevoPedido.montos, valor_venta: 0}
            return [0, null, null]
        }
    }

    const calcularImpuestos = () => {
        //funcion que evaluar el valor de facto de impuesto
        const returnDsctFactor = (pct) => {
            if (!!pct) {
                return ((100 - pct) * 0.01);
            }else {
                return 1;
            }
        }

        if (largo_productos){
            //esta parte calcular el impuesto sobre el total menos el descuento
            // let impuestoTotal = nuevoPedido?.products.reduce((acc, item)=>(((item?.precio *  returnDsctFactor(item?.dsct_porcentaje)) * item?.cantidad * ((item?.impuesto?.valor) * 0.01)) + acc), 0);
            let impuestoTotal = nuevoPedido?.products.reduce((acc, item)=>(((item?.precio *  returnDsctFactor(dsctEquiv(item?.dsct_porcentaje, item?.dsct_porcentaje2))) * returnDsctFactor(nuevoPedido?.montos?.descuento) *  item?.cantidad * ((item?.impuesto?.valor) * 0.01)) + acc), 0);
            //seria cuestion de verificar primero que todos sean del %18
            // let valor_venta_menos_descuento = sum_valorventa - (1 - nuevoPedido?.montos?.descuento * 0.01)
            // let  impuestoTotal = valor_venta_menos_descuento * ((item?.impuesto?.valor) * 0.01)
            // impuestoTotal = truncate(impuestoTotal, 2)
            //revisa que todos los productos esten con la misma unidad de moneda
            let unidad = {...nuevoPedido}?.products.map((item)=>(item?.unidad_moneda))
            unidad = unidad.filter((item, index)=>(unidad.indexOf(item) === index))
            if(unidad?.length === 1){
                return impuestoTotal
            }else{
                alert("Unidades de precio deben ser iguales")
                return null
            }
        }else{
            return 0;
        }
    }
    
    const calcularDescuento = (sum_valorventa) => {
        if (largo_productos){
            // let descuentoTotal = nuevoPedido?.products.reduce((acc, item)=>((((item?.precio)*((item?.dsct_porcentaje || 0)* 0.01)*((nuevoPedido?.montos?.descuento || 0)* 0.01)) * item?.cantidad) + acc), 0);
            let descuentoTotal = (sum_valorventa * ((nuevoPedido?.montos?.descuento || 0)* 0.01))

            // descuentoTotal = truncate(descuentoTotal, 2)
            // descuentoTotal = descuentoTotal
            //revisa que todos los productos esten con la misma unidad de moneda
            let unidad = {...nuevoPedido}?.products.map((item)=>(item?.unidad_moneda))
            unidad = unidad.filter((item, index)=>(unidad.indexOf(item) === index))
            if(unidad?.length === 1){
                return descuentoTotal
            }else{
                alert("Unidades de precio deben ser iguales")
                return null
            }
        }else{
            return 0;
        }
    }

    const calculartTotalNotaAnticipo = () => {
        if (largo_productos){
            let retornar = modalValues?.returnedValue?.anticipo + modalValues?.returnedValue?.nota_credito
                if(!!retornar){
                    return(retornar);
                }else{
                    return(0);
                }
        }else{
            return 0;
        }
    }

    const calcularTotal = () => {
        // if (largo_productos){
            let [sum_valorventa, unit, dsctProductos] = calcularValorVenta();
            if (!!sum_valorventa && !!unit){
                // // console.log("Ingresa a qui")
                // // console.log(nuevoPedido.products)
                let sum_descuento = calcularDescuento(sum_valorventa - dsctProductos);
                let sum_impuesto = calcularImpuestos();
                let total = sum_valorventa - sum_descuento - dsctProductos + sum_impuesto;
                let total_cred_anti = total - (nuevoPedido.montos.anticipo + nuevoPedido.montos.nota_credito)
                let temporal_montos = {...nuevoPedido.montos, total: total, total_cred_anti: total_cred_anti, valor_venta: truncate(sum_valorventa , 2), 
                    impuesto: sum_impuesto, 
                    unidad: unit,
                    dsctProductos: dsctProductos,
                    dsctDoc: sum_descuento,
                }
                handleNewSaleOrder({montos: temporal_montos})
            }
            else{
                let temporal_montos = {...nuevoPedido.montos, total: 0, total_cred_anti: 0, valor_venta: 0, impuesto: 0}
                handleNewSaleOrder({montos: temporal_montos})
            }
        }
        
        const setearCero = () => {
            //se quita descuento por que el calculo del porcetaje sera directo
            let temporal_montos = {...nuevoPedido.montos, total: 0, total_cred_anti: 0, valor_venta: 0, impuesto: 0, anticipo: 0, nota_credito: 0, dsctProductos: 0, dsctDoc: 0}
            handleNewSaleOrder({montos: temporal_montos})
        }
        
        const setearDescuentoCredAnti = () => {
            let sum_anti_cred = calculartTotalNotaAnticipo();
            let total_cred_anti = nuevoPedido.montos.total - sum_anti_cred;
            let temporal_montos = {...nuevoPedido.montos, total_cred_anti: total_cred_anti, anticipo: modalValues?.returnedValue?.anticipo, nota_credito: modalValues?.returnedValue?.nota_credito}
            //genera el comentario de nota de credito y anticipo
            let comentarios = !!temporal_montos?.anticipo?`Aplicar F. Anticipo: ${temporal_montos?.anticipo}, `:'';
            comentarios = comentarios + (!!temporal_montos?.nota_credito?`Aplicar nota de credito: ${temporal_montos?.nota_credito}`:'');
            //actualiza comentario de nota credito anticipo
            handleNewSaleOrder({comentarios: {...nuevoPedido.comentarios, nota_anticipo: comentarios}, montos: temporal_montos})
            //comentarios, montos: temporal_montos
        }
        
        /**
         * Quita descuentos y bonificaciones de la lista de productos
         * @param {bool} soloDescuento 
         */
        const eliminar_Dsct_Bonificado = (soloDescuento=false, dsctTotal=undefined, isInit = true) => {
            //elimina descuento de no bonificados
            let itemsSinDescuento = nuevoPedido?.products.map((item)=>(!('tipo' in item)?{...item, ...{descuento: 0, dsct_porcentaje: 0, descuento2: 0, dsct_porcentaje2: 0}}:{...item}))
            let itemsNoBonificados = []
            if (!soloDescuento){
                    itemsNoBonificados = itemsSinDescuento?.filter((item)=>!('tipo' in item)) //Elimina bonificados
                    if(isInit){
                        handleDescuento({
                        dsctDoc:{
                            dsct1: {...dsctFormato.dsctDoc.dsct1, ...{selected: 0.0}},
                            dsctFP: {...dsctFormato.dsctDoc.dsctFP, ...{enabled: false}}},
                            promociones: {enabled: false}})
                    }
            }else{
                //Mantiene toda la lista completa, bonificados y no bonificados
                itemsNoBonificados = itemsSinDescuento?.filter((item)=>!('tipo' in item) || !!('tipo' in item))
            }
            handleNewSaleOrder({products: [...itemsNoBonificados], montos: {...nuevoPedido?.montos, ...{descuento: dsctTotal}}})
            // if(!!dsctTotal){ //recibe dsctTotal desde aplicarDescuento
            // }else{
            //     handleNewSaleOrder({products: [...itemsNoBonificados]})
            // }
        }

        const handleInputSpinner = (action, itemCode, value) => {
            //copia la lista de productos
            let ghost_products = JSON.parse(JSON.stringify(nuevoPedido?.products))
            ghost_products.forEach((idy, index, array)=>{
                if(idy?.tipo === 'bonificado' && ghost_products[index].codigo === itemCode){
                    let values = operation[action](value)
                    array[index].cantidad = values
                }
            })
            handleNewSaleOrder({products: ghost_products})
        }

    return(
        <>
            <ListGroup.Item
            as="li"
            className="d-flex tw-justify-between tw-items-center active:tw-border-yellow-400 tw-gap-2 tw-pl-2"
            >
                <div className='tw-flex tw-items-center tw-border-1 tw-border-blue-500'>
                    {!!dsctFormato?.dsctDoc?.dsct1?.catName && <BsFillPersonBadgeFill />}
                    <h6 className='tw-font-semibold tw-text-black tw-my-0 tw-p-1 tw-rounded-md'>{dsctFormato?.dsctDoc?.dsct1?.catName}</h6>
                </div>

                <div className='d-flex tw-justify-center tw-gap-2'>
                    <button variant="success" size="lg" className='button-4 tw-w-fit tw-text-base' disabled={!isClientExits?true:false} onClick={()=>handleSearchModal({show: true, modalTitle: 'Buscar producto', returnedValue: null, operacion: 'Producto', options: [{cliente_codigo: nuevoPedido?.cliente_codigo, products: nuevoPedido?.products}], placeholder: 'Ingrese nombre o codigo de producto'})}>
                        <BsPlusSquareFill size={22}/>
                    </button>
                    <button variant="success" size="lg" className='button-4 tw-w-fit tw-text-base' disabled={!isClientExits?true:false} onClick={()=>eliminar_Dsct_Bonificado()}>
                        <BsTextWrap size={22}/>
                    </button>
                    <button variant="danger" size="lg" className='button-4 tw-w-fit tw-text-base' disabled={!isClientExits?true:false} onClick={()=>{!!(largo_productos) && setDeleteMode(!deleteMode)}}>
                        {(!deleteMode) ?(<BsTrash3Fill size={22}/>):(<BsArrowClockwise size={22}/>)} 
                    </button>
                </div>
            </ListGroup.Item>
            {/* <ListGroup.Item className='tw-px-1 tw-border-2 tw-border-gray-500 tw-rounded-md tw-mb-2' variant='secondary'> */}
            <ListGroup.Item className='tw-px-1 tw-border-2 tw-border-gray-500 tw-mb-2' variant='secondary'>
                <ListGroup as="ol" numbered={!!largo_productos ? true : false} className='tw-flex tw-gap-2 tw-pb-1 tw-h-96 tw-overflow-y-auto'>
                        {!largo_productos?(
                            <ListGroup.Item as="li" className="d-flex tw-w-full tw-flex-row tw-justify-start tw-gap-2 tw-pl-2 product_card tw-relative" variant="no style">
                                {/* <div className='tw-flex tw-justify-center tw-items-center tw-w-full tw-h-24 tw-font-medium'> */}
                                <div className='tw-flex tw-justify-center tw-items-center tw-w-full tw-h-[365px] tw-font-medium'>
                                    {"Lista vacia"}&nbsp;&nbsp;&nbsp;<BsArchive size={28}/>
                                </div>
                            </ListGroup.Item>
                        ):(
                            nuevoPedido?.products.map((itx, index) => (
                                // <ListGroup.Item key={(index + 4).toString()} as="li" className="d-flex tw-flex-row tw-justify-start tw-gap-2 tw-pl-1 product_card tw-relative" style={{width: 'calc(100% - 20px);'}} variant="no style">
                                <ListGroup.Item key={(index + 4).toString()} as="li" className="d-flex tw-flex-row tw-rounded-md tw-justify-start tw-gap-2 tw-pl-1 product_card tw-relative" style={{width: 'calc(100% - 5px)'}} variant="no style">
                                    <div className='tw-w-full tw-h-24'>
                                        <div className='tw-text-sm tw-font-medium tw-h-10'>{itx?.descripcion} - {itx?.codigo}</div>
                                        <div className='tw-text-base'>
                                            <span className='tw-text-sm'>Descuento:</span>&nbsp;
                                            {truncate(dsctEquiv(itx?.dsct_porcentaje, itx?.dsct_porcentaje2), 2)}%</div>
                                        <div className='tw-flex tw-justify-between'>
                                                <div className='tw-text-base'>
                                                    <span className='tw-text-sm'>Precio:</span>&nbsp;
                                                    <span className='tw-text-xs'>{itx?.unidad_moneda}</span> 
                                                    {addOneDecimal(itx?.precio)}
                                                </div>
                                                <div className={`tw-text-base tw-flex`}>
                                                    <div>
                                                        <span className='tw-text-sm'>Cant:</span>&nbsp;
                                                    </div>
                                                    {itx?.tipo === 'bonificado' ? 
                                                    (
                                                        <InputNumberSpinner min={0} max={itx?.maxLimit} value={itx?.cantidad} onChange={(action)=>{handleInputSpinner(action, itx?.codigo, itx?.cantidad)}}/>
                                                    ):
                                                        (<span>{itx?.cantidad}</span>)
                                                    }
                                                </div>
                                            <div className='tw-text-base'>
                                                <span className='tw-text-sm'>Subtotal:</span>&nbsp;
                                                <span className='tw-text-xs'>{itx?.unidad_moneda}</span> 
                                                {addOneDecimal(truncate(itx?.precio * itx?.cantidad, 2))}
                                            </div>
                                        </div>
                                        <div className={`tw-absolute button-4 tw-right-[-0px] tw-top-[-0px] tw-px-0 tw-py-0 tw-bg-black tw-text-white item-delete ${!deleteMode? 'tw-invisible tw-opacity-0': 'tw-visible tw-opacity-100'}`} onClick={()=>{eliminarProducto(itx)}}>
                                                <BsX size={20}/>
                                        </div>
                                        <div className={`tw-absolute button-4 tw-left-[0px] tw-bottom-[0px] tw-px-0 tw-py-0 tw-bg-yellow-400 tw-text-black item-delete ${itx?.tipo === 'bonificado'? 'tw-visible tw-opacity-100': 'tw-invisible tw-opacity-0'}`}>
                                                <BsBootstrap size={20}/>
                                        </div>
                                    </div>
                                </ListGroup.Item>
                            ))
                            )
                        }
                </ListGroup>
            </ListGroup.Item>
            <ListGroup.Item className='tw-px-2 tw-py-1 tw-flex tw-justify-end tw-gap-2' variant='secondary'>
                <div className='myFontFamily tw-font-medium'>Subtotal:</div>
                <div className='myFontFamily tw-font-normal tw-bg-white product_card tw-rounded-sm tw-min-w-32 tw-text-end tw-px-2'>{nuevoPedido?.montos?.unidad} {addOneDecimal(truncate((nuevoPedido?.montos?.valor_venta), 2))}</div>
            </ListGroup.Item>
            <ListGroup.Item className='tw-px-2 tw-py-1 tw-flex tw-justify-end tw-gap-2' variant='secondary'>
                {/* <div className='myFontFamily tw-font-medium'>Desct. por producto:</div> */}
                <div className='myFontFamily tw-font-medium'>Desc. por promoción:</div>
                <div className='myFontFamily tw-font-normal tw-bg-white product_card tw-rounded-sm tw-min-w-32 tw-text-end tw-px-2'>{nuevoPedido?.montos?.unidad} {addOneDecimal(truncate((nuevoPedido?.montos?.dsctProductos || 0), 2))}</div>
            </ListGroup.Item>
            <ListGroup.Item className='tw-px-2 tw-py-1 tw-flex tw-justify-end tw-gap-2' variant='secondary'>
                <div className='myFontFamily tw-font-medium'>Desc. por (F. Pago + Ctg. Cliente):</div>
                {/* <div className='myFontFamily tw-font-normal tw-bg-white product_card tw-rounded-sm tw-min-w-32 tw-text-end tw-px-2'>{nuevoPedido?.montos?.unidad} {addOneDecimal(truncate((nuevoPedido?.montos?.valor_venta)*(nuevoPedido?.montos?.descuento * 0.01), 2)}</d)iv> */}
                <div className='myFontFamily tw-font-normal tw-bg-white product_card tw-rounded-sm tw-min-w-32 tw-text-end tw-px-2'>{nuevoPedido?.montos?.unidad} {addOneDecimal(truncate((nuevoPedido?.montos?.dsctDoc), 2))}</div>
            </ListGroup.Item>
            <ListGroup.Item className='tw-px-2 tw-py-1 tw-flex tw-justify-end tw-gap-2' variant='secondary'>
                <div className='myFontFamily tw-font-medium'>Impuestos:</div>
                <div className='myFontFamily tw-font-normal tw-bg-white product_card tw-rounded-sm tw-min-w-32 tw-text-end tw-px-2'>{nuevoPedido?.montos?.unidad} {addOneDecimal(truncate(nuevoPedido?.montos?.impuesto, 2))}</div>
            </ListGroup.Item>
            <ListGroup.Item className='tw-px-2 tw-py-1 tw-flex tw-justify-end tw-gap-2' variant='secondary'>
                <div className='myFontFamily tw-font-medium'>Importe total:</div>
                <div className='myFontFamily tw-font-normal tw-bg-green-300 product_card tw-rounded-sm tw-min-w-32 tw-text-end tw-px-2'>{nuevoPedido?.montos?.unidad} {addOneDecimal(truncate(nuevoPedido?.montos?.total, 2))}</div>
            </ListGroup.Item>
            <ListGroup.Item className='tw-px-2 tw-py-1 tw-flex tw-justify-end tw-gap-2' variant='secondary'>
                <div className='myFontFamily tw-font-medium'>**Importe total - FA - NC:</div>
                <div className='myFontFamily tw-font-normal tw-bg-white product_card tw-rounded-sm tw-min-w-32 tw-text-end tw-px-2'>{nuevoPedido?.montos?.unidad} {addOneDecimal(truncate(nuevoPedido?.montos?.total_cred_anti, 2))}</div>
            </ListGroup.Item>
            <ListGroup.Item
            as="li"
            className="d-flex tw-flex-col justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1 tw-gap-2"
            variant="no style"
            >
                {/* <button className='button-4 tw-w-full' disabled={true} onClick={()=>{aplicarBonificacion()}}> */}
                <button className='button-4 tw-w-full' disabled={true} onClick={()=>{aplicarBonificacion()}}>
                    Aplicar bonificación (Desactivado)
                </button>
                <button className='button-4 tw-w-full tw-flex tw-justify-center tw-items-center tw-gap-2' disabled={!isClientExits?true:false} onClick={()=>{handleShowDsctDialog({show: true});}}>
                    <span>Aplicar descuento</span>
                    {/* {isClientChanged?.active && (<span className=''><BsExclamationTriangleFill/></span>)} */}
                </button>
                <button className='button-4 tw-w-full' disabled={!isClientExits?true:false} onClick={()=>{
                    handleInputTextModal({show: true, modalTitle: 'Notas de crédito y anticipos', tipomodal: 'Anticipo_Credito', options: nuevoPedido?.montos})}}>
                    Aplicar anticipos y notas de creditos
                </button>
            </ListGroup.Item>
                <DiscountOvDialog
                    dsctObj={dsctFormato}
                    open={open}
                    handleShowDsctDialog={handleShowDsctDialog}
                    handleDescuento={handleDescuento}
                />
        </>
    )
}

export {NuevoPedidoCabecera, NuevoPedidoProductos}

//ejemplo de basemodel en fastapi con lista?