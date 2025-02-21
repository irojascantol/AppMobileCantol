import axios from "axios";
import { mainURL } from "../constants/globals";
// import axiosInstance from "./interceptor";


async function getClientePorFiltro(innerParams) {
    axios.defaults.withCredentials = true;
    try{
        const response = await axios(`${mainURL}/comercial/ventas/pedido/buscarpedidoclientecartera`, {
        // const response = await axiosInstance(`${mainURL}/comercial/ventas/pedido/buscarpedidoclientecartera`, {
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

async function getProductoPorFiltro(innerParams, isQuotation) {
    axios.defaults.withCredentials = true;
    let data_body = {...innerParams}
    delete data_body['usuario_codigo']
    let link = ! isQuotation ? `${mainURL}/comercial/ventas/pedido/buscarproductoporfiltro` : `${mainURL}/oferta_mobile/ofertas/oferta/buscarproductoporfiltro`
    try{
        const response = await axios(link, {
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

async function getTransportistaPorFiltro(innerParams) {
    axios.defaults.withCredentials = true;
    innerParams = {
        filtro: innerParams?.filtro
    }
    let data_body = {...innerParams}
    delete data_body['usuario_codigo']
    try{
        // const response = await axiosInstance(`${mainURL}/comercial/ventas/pedido/listatransportistasporfiltro`, {
        // headers: {
        //     'Content-Type': 'application/json; charset=utf-8'
        // }
        const response = await axios(`${mainURL}/comercial/ventas/pedido/listatransportistasporfiltro`, {
            params: innerParams,
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

async function getEstadoCuentaCliente(innerParams) {
    try{
        const response = await axios(`${mainURL}/comercial/reporte/estadocuenta/cliente`, {
            params: innerParams
        });
        if (!!response.data && response.status === 200){
            return response.data;
        }else
        {
            return [];
        }
    }catch(error){
        console.log(`An Error ocurred: (getEstadoCuentaCliente) _ ${error}`);
        undefined;
    }
}

async function getListarFacturas(innerParams) {
    try{
        const response = await axios(`${mainURL}/comercial/reporte/factura/listar`, {
            params: innerParams
        });
        if (!!response.data && response.status === 200){
            return response.data;
        }else
        {
            return [];
        }
    }catch(error){
        console.log(`An Error ocurred: (getEstadoCuentaCliente) _ ${error}`);
        undefined;
    }
}

// const response = await axios(`${mainURL}/comercial/reporte/factura/pdfformat`, {
//     params: innerParams,
//     responseType: 'arraybuffer',
// });

async function getFacturaPDF(innerParams) {
    try{
        const response = await axios(`${mainURL}/comercial/reporte/factura/pdfformat`, {
            params: innerParams,
            responseType: 'blob',
        });
        if (!!response.data && response.status === 200){
            return response.data;
        }else
        {
            return [];
        }
    }catch(error){
        console.log(`An Error ocurred: (getFacturaPDF) _ ${error}`);
        undefined;
    }
}

export {getClientePorFiltro, getProductoPorFiltro, getTransportistaPorFiltro, getEstadoCuentaCliente, getListarFacturas, getFacturaPDF}