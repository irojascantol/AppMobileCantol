import { useContext, useEffect, useRef, useState } from 'react'
import Accordion from 'react-bootstrap/Accordion';
import { MyListGroup } from './componentes/MyListGroup';
import '../../style/accordion.css'
import {PedidoModal, PedidoModal_Oferta} from '../../componentes/modal/pedidoModal';
import { Anticipo_Credito, BuscarModal, IngresarFecha, IngresarTexto, SelectorCombo , Institucional_Campo } from './plantillas/modalPlantilla';
import { commercialContext } from '../../context/ComercialContext';
import { editarPedido, getNuevoPedidoClave, getSaleOrder, guardarNuevaOferta, guardarNuevoPedido, obtenerDescuentoDocumento } from '../../services/pedidoService';
import { decodeJWT } from '../../utils/decode';
import { getFormatShipDate} from '../../utils/humandateformat';
import Spinner from 'react-bootstrap/Spinner';
import { getCurrentLocation } from '../../utils/location';
import { makeEditBody, makeSaleOrderBody } from './utils';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
// import { delay } from '../../utils/delay';
// import { ServerError } from '@azure/msal-browser';
import { BsGeoAltFill } from 'react-icons/bs';
import { CircularProgress } from '@mui/material';

const tipoModal = {
  text: (nuevopedido, modalValues, handlemodal, setSaleOrder, isQuotation)=>(<IngresarTexto nuevopedido={nuevopedido} modalValues={modalValues} handleInputTextModal={handlemodal} handleNewSaleOrder={setSaleOrder} type={'number'} isQuotation={isQuotation}/>),
  combo: (nuevopedido, modalValues, handlemodal, setSaleOrder, tipo, handleDescuentoDoc)=>(<SelectorCombo nuevopedido={nuevopedido} modalValues={modalValues} handleInputTextModal={handlemodal} handleNewSaleOrder={setSaleOrder} type={'text'} handleDescuentoDoc={handleDescuentoDoc}/>),
  date: (nuevopedido, modalValues, handlemodal, setSaleOrder, tipo, handleDescuentoDoc)=>(<IngresarFecha nuevopedido={nuevopedido} modalValues={modalValues} handleInputTextModal={handlemodal} handleNewSaleOrder={setSaleOrder} type={'date'}/>),
  Anticipo_Credito: (nuevopedido, modalValues, handlemodal, setSaleOrder, tipo, handleDescuentoDoc)=>(<Anticipo_Credito nuevopedido={nuevopedido} modalValues={modalValues} handleInputTextModal={handlemodal} handleNewSaleOrder={setSaleOrder} />),
  Institucional_Campos: (nuevopedido, modalValues, handlemodal, setSaleOrder, tipo, handleDescuentoDoc)=>(<Institucional_Campo nuevopedido={nuevopedido} modalValues={modalValues} handleInputTextModal={handlemodal} handleNewSaleOrder={setSaleOrder} />),
}
// Final_Pedido: (nuevopedido, modalValues, handlemodal, setSaleOrder)=>(<Final_Pedido nuevopedido={nuevopedido} modalValues={modalValues} handleInputTextModal={handlemodal} handleNewSaleOrder={setSaleOrder}/>)

const tipoPedido = {venta: 'ORDEN DE VENTA',
                    oferta: 'COTIZACIÓN',
                    editar: 'ORDEN DE VENTA'
                  };

const grabarCuerpo ={
    venta: (body)=>guardarNuevoPedido(body),
    oferta: (body)=>guardarNuevaOferta(body),
    editar: (body)=>editarPedido(body)
  }
  
const makeBody={
    venta: (param1, param2, param3)=>makeSaleOrderBody(param1, param2, param3),
    oferta: (param1, param2, param3)=>makeSaleOrderBody(param1, param2, param3),
    editar: (param1)=>makeEditBody(param1)
}

const operacion={
  venta: 'NUEVA',
  oferta: 'NUEVA',
  editar: 'EDITAR',
}

const loadingMessage = (msg, showLocation) => (
    <div className='tw-flex tw-items-start tw-gap-4'>
      <h6>{msg}</h6>
      {showLocation ? (
        <div><BsGeoAltFill color='white' size={20}/></div>
      ): (
        <CircularProgress color="inherit" size={20}/>
      )}
    </div>
  )

export default function NuevoPedido() {
  const { 
          //Handle nuevo cliente
          handleSearchModal, 
          searchClientModal: buscarModalValues,
          //handle nuevo pedido
          nuevoPedido,
          handleNewSaleOrder, 
          // handleSaleOrder2Init,
          //handle input modals combo/ date/ text field
          showInputTextModal: modalValues,
          //valor para conocer si cambio cliente
          // isClientChanged, //detectar el cambio de socio
          handleInputTextModal,
          //secure shield
          handleShow,
          //descuento estado
          dsctFormato,
          //manejo nueva politica descuento 27/01/25
          handleDescuento,
          handleDescuentoDoc,
          setNuevoPedido
        } = useContext(commercialContext);
  
  const loc = useLocation();
  const {tipo, tipo_root} =  useParams().tipo in tipoPedido ? {tipo: tipoPedido[useParams().tipo], tipo_root: useParams().tipo} : {tipo: null, tipo_root: null};
  const [isLoading, setIsLoading] = useState({show: false, msg: ''}) //BACKDROP PARA GRABAR PEDIDO / CARGAR PEDIDO EDITAR
  const [location, setLocation] = useState(false)
  const { docentry } = loc.state || {};  // Obtiene docEntry para editar

  //handle isLoading state
  const handleLoading = (obj) => {
    setIsLoading((prev)=>({...prev, ...obj}))
  }
  // //aqui se ve el tipo de cotizacion/ si es por venta sin stock o propuesta
  const [showDialogCoti, setShowDialogCoti] = useState(false)
  
  // const recoverOrder = useRef(false)
  const navigate = useNavigate();

  const setInitialcondition = async (tipo_r) => {
    
    let response = null
    let cuerpo = null

    if(tipo_r !== 'editar'){
      const data_token = await decodeJWT();
      response = await getNuevoPedidoClave({usuario_codigo: data_token.username});
    }else if(tipo_r === 'editar'){
      //Aqui se trae el metodo para que traiga todos los datos
      if(!!docentry){
        handleLoading({show: true, msg: 'Cargando datos del pedido...'})
        response = await getSaleOrder({doc_entry: docentry.toString()});
        handleLoading({show: false})
        cuerpo = {docentry: response?.DocEntry,
                        numero: response?.U_MSSM_CLM || 'vacio',
                        ruc: response?.ruc || 'vacio',
                        razonsocial: response?.razonsocial || 'vacio',
                        cliente_codigo: response?.CardCode || 'vacio',
                        telefono: response?.telefono || '',
                        fcontable: response?.fcontable || 'vacio',
                        fentrega: response?.fentrega || 'vacio',
                        moneda: response?.moneda || 'vacio',
                        SlpCode: response?.SlpCode || null,
                        comentarios: {vendedor: response?.Comments || ''},
                        direccionentrega: [{direccion_entrega: response?.direccionentrega || 'vacio'}],
                        ructransporte: {
                          nombre_transporte: response?.U_MSSL_NTR || 'vacio',
                          documento_transporte: response?.ructransporte || 'vacio',
                        },
                        canal_familia: {nombre_canal: response?.canal_familia || 'vacio', codigo_canal: response?.codigo_canal || -1},
                        condicionpago: [{PaymentGroupCode: response?.PaymentGroupCode || -1, PymntGroup: response?.condicionpago || 'vacio'}],
                        montos: {anticipo: 0, descuento: 0, impuesto: 0, nota_credito: 0, total: 0, total_cred_anti: 0, unidad: '', valor_venta: 0},
                        dsctSN: response?.U_DST_DESOTO || 0.0,
                        ubicacion: Number(response?.ubicacion_cliente) || null,
                        grupo_familia: response?.U_MSSC_GRFA || null,
                        products: response?.DocumentLines.map((item, idx)=>({
                          cantidad: item?.Quantity || 0,
                          Quantity_old: item?.Quantity || 0,
                          codigo: item?.ItemCode || '',
                          precio: item?.UnitPrice || 0.0,
                          dsct_porcentaje: parseFloat(item?.U_MSSC_NV1) || 0.0,
                          dsct_porcentaje2: parseFloat(item?.U_MSSC_NV2) || 0.0,
                          descripcion: item?.descripcion || 'vacio',
                          unidad_moneda: response?.DocCurrency || 'zz',
                          marca: item?.marca || '',
                          impuesto: item?.impuesto,
                          stock: item?.stock >= 0 ? ((item?.stock + item?.Quantity) || 0) : item?.Quantity, //cuando stock real es negativo, muestra la cantidad de entrada como maximo
                          stockMax: item?.stock >= 0 ? ((item?.stock + item?.Quantity) || 0) : item?.Quantity, //cuando stock real es negativo, muestra la cantidad de entrada como maximo
                          almacen: item?.WarehouseCode || null,
                          codigo_familia: item?.codigo_familia || null,
                          codigo_subfamilia: item?.codigo_subfamilia || null, 
                          doEdit: true, //esta bandera indica que el producto viene de editar
                          isBoni: (item?.U_MSS_ITEMBONIF === 'Y' && item?.U_MSSC_BONI === 'Y') || false,
                        }))
                    }
              }else{
                alert('No existe pedido seleccionado')
                navigate('/main/home')
              }
          }
    // //secure shield
    response === 406 && handleShow()
    // //
    //ejecuta cuando esta en condicion editar
    if(response !== 406 && !!response && tipo_r !== 'editar'){
      handleNewSaleOrder({
        cliente_codigo: null, 
        comentarios: {vendedor: '', nota_anticipo: ''}, 
        numero: response.code_sale, 
        fcontable: response.fecha, 
        fentrega: getFormatShipDate({fechacontable: new Date(response.fecha), moredays: 1}), 
        ruc:'', razonsocial:'', 
        telefono: '',
        direccionentrega:'', ructransporte: '', moneda:'', codigogrupo: '', condicionpago:'', 
        products: [], 
        grupo_familia: null, 
        ubicacion: null, 
        montos: {anticipo: 0, descuento: 0, impuesto: 0, nota_credito: 0, total: 0, total_cred_anti: 0, unidad: '', valor_venta: 0}, 
        institucional: {cmp1: '', cmp2: '', cmp3: '', oc: ''}})

    }else if(response !== 406 && !!response && tipo_r === 'editar' && !!cuerpo){
        let body = {
            PaymentGroupCode: (cuerpo?.condicionpago[0]?.PaymentGroupCode).toString(),
            codigo_canal_cliente: (cuerpo?.canal_familia?.codigo_canal).toString(),
        }
        
        let descuentoDoc = await obtenerDescuentoDocumento(body) //fetch descuento por forma de pago

        handleDescuento({
          doEdit: true, // esta bandera activa los descuentos a nivel de detalle automaticamente
          dsctDoc: {
              dsct1: {
                  selected: cuerpo.dsctSN || 0.0,
              },  //por categoria cliente general
              dsctFP: {value: descuentoDoc?.descuento_documento, enabled: true}, //forma de pago
              // ...{restoDesc} //🎃PENDIENTE, DSCT X MARCA, FALTA REGISTRAR ESE DATO EN ORDR 🎃
              }
        })

        //aqui descuento por forma de pago
        cuerpo.montos.descuento = descuentoDoc?.descuento_documento

        // handleNewSaleOrder({products: [...ghost_products], montos: {...nuevoPedido?.montos, ...{descuento: dsctDocTotal}}})
        handleNewSaleOrder(cuerpo)
    }
    else if(response !== 406 && !response){
      alert('Error durante ejecución, contactar con TI')
    }
  }
  //primera vez y cuando cambio en la ruta
  useEffect(()=>{
    const doFetch = async (tipo_r) => 
      {await setInitialcondition(tipo_r)}
      //verifica que la ruta sea venta u oferta
      if(tipo){
        //obtiene clave  mobile y fecha contable
        doFetch(tipo_root);
        //Activa consulta en cotización
        tipo  === 'COTIZACIÓN' && setShowDialogCoti(true)
      }else{
        //aqui deberia enviar al apagina 404
        //deberia en condicion de inicial el cuerpo del context
        navigate('/main/home')
      }
    // },[tipo])
    },[tipo_root])

  /**
   * Equivalente a un F5
   */
  const refreshPage = () => {
    window.location.reload()
  };

  //valida que todos los campos esten correctos OV antes de guardar
  const validarCampos = async () => {
    const data_token = await decodeJWT();
    // verifica si registro cliente
    if(!!nuevoPedido?.razonsocial){
        //verifica existe producto en lista
        if(!!nuevoPedido?.products?.length){
          //verifica que no haya cambiado de cliente, pendiente actualizacion de descuento
          // if(!isClientChanged.active){ // ahora funciona cuando cambia cliente, los descuentos se quitan
            if(!!nuevoPedido?.ructransporte){
              if(data_token?.slpcode !== -2){ //verifica que el usuario sera solo vendedor difernte de -2
                  try{
                    //Logica que solicita dos veces los permisos de geolocalizacion
                    let currentLocation = null
                    setIsLoading({show:true, msg: `Grabando ${tipoPedido[tipo_root].toLowerCase()}...`}); //Bloqueo ventana antes de pedir geolocalizacion
                    try{
                      currentLocation = await getCurrentLocation(2);
                    }catch(error){
                      console.log('Localizacion desactivada en navegador: ', error.message)
                    }
                    setLocation(!!currentLocation) //esto para enviar el cuadrado negro en frond
                    let body = makeBody[tipo_root](nuevoPedido, currentLocation, dsctFormato)
                    // // let body = makeSaleOrderBody(nuevoPedido, currentLocation, dsctFormato)
                    // await delay(2000)
                    const [response, status] = !!tipo_root ? await grabarCuerpo[tipo_root](body): [null, 206];
                    // const [response, status] = ['OV Creada!', 200];
                    // await delay(2000)
                    // //
                    status === 406 && handleShow()
                    //aca se devuelve una respuesta cuando concluye el proceso
                    setIsLoading({show: false});
                    status !== 200 && alert(JSON.stringify(response))
                    if(status === 200 && typeof(response[1]) === 'number' && typeof(response[2]) === 'number'){
                      console.log('1')
                      alert('¡Orden de venta y borrador creados!\nRedireccion a pedidos pendientes')
                      navigate('/main/pedido/pendiente?page=lista', {state:{tipo: 'pedido'}})
                    }else if(status === 200 && typeof(response[1]) === 'number' && typeof(response[2]) !== 'number'){
                      console.log('2')
                      alert('¡Borrador creado!\nRedireccion a pedidos pendientes')
                      navigate('/main/pedido/pendiente?page=lista', {state:{tipo: 'pedido'}})
                    }else if(status === 200 && typeof(response) === 'string'){
                      alert(response)
                      if(tipo_root === 'editar'){
                        navigate('/main/pedido/pendiente?page=lista', {state:{tipo: 'pedido'}})
                      }else{
                        refreshPage() // aqui se refresca la pagina cuando se crea una oferta de venta
                      }
                    }
                  }catch(error){
                    setIsLoading(false);
                    alert ('¡Error al generar pedido!\nContactar con el area de TI')
                    console.error("An error occurred:", error.message);
                  }
            }else{
              alert('Perfil administrador no permitido')
            }
          }else{
            alert('Debe seleccionar un transportista en la cabecera')
          }
        }else{
          alert("Debe agregar productos")
        }
      }else{
        alert("Debe registrar un socio de negocios")
      }
    }

  return (
    <div className='tw-relative'>

      <PedidoModal_Oferta show={showDialogCoti} handleTipoCoti={(x)=>{setShowDialogCoti(false); handleNewSaleOrder({tipocotizacion: x || null});}}/>

      {/* modal buscar cliente y buscar producto */}
      <PedidoModal modalTitle={buscarModalValues.modalTitle} handleClose={()=>handleSearchModal({show: false})} show={buscarModalValues.show}>
        <BuscarModal buscarModalValues={buscarModalValues} handleNewSaleOrder={handleNewSaleOrder} handleCloseModal={()=>handleSearchModal({show: false})} isQuotation={tipo_root==='oferta'}/>
      </PedidoModal>
      
      {/* modal general para tipo combo / text field / date */}
      {!!modalValues.tipomodal && (
        <PedidoModal tipomodal={modalValues.tipomodal} size={modalValues.size} modalTitle={modalValues.modalTitle} handleClose={()=>handleInputTextModal({show: false})} show={modalValues.show}>
          {tipoModal[modalValues.tipomodal](nuevoPedido, modalValues, handleInputTextModal, handleNewSaleOrder, tipo_root==='oferta', handleDescuentoDoc)}
        </PedidoModal>
      )}
      <h6 className='tw-text-center bg-secondary tw-text-white tw-rounded-md' style={{marginBottom: 0, padding: "5px 0"}}>{tipo? `${operacion[tipo_root]} ${tipo}`:'*************'}</h6>
        <div className='tw-absolute tw-w-full'>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Datos del cliente</Accordion.Header>
              <Accordion.Body>
                <MyListGroup plantilla="nuevopedidocabecera" data={undefined} doEdit={tipo_root === 'editar'}/>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Productos</Accordion.Header>
              <Accordion.Body>
                <MyListGroup plantilla="nuevopedidoproductos" data={undefined} doEdit={tipo_root === 'editar'}/>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
                  <div className='tw-flex tw-flex-col tw-items-center tw-border-2'>
                              <button className='button-14 tw-w-2/3 tw-h-10 tw-my-4 tw-font-sans tw-font-medium' disabled={isLoading.show?true:false} style={{margin: '0 auto'}} onClick={validarCampos}>
                                {isLoading.show ? (
                                  <>
                                    Grabando.....
                                    <Spinner animation="grow" role="status" size='sm' className='tw-ml-2'>
                                      <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                  </>
                                ):(
                                  <>
                                    {tipo? `Grabar ${tipo.toLowerCase()}`:'*************'}
                                  </>
                                )}
                              </button>
                  </div>
        </div>
        <Backdrop
          sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
          open={isLoading.show}
        >
          {loadingMessage(isLoading.msg, location)}
        </Backdrop>
    </div>
    
  );
}

export { NuevoPedido }
       
       
       
       