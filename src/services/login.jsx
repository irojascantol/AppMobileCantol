import { mainURL } from '../constants/globals';
import axios from 'axios';
// const instance = axios.create({
    //     timeout: 5000
    // })
    
    const meServidorBackend = mainURL
    
    export async function Login(pLogin,pPass,pCia)
    {
        axios.defaults.withCredentials = true;
        try{
            const data = {usuario_login : pLogin, usuario_contraseña : pPass, usuario_empresa : pCia};
            const respuesta = await axios.post(`${meServidorBackend}/login/`,data);
            return respuesta.data;
        }catch(error){
            console.error('Error fetching data: ', error);
            return undefined;
        }
}