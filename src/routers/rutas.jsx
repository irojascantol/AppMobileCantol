import { Routes, Route, Outlet} from "react-router-dom";
import LoginForm from "../pages/login/LoginForm";
import ProtectedRoute from "../componentes/seguridad/VentanaProteccion";
import { NavBar1 } from "../componentes/navegacion/NavBar1";
import NuevoPedido from "../pages/pedido/nuevopedido";
import ReportePedido from "../pages/pedido/reportePedido";
import Operacion from "../pages/entrega/Operacion";
import { NotFound } from "../pages/defecto/NotFound";
import { Dashboard } from "../pages/home/dashboard";
import EstadoCuenta from "../pages/Clientes/EstadoCuenta";
import FacturasCliente from "../pages/Clientes/Facturas";
import { commercialContext } from "../context/ComercialContext";
import { useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import ReportePedido_ from "../pages/pedido/ReportePedido_";
import DetallePedido_ from "../pages/pedido/DetallePedido_";

export function MiRutas() {
    // const navigate = useNavigate()
    // const {
    //     userName,
    //   } = useContext(commercialContext)

    // //verifica que exista las credenciales de la session
    // useEffect(() => {
    //     if(!userName){
    //       navigate('/')
    //     }
    // }, [userName]);
    
    return (
        <>
        <Routes>
            <Route path="/" element={<LoginForm/>} />
            <Route path="/login" element={<LoginForm/>} />
            <Route path="/main"element={<NavBar1/>}>
                <Route path="home" element={<Dashboard/>}/>
                <Route path="entrega/:estado" element={<Operacion/>}/>
                <Route path="nuevopedido/:tipo" element={<NuevoPedido/>}/>
                <Route path="pedido/:reporte" element={<ReportePedido/>}/>
                <Route path="oferta/:reporte" element={<ReportePedido_/>}/>
                <Route path="oferta/detalle/:reporte" element={<DetallePedido_/>}/>
                <Route path="cliente/estadocuenta" element={<EstadoCuenta/>}/>
                <Route path="cliente/facturas" element={<FacturasCliente/>}/>
            <Route path="*" element={<NotFound/>} />
            </Route>
        </Routes>
        </>
    );
}
