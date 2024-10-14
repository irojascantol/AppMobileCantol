import axios from "axios";
import { mainURL } from "../constants/globals";

//requestBody: usuario_codigo
async function obtenerEntregaPendiente(innerParams) {
    try{
        // const response = await axios.get(`${mainURL}/despacho_mobile/entregas/entrega/listarentregaschoferpendiente`, {
        const response = await axios.get(`${mainURL}/despacho_mobile/entregas/entrega/listarentregaschofer`, {
            params: innerParams
        });
        if (!!response.data && response.status === 200){
            return response.data;
        }else
        {
            return null;
        }
    }catch(error){
        console.log(`An Error ocurred: (obtenerEntregaPendiente) _ ${error}`);
        return null;
    }
}

async function obtenerEntregaCompleto(innerParams) {
    try{
        const response = await axios.get(`${mainURL}/despacho_mobile/entregas/entrega/listarentregaschofercerrado`, {
            params: innerParams
        });
        if (!!response.data && response.status === 200){
            return response.data;
        }else
        {
            return null;
        }
    }catch(error){
        console.log(`An Error ocurred: (obtenerEntregaCompleto) _ ${error}`);
        return null;
    }
}

async function obtenerEntregaDetalle(innerParams) {
    try{
        const response = await axios.get(`${mainURL}/despacho_mobile/entregas/entrega/listardetallentrega`, {
            params: innerParams
        });
        if (!!response.data && response.status === 200){
            return response.data;
        }else
        {
            return null;
        }
    }catch(error){
        console.log(`An Error ocurred: (obtenerEntregaCompleto) _ ${error}`);
        return null;
    }
}

async function registrarEntrega(requestBody) {
    try{
        const response = await axios.post(`${mainURL}/despacho_mobile/entregas/entrega/registrarentrega`, requestBody);
        return response.status
    }catch(error){
        console.log(`An Error ocurred: (registrarEntrega) _ ${error}`);
        return null;
    }
}

async function obtenerRegistro(innerParams) {
    try{
        const response = await axios.get(`${mainURL}/despacho_mobile/entregas/entrega/obtenerdatosentrega`, {
            params: innerParams
        });
        if (!!response.data && response.status === 200){
            return response.data[0];
        }else
        {
            return null;
        }
    }catch(error){
        console.log(`An Error ocurred: (obtenerRegistro) _ ${error}`);
        return null;
    }
}


export {obtenerEntregaPendiente, obtenerEntregaCompleto, obtenerEntregaDetalle, registrarEntrega, obtenerRegistro}