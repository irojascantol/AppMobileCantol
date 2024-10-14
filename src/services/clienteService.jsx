import axios from "axios";
import { mainURL } from "../constants/globals";


async function getClientePorFiltro(innerParams) {
    try{
        const response = await axios(`${mainURL}/comercial/ventas/pedido/buscarpedidoclientecartera`, {
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

async function getProductoPorFiltro(innerParams) {
    let data_body = {...innerParams}
    delete data_body['usuario_codigo']
    try{
        const response = await axios(`${mainURL}/comercial/ventas/pedido/buscarproductoporfiltro`, {
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
    innerParams = {
        filtro: innerParams?.filtro
    }
    let data_body = {...innerParams}
    delete data_body['usuario_codigo']
    try{
        const response = await axios(`${mainURL}/comercial/ventas/pedido/listatransportistasporfiltro`, {
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

export {getClientePorFiltro, getProductoPorFiltro, getTransportistaPorFiltro}