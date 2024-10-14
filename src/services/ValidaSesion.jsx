import { validaToken, validaAcceso } from "./usuario";

export async function Validar (Opcion) {
    try{
        //const [ValOpcion,setValOpcion] = useState(false);
        const Val = { Validar : false };

        const token = sessionStorage.getItem("CDTToken","XXXXX");
        console.log(token)
                
        if (token === "") {        
            Val.Validar = true
            console.log("No entra Vacio")
        } else {
            if(token === null) {
                Val.Validar = true
                console.log("No entra Null")
            }else{

                const valor = await validaToken(token);
                const usuario_login = valor.sub.substr(3)
                const usuario_empresa = valor.sub.substr(0, 3)

                const evaluar = { "usuario_login": usuario_login, "empresa_codigo": usuario_empresa, "modulo_codigo": Opcion }
                
                const responseAcc = await validaAcceso(evaluar)

                if (responseAcc.acceso === 0) {
                    if (Opcion !== "") {
                        Val.Validar = true
                        Val.cia = usuario_empresa
                        Val.usuario = ""
                    } else {
                        Val.Validar = true
                        Val.cia = usuario_empresa
                        Val.usuario = usuario_login
                    }
                } else {
                    Val.Validar = false
                    Val.cia = usuario_empresa
                    Val.usuario = usuario_login
                }
            }
        }
        console.log(Val.Validar)
        return Val
    }
    catch{
        return { Validar : true }
    }
};