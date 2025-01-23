import axios from "axios";
import { mainURL } from "../constants/globals";

const rutas_reportes = {
    pendiente: '/listarpedidopendiente',
    aprobado: '/listarpedidoaprobado',
    rechazado: '/listarpedidorechazado'
}

const rutas = (tipoPedido, tab) => (`${mainURL}/comercial/ventas/pedido/listar${tipoPedido}${tab}`)

async function getPedido(innerParams, state) {
    axios.defaults.withCredentials = true;
    try{
        if(state in rutas_reportes){
            let ruta = `${mainURL}/comercial/ventas/pedido${rutas_reportes[state]}`
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

async function getDetallePedidoGeneral(innerParams, tipoPedido) {
    axios.defaults.withCredentials = true;
    try{
        const response = await axios(rutas(tipoPedido,'general'), {
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

async function getDetallePedidoLogistica(innerParams, tipoPedido) {
    axios.defaults.withCredentials = true;
    try{
        const response = await axios(rutas(tipoPedido,'logistica'), {
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

async function getDetallePedidoFinanzas(innerParams, tipoPedido) {
    axios.defaults.withCredentials = true;
    try{
        const response = await axios(rutas(tipoPedido,'finanzas'), {
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

async function getDetallePedidoContenido(innerParams, tipoPedido) {
    axios.defaults.withCredentials = true;
    try{
        const response = await axios(rutas(tipoPedido,'contenido'), {
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
    }

// axios.defaults.withCredentials = true;
// const reponse = await fetch(`${mainURL}/comercial/ventas/pedido${rutas_reportes[state]}?usuario_codigo=IROJAS`, {
//     method: 'GET',
//     credentials: 'include',
//     headers: {
//         'Content-Type': 'application/json',
//     }
// })
// console.log(response.json());
// .then(response => {
//     if (!response.ok) {
//         throw new Error('Network response was not ok');
//     }
//     return response.json(); // Convertir la respuesta a JSON
// })
// .then(data => {
//     // Mostrar el valor de la cookie en el DOM
//     console.log(data.cookie_value)
//     // document.getElementById('result').textContent = `Cookie Value: ${data.cookie_value}`;
// })
// .catch(error => {
//     console.error('Error:', error);
// });
// const response = await axios.get(ruta, {
//     withCredentials: true,
//     params: innerParams,
//     headers: {
//         'Content-Type': 'application/json'
//     }
// });