import { useContext, useState } from 'react';
import { NavItem } from 'react-bootstrap';
import {NavLink} from 'react-bootstrap';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { commercialContext } from '../../context/ComercialContext';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Spinner from 'react-bootstrap/Spinner';
import "../../style/NavBar1.css"

import {
    BsTruck ,
    BsFileEarmarkCheck,
    BsFillPersonFill,
    BsHouse,
    BsFileEarmarkBreak,
} from "react-icons/bs";
import { getCodigo } from '../../utils/objects';
import { validaAcceso } from '../../services/usuario';
import { decodeJWT } from '../../utils/decode';

//viene el codigo de las rutas
const codigo_permisos = {
  entrega: {
    pendiente: {direccion: '/main/entrega/pendientechofer' , codigo: 'DSPTOL'},
    completo: {direccion: '/main/entrega/completochofer' , codigo: 'DSPTOL'},
  },
  pedido: {
    nuevo: {direccion: '/main/nuevopedido/venta' , codigo: 'COMPED'},
    oferta: {direccion: '/main/nuevopedido/oferta', codigo: 'COMOFR'},
    pendiente: {direccion: '/main/pedido/pendiente' , codigo: 'COMRPT'},
    aprobado: {direccion: '/main/pedido/aprobado' , codigo: 'COMRPT'},
    rechazado: {direccion: '/main/pedido/rechazado' , codigo: 'COMRPT'},
    facturado: {direccion: '/main/pedido/facturado' , codigo: 'COMRPT'}
  },
  oferta: {
    pendiente: {direccion: '/main/oferta/pendiente' , codigo: 'COMRPT'},
  },
  cliente: {
    estadocuenta: {direccion: '/main/cliente/estadocuenta' , codigo: 'COMEST'},
    facturas: {direccion: '/main/cliente/facturas' , codigo: 'COMFAC'},
  }
}

const NavBar1 = () => {
    const navigate = useNavigate()
    const [expanded,  setExpanded] = useState(false);
        
    const {
      loading,
      userName,
      handleTabPedido,
    } = useContext(commercialContext)

    const innerNavigate = (path, tipo) => {
      // console.log(path, tipo)
      setExpanded(false)
      !tipo && navigate(path)
      !!tipo && navigate(path, { state: { tipo } }) // para identficar si es pedido u oferta
    }

    const navigate2Path = async (path, tipo) => {
      //filtra el query paramater
      let route = path.split('?')[0]
      const codigo_modulo = await getCodigo(codigo_permisos, route);
      const {company: empresa_codigo, username: usuario_login } = await decodeJWT() || {company: undefined, username: undefined};
      let body = {
        usuario_login: usuario_login,
        empresa_codigo: empresa_codigo,
        modulo_codigo: codigo_modulo
      }
      if(!!empresa_codigo && !!usuario_login){
        const {acceso} = await validaAcceso(body)
        // console.log("muestrame acceso:",acceso)
        // if(1){
        if(!!acceso){
          innerNavigate(path, tipo)
        }else{
          alert('No cuenta con permisos para ingresar');
          setExpanded(false);
        }
      }
    }

    return (
    <div>
      <Navbar expanded={expanded} expand="xl" color='dark' className="bg-body-tertiary border border-indigo-600">
        <Container>
          {/* <Navbar.Brand href="/AppMobileCantol/#/main/home" className='tw-h-12'> */}
          <Navbar.Brand href="/#/main/home" className='tw-h-12'>
            <div className='tw-h-full tw-flex tw-gap-2 tw-justify-center tw-items-center'>
              <div className='tw-block tw-h-full'>
                <i className="tw-ml-2 tw-h-fit"><BsFillPersonFill size={26} color='gray'/></i>
              </div>
                <p className='tw-m-0 tw-h-fit tw-text-gray-500 tw-font-mono'>{userName || 'user'}</p>
            </div>
          </Navbar.Brand>
          {/* #### */}
            <div className='tw-flex tw-content-center tw-gap-2'>
              {loading && (
                <div>
                  <Spinner animation="border" role="status" variant='secondary'/>
                </div>
              )}
              <div>
                <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={()=>setExpanded(!expanded)}/>
              </div>
            </div>
          {/* #### */}
          <Navbar.Collapse id="basic-navbar-nav" expand="xl" className=''>
            <Nav className="me-auto tw-mt-0" expand="xl">
            <hr className='tw-my-0'/>
            <NavItem className='nav-item-custom-height'>
                  <div className='nav-item-custom-height hola' onClick={()=>{navigate('/main/home'); setExpanded(false);}}>
                    <NavLink href="#">Inicio</NavLink>
                  </div>
            </NavItem>
            <hr className='tw-my-0'/>
              <NavItem className='nav-item-custom-height '>
                  <div className='nav-item-custom-height hola' onClick={()=>{navigate2Path('/main/entrega/pendientechofer')}}>
                    <NavLink className='' href="#">Entregas</NavLink>
                  </div>
              </NavItem>
              <hr className='tw-my-0'/>
              <NavDropdown title="Pedidos" id="basic-nav-dropdown" className='nav-dropdown-custom-height'>
                  <NavItem className='nav-item-custom-height'>
                    <div className='nav-item-custom-height tw-w-full' onClick={()=>{navigate2Path('/main/nuevopedido/venta')}}>
                      <NavLink href="#">Nuevo pedido</NavLink>
                    </div>
                  </NavItem>
                  <NavItem className='nav-item-custom-height'>
                    <div className='nav-item-custom-height tw-w-full' onClick={()=>{navigate2Path('/main/nuevopedido/oferta')}}>
                      <NavLink href="#">Nueva cotización</NavLink>
                      {/* icono no va */}
                    </div>
                  </NavItem>
                  <NavDropdown title="Estados" id="basic-nav-dropdown" className='nav-dropdown-custom-height'>
                    <NavDropdown title="Pedidos" id="basic-nav-dropdown" className='nav-dropdown-custom-height'>
                      <div className='tw-w-full' onClick={()=>{navigate2Path('/main/pedido/aprobado?page=lista', 'pedido')}}>
                        <NavDropdown.Item href="#">Aprobados</NavDropdown.Item>
                      </div>
                      <NavDropdown.Divider />
                      <div className='tw-w-full' onClick={()=>{navigate2Path('/main/pedido/pendiente?page=lista', 'pedido')}}>
                        <NavDropdown.Item href="#">Pendientes</NavDropdown.Item>
                      </div>
                      <NavDropdown.Divider />
                      <div className='tw-w-full' onClick={()=>{navigate2Path('/main/pedido/rechazado?page=lista', 'pedido')}}>
                        <NavDropdown.Item href="#">Rechazados</NavDropdown.Item>
                      </div>
                      <NavDropdown.Divider />
                      <div className='tw-w-full' onClick={()=>{navigate2Path('/main/pedido/facturado?page=lista', 'pedido')}}>
                        <NavDropdown.Item href="#">Facturados</NavDropdown.Item>
                      </div>
                    </NavDropdown>
                    <NavDropdown title="Cotizaciones" id="basic-nav-dropdown" className='nav-dropdown-custom-height'>
                      <div className='tw-w-full' onClick={()=>{navigate2Path('/main/pedido/pendiente?page=lista', 'ofertas')}}>
                        <NavDropdown.Item href="#">Pendientes</NavDropdown.Item>
                      </div>
                    </NavDropdown>
                  </NavDropdown>
              </NavDropdown>
              <hr className='tw-my-0'/>
                <NavDropdown title="Clientes" id="basic-nav-dropdown" className='nav-dropdown-custom-height'>
                    <NavItem className='nav-item-custom-height'>
                      <div className='nav-item-custom-height tw-w-full' onClick={()=>{navigate2Path('/main/cliente/estadocuenta')}}>
                        <NavLink href="#">Estado de cuenta</NavLink>
                      </div>
                    </NavItem>
                    <NavItem className='nav-item-custom-height'>
                      <div className='nav-item-custom-height tw-w-full' onClick={()=>{navigate2Path('/main/cliente/facturas')}}>
                        <NavLink href="#">Facturas</NavLink>
                      </div>
                    </NavItem>
                </NavDropdown>
              <hr className='tw-my-0'/>
              <NavItem className='nav-item-custom-height hola'>
                  <div onClick={()=>{sessionStorage.removeItem("CDTToken"); sessionStorage.removeItem("USR");handleTabPedido('xxx');}}>
                    {/* <NavLink href="/AppMobileCantol/">Salir</NavLink> */}
                    <NavLink href="/">Salir</NavLink>
                  </div>
              </NavItem>
              <hr className='tw-my-0'/>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet/>
    </div>
  );
}

export { NavBar1 };