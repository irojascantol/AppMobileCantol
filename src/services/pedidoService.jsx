import axios from "axios";
import { mainURL } from "../constants/globals";

const rutas_reportes = {
    pendiente: '/listarpedidopendiente',
    aprobado: '/listarpedidoaprobado',
    rechazado: '/listarpedidorechazado'
}

const rutas = (tipoPedido, tab) => (`${mainURL}/comercial/ventas/pedido/listar${tipoPedido}${tab}`)

async function getPedido(innerParams, state) {
    try{
        if(state in rutas_reportes){
            const response = await axios(`${mainURL}/comercial/ventas/pedido${rutas_reportes[state]}`, {
                params: innerParams
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
        undefined;
    }
}

async function getDetallePedidoGeneral(innerParams, tipoPedido) {
    try{
        const response = await axios(rutas(tipoPedido,'general'), {
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
        undefined;
    }
}

async function getDetallePedidoLogistica(innerParams, tipoPedido) {
    try{
        const response = await axios(rutas(tipoPedido,'logistica'), {
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
        undefined;
    }
}

async function getDetallePedidoFinanzas(innerParams, tipoPedido) {
    try{
        const response = await axios(rutas(tipoPedido,'finanzas'), {
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
        undefined;
    }
}

async function getDetallePedidoContenido(innerParams, tipoPedido) {
    try{
        const response = await axios(rutas(tipoPedido,'contenido'), {
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
        undefined;
    }
}

async function getNuevoPedidoClave(innerParams) {
    try{
        const response = await axios.post(`${mainURL}/comercial/ventas/pedido/generarcodigoventa`, innerParams);
        if (!!response.data && response.status === 200){
            return response.data;
        }else
        {
            return [];
        }
    }catch(error){
        console.log(`An Error ocurred: (getDetallePedidoLogistica) _ ${error}`);
        undefined;
    }
}

async function getProductosBonificacion(innerParams) {
    try{
        const response = await axios.post(`${mainURL}/comercial/ventas/pedido/aplicarbonificacionproducto`, innerParams);
        if (!!response.data && response.status === 200){
            return response.data;
        }else
        {
            return [];
        }
    }catch(error){
        console.log(`An Error ocurred: (getDetallePedidoLogistica) _ ${error}`);
        undefined;
    }
}

async function getCreditoAnticipo(innerParams) {
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
        console.log(`An Error ocurred: (getDetallePedidoLogistica) _ ${error}`);
        undefined;
    }
}

async function postaplicarDescuento(requestBody) {
    try{
        const response = await axios.post(`${mainURL}/comercial/ventas/pedido/aplicardescuentonivel1`, requestBody);
        if (!!response.data && response.status === 200){
            return response.data;
        }else
        {
            return [];
        }
    }catch(error){
        console.log(`An Error ocurred: (getDetallePedidoLogistica) _ ${error}`);
        undefined;
    }
}

async function guardarNuevoPedido(requestBody) {
    try{
        const response = await axios.post(`${mainURL}/comercial/ventas/pedido/grabarordenventa`, requestBody);
        if (!!response.data && response.status === 200){
            return [response.data, response.status];
        }else
        {
            return [null, response.status];
        }
    }catch(error){
        console.log(`An Error ocurred: (getDetallePedidoLogistica) _ ${error}`);
        return [null, response.status];
    }
}

async function obtenerDescuentoDocumento(requestBody) {
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
        return null;
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
    }