import { Routes, Route, Outlet} from "react-router-dom";
import LoginForm from "../pages/login/LoginForm";
import ProtectedRoute from "../componentes/seguridad/VentanaProteccion";
import { NavBar1 } from "../componentes/navegacion/NavBar1";
import NuevoPedido from "../pages/pedido/nuevopedido";
import ReportePedido from "../pages/pedido/reportePedido";
import Operacion from "../pages/entrega/Operacion";
import { NotFound } from "../pages/defecto/NotFound";

export function MiRutas() {
    return (
        <>
        <Routes>
            <Route path="/" element={<LoginForm/>} />
            <Route path="/login" element={<LoginForm/>} />
            <Route path="/main"element={<NavBar1/>}>
                <Route path="entrega/:estado" element={<Operacion/>}/>
                <Route path="nuevopedido" element={<NuevoPedido/>}/>
                <Route path="pedido/:reporte" element={<ReportePedido/>}/>
            <Route path="*" element={<NotFound/>} />
            </Route>
        </Routes>
        </>
    );
}
