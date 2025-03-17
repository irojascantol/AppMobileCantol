import axios from "axios";
import { mainURL } from "../constants/globals";

const rutas_reportes = {
    pendiente: '/listarpedidopendiente',
    aprobado: '/listarpedidoaprobado',
    rechazado: '/listarpedidorechazado',
    facturado: '/listarpedidofacturado',
}

const rutas_ofertas = {
    pendiente: '/listarofertapendiente',
}

const rutas = (tipoPedido, tab, tipoDoc) => (`${mainURL}/comercial/ventas/${!!tipoDoc ? tipoDoc : 'pedido'}/listar${tipoPedido}${tab}`)

async function getPedido(innerParams, state, tipo) {
    axios.defaults.withCredentials = true;
    try{
        if(state in rutas_reportes || state in rutas_ofertas){
            let ruta = ''
            if(!tipo)
                ruta = `${mainURL}/comercial/ventas/pedido${rutas_reportes[state]}`
            else
                ruta = `${mainURL}/comercial/ventas/${tipo}${rutas_ofertas[state]}`
            
            const response = await axios(ruta, {
                withCredentials: true,
                params: innerParams,
            });
            if (!!response.data && response.status === 200){
                return response.data;
            }else
            {
                return [];
            }
        }else{
            return [];
        }
        
    }catch(error){
        console.log(`An Error ocurred: (getPedido) _ ${error}`);
        return undefined;
    }
}

async function getDetallePedidoGeneral(innerParams, tipoPedido, tipoDoc) {
    axios.defaults.withCredentials = true;
    try{
        console.log(rutas(tipoPedido,'general', tipoDoc))
        const response = await axios(rutas(tipoPedido,'general', tipoDoc), {
            withCredentials: true,
            params: innerParams
        });
        if (!!response.data && response.status === 200){
            return response.data;
        }else
        {
            return [];
        }
    }catch(error){
        console.log(`An Error ocurred: (getDetallePedidoGeneral) _ ${error}`);
        return undefined;
    }
}

async function getDetallePedidoLogistica(innerParams, tipoPedido, tipoDoc) {
    axios.defaults.withCredentials = true;
    try{
        const response = await axios(rutas(tipoPedido,'logistica', tipoDoc), {
            withCredentials: true,
            params: innerParams
        });
        if (!!response.data && response.status === 200){
            return response.data;
        }else
        {
            return [];
        }
    }catch(error){
        console.log(`An Error ocurred: (getDetallePedidoLogistica) _ ${error}`);
        return undefined;
    }
}

async function getDetallePedidoFinanzas(innerParams, tipoPedido, tipoDoc) {
    axios.defaults.withCredentials = true;
    try{
        const response = await axios(rutas(tipoPedido,'finanzas', tipoDoc), {
            withCredentials: true,
            params: innerParams
        });
        if (!!response.data && response.status === 200){
            return response.data;
        }else
        {
            return [];
        }
    }catch(error){
        console.log(`An Error ocurred: (getDetallePedidoLogistica) _ ${error}`);
        return undefined;
    }
}

async function getDetallePedidoContenido(innerParams, tipoPedido, tipoDoc) {
    axios.defaults.withCredentials = true;
    try{
        const response = await axios(rutas(tipoPedido,'contenido', tipoDoc), {
            withCredentials:  true,
            params: innerParams
        });
        if (!!response.data && response.status === 200){
            return response.data;
        }else
        {
            return [];
        }
    }catch(error){
        console.log(`An Error ocurred: (getDetallePedidoContenido) _ ${error}`);
        return undefined;
    }
}

async function getNuevoPedidoClave(innerParams) {
    axios.defaults.withCredentials = true;
    try{
        const response = await axios.post(`${mainURL}/comercial/ventas/pedido/generarcodigoventa`, innerParams);
        if (!!response.data && response.status === 200){
            return response.data;
        }else
        {
            return [];
        }
    }catch(error){
        console.log(`An Error ocurred: (getNuevoPedidoClave) _ ${error}`);
        return error.response.status
    }
}



async function getProductosBonificacion(innerParams) {
    axios.defaults.withCredentials = true;
    try{
        const response = await axios.post(`${mainURL}/comercial/ventas/pedido/aplicarbonificacionproducto`, innerParams);
        if (!!response.data && response.status === 200){
            return response.data;
        }else
        {
            return [];
        }
    }catch(error){
        console.log(`An Error ocurred: (getProductosBonificacion) _ ${error}`);
        return error.response.status
    }
}

async function getCreditoAnticipo(innerParams) {
    axios.defaults.withCredentials = true;
    try{
        const response = await axios.get(`${mainURL}/comercial/ventas/pedido/obtenercredito_anticipo_favor`, {
            params: innerParams
        });
        if (!!response.data && response.status === 200){
            return response.data;
        }else
        {
            return [];
        }
    }catch(error){
        console.log(`An Error ocurred: (getCreditoAnticipo) _ ${error}`);
        return error.response.status
    }
}

async function postaplicarDescuento(requestBody) {
    axios.defaults.withCredentials = true;
    try{
        const response = await axios.post(`${mainURL}/comercial/ventas/pedido/aplicardescuentos`, requestBody);
        if (!!response.data && response.status === 200){
            return response.data;
        }else
        {
            return [];
        }
    }catch(error){
        console.log(`An Error ocurred: (postaplicarDescuento) _ ${error}`);
        return error.response.status
    }
}

async function guardarNuevoPedido(requestBody) {
    axios.defaults.withCredentials = true;
    try{
        const response = await axios.post(`${mainURL}/comercial/ventas/pedido/grabarordenventa`, requestBody);
        if (!!response.data && response.status === 200){
            return [response.data, response.status];
        }else
        {
            // console.log([null, response.status, response.data])
            return [response?.request?.statusText, response.status];
        }
    }catch(error){
        console.log(`An Error ocurred: (guardarNuevoPedido) _ ${error}`);
        return [error?.response?.data?.detail || error.message, error.response.status];
    }
}

async function guardarNuevaOferta(requestBody) {
    axios.defaults.withCredentials = true;
    try{
        let response = await axios.post(`${mainURL}/oferta_mobile/ofertas/oferta/grabarofertaventa`, requestBody);
        response = response.data

        if (response.status === 200){
            return [response.message, response.status];
        }else
        {
            return [null, 406];
        }

    }catch(error){
        console.log(`An Error ocurred: (guardarNuevaOferta) _ ${error}`);
        return [null, error.response.status];
    }
}

async function editarPedido(requestBody) {
    axios.defaults.withCredentials = true;
    try{
        let response = await axios.post(`${mainURL}/comercial/ventas/pedido/editarordenventa`, requestBody);
        response = response.data
        if (response[0] === 200){
            return [response[1], response[0]];
        }else
        {
            return [null, 406];
        }
    }catch(error){
        console.log(`An Error ocurred: (editarPedido) _ ${error}`);
        return [error.response.data.detail, error.response.status];
    }
}

async function obtenerDescuentoDocumento(requestBody) {
    axios.defaults.withCredentials = true;
    try{
        const response = await axios.post(`${mainURL}/comercial/ventas/pedido/aplicardescuentodocumento`, requestBody, {timeout: 10000});
        if (!!response.data && response.status === 200){
            return response.data;
        }else
        {
            return null;
        }
    }catch(error){
        console.log(`An Error ocurred: (obtenerDescuentoDocumento) _ ${error}`);
        return error.response.status
    }
}

async function getSaleOrder(innerParams) {
    axios.defaults.withCredentials = true;
    try{
        const response = await axios.get(`${mainURL}/comercial/ventas/pedido/obtenerordenventa`, {
            params:innerParams,
            timeout: 100000
        });
        if (!!response.data && response.status === 200){
            return response.data;
        }else
        {
            return null;
        }
    }catch(error){
        console.log(`An Error ocurred: (getSaleOrder) _ ${error}`);
        return error.response.status
    }
}


export {getPedido, 
        getDetallePedidoGeneral, 
        getDetallePedidoLogistica,
        getDetallePedidoFinanzas,
        getDetallePedidoContenido,
        getNuevoPedidoClave,
        getProductosBonificacion,
        getCreditoAnticipo,
        postaplicarDescuento,
        guardarNuevoPedido,
        obtenerDescuentoDocumento,
        guardarNuevaOferta,
        getSaleOrder,
        editarPedido
    }