import React, { useState } from 'react'
import { createContext } from 'react'
import meLogo from '../pages/login/assets/cantol_black.png'
import tecnoLogo from '../pages/login/assets/tecnopress_alt.png'
import distriLogo from '../pages/login/assets/distrimax_azul.png'
import { reverseString } from '../utils/string'

const commercialContext = createContext()

const logos = {
  CNT: meLogo,
  TCN: tecnoLogo,
  DTM: distriLogo,
}

function ComercialContext({children}) {
    const [logo_c, setLogo_C] = useState(!!sessionStorage.getItem("CDTToken") ? logos[sessionStorage.getItem("Logo")] : logos["CNT"]);
    const [loading, setLoading] = useState(false);
    const [userName,  setUserName] = useState(!!sessionStorage.getItem("USR") ? reverseString(sessionStorage.getItem("USR")) : undefined)
    const [showSecurity, setShowSecurity] = useState(false);
    const [indexPedidoCarusel, setIndexPedidoCarusel] = useState(0);
    const [tabActivePedido,  setTabActivePedido] = useState('general');
    const [searchClientModal,  setSearchclientModalOpen] = useState({show: false, modalTitle: '', returnedValue: undefined, options: [], operacion: null, placeholder: null});
    const [showInputTextModal, setShowInputTextModal] = useState({show: false, modalTitle: '', returnedValue: undefined, options: [], tipomodal:null, operacion:null});
    const [isClientChanged, setClienteChange] = useState({active: false, dsct: false});
    //orden de pedido
    const [nuevoPedido, setNuevoPedido] =  useState({cliente_codigo: null, numero:null, ruc:null, razonsocial:null, telefono: null, fcontable: null, fentrega: null, direccionentrega:null, 
      ructransporte: null, moneda:null, codigogrupo: null, condicionpago:null, comentarios:{vendedor: null, nota_anticipo: null}, products: [], institucional: null, montos: {valor_venta: 0, descuento: 0, impuesto: 0, total_cred_anti: 0, total: 0,
        unidad: null, anticipo: 0, nota_credito: 0,}})
    
    //handlers
    const handleShow = () => setShowSecurity(true);
    const handleClose = () => setShowSecurity(false);
    const handleLogo = (logo_) => setLogo_C(logos[logo_]);
    const handleUser = (name) => setUserName(name);
    const handlePedidoCarusel = (index) => setIndexPedidoCarusel(index);
    const handleTabPedido = (tabPedido) => setTabActivePedido(tabPedido);
    //handler buscar modal
    const handleSearchModal = (obj) => setSearchclientModalOpen({...searchClientModal, ...obj})
    //handler nuevo pedido
    const handleNewSaleOrder = (obj) => setNuevoPedido({...nuevoPedido, ...obj})
    //handler setear nuevoPedido a cero
    const handleSaleOrder2Init = () => setNuevoPedido({cliente_codigo: null, numero:null, ruc:null, razonsocial:null, telefono: null, fcontable: null, fentrega: null, direccionentrega:null, 
      ructransporte: null, moneda:null, codigogrupo: null, condicionpago:null, comentarios:{vendedor: null, nota_anticipo: null}, products: [], institucional: null, montos: {valor_venta: 0, descuento: 0, impuesto: 0, total_cred_anti: 0, total: 0,
        unidad: null, anticipo: 0, nota_credito: 0,}})
    //handlers input modal / combo - text - date
    const handleInputTextModal = (obj) => setShowInputTextModal({...showInputTextModal, ...obj})
    //hanlder actualizacion de cliente
    const handleClienteChange = (obj) => {setClienteChange({...isClientChanged, ...obj})}
  
  return (
    <commercialContext.Provider value={
      {
        loading,
        userName,
        logo_c,
        indexPedidoCarusel,
        tabActivePedido,
        showSecurity,
        searchClientModal,
        showInputTextModal,
        isClientChanged,
        nuevoPedido,
        setLoading,
        handleShow,
        handleClose,
        handleLogo,
        handleUser,
        handlePedidoCarusel,
        handleTabPedido,
        //handler buscar modal
        handleSearchModal,
        //handler datos nuevo pedido
        handleNewSaleOrder,
        //handler setear nuevoPedido a cero
        handleSaleOrder2Init,
        //handler text modales
        handleInputTextModal,
        //handler update client
        handleClienteChange
      }
    }>
        {children}
    </commercialContext.Provider>
  )
}

export { ComercialContext, commercialContext} 
