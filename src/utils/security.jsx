import { validaAcceso } from "../services/usuario";
import { decodeJWT } from "./decode";

export const check_module = async (moduleCode) => {
    const {company: empresa_codigo, username: usuario_login } = await decodeJWT() || {company: undefined, username: undefined};
    let body = {
      usuario_login: usuario_login,
      empresa_codigo: empresa_codigo,
      modulo_codigo: moduleCode
    }

    if(!!empresa_codigo && !!usuario_login){
        const {acceso} = await validaAcceso(body)
        if(!!acceso){
          return true
        }else{
          return false
        }
      }
}