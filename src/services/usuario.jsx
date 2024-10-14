import { mainURL } from '../constants/globals'

const meServidorBackend = mainURL + "/seguridad"

const cabecera = {'Content-type': 'application/json; charset=UTF-8'}


export async function validaToken(meToken){
    var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + meToken);

    const requestOptions = {
        method : 'POST',
        headers : myHeaders,        
    };

    const response = await fetch(`${meServidorBackend}/usuario/validar_token/`, requestOptions);
    const responseJson = await response.json();
    return responseJson

}

export async function validaAcceso(meJson){
    const requestOptions = {
        method: 'POST',        
        headers: cabecera,
        body: JSON.stringify(meJson)
    };
    
    const response = await fetch(`${meServidorBackend}/usuario/VerificaPermiso/`, requestOptions);
    console.log(`${meServidorBackend}/usuario/VerificaPermiso/`)
    const responseJson = await response.json();    
    return responseJson
}