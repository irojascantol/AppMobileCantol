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
            // alert(JSON.stringify(meServidorBackend))
            const respuesta = await axios.post(`${meServidorBackend}/login/`,data);
            return respuesta.data;
        }catch(error){
            console.log(`Error fetching data: ${error}`);
            if (error.response) {
                // Server responded with a status other than 2xx
                console.log('Response error:', error.response.data);
                console.log('Status code:', error.response.status);
                console.log('Headers:', error.response.headers);
              } else if (error.request) {
                // Request was made but no response was received
                console.log(`Request error: ${error.request}`);
                // console.log('Request error:', error.request);
              } else {
                // Something else triggered the error
                console.log('Error message:', error.message);
              }
            return undefined;
        }
}