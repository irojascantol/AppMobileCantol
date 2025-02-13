import { useContext } from 'react'
import { commercialContext } from '../../context/ComercialContext'
import MyTabPedido from './componentes/MyTabPedido'
import { MyListGroup } from './componentes/MyListGroup'
import { useLocation, useParams } from 'react-router-dom'

export default function DetallePedido_() {
    const {handlePedidoCarusel, handleTabPedido} = useContext(commercialContext)
    const location = useLocation();

    const {reporte: tipoPedido} = useParams();
    const {item: itemSelected, tipo: tipoDoc} = location.state;

    return (
        <>
            <MyTabPedido components={[
            <MyListGroup data={itemSelected} plantilla='general' tipoPedido={tipoPedido} tipoDoc={tipoDoc}/>,
            <MyListGroup data={itemSelected} plantilla='contenido' tipoPedido={tipoPedido} tipoDoc={tipoDoc}/>,
            <MyListGroup data={itemSelected} plantilla='logistica' tipoPedido={tipoPedido} tipoDoc={tipoDoc}/>,
            <MyListGroup data={itemSelected} plantilla='finanzas' tipoPedido={tipoPedido} tipoDoc={tipoDoc}/>]}/>
        </>
    )
}
