import { jwtDecode } from "jwt-decode";

export function decodeJWT(){
    try{
    const decoded = jwtDecode(sessionStorage.getItem("CDTToken"))
        return {company: decoded.sub.substring(0,3) || undefined, username: decoded.sub.substring(3) || undefined}
    }catch(error){
        return undefined
    }
}