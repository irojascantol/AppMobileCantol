import { Navigate, Outlet } from "react-router-dom";
import { Validar } from "../../services/ValidaSesion";

const ValidacionUsuario = async ()=>
{
    const ValU = await Validar("Session");
    return ValU.Validar
}

const ProtectedRoute = ({Redirige }) =>
{   
    const Login1 = sessionStorage.getItem("CDTToken")
    if(Login1==""||Login1==null)
    {
        return <Navigate to={Redirige} replace />
    }
    return <Outlet />;
}

export default ProtectedRoute;