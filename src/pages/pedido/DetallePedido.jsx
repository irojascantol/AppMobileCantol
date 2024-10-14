import { useContext } from 'react'
import { commercialContext } from '../../context/ComercialContext'
import MyTabPedido from './componentes/MyTabPedido'
import { MyListGroup } from './componentes/MyListGroup'
import Button from 'react-bootstrap/Button';

export default function DetallePedido({itemSelected = {}, tipoPedido= 'None'}) {
    const {handlePedidoCarusel} = useContext(commercialContext)
    return (
        <>
            <MyTabPedido components={[
            <MyListGroup data={itemSelected} plantilla='general' tipoPedido={tipoPedido}/>,
            <MyListGroup data={itemSelected} plantilla='contenido' tipoPedido={tipoPedido}/>,
            <MyListGroup data={itemSelected} plantilla='logistica' tipoPedido={tipoPedido}/>,
            <MyListGroup data={itemSelected} plantilla='finanzas' tipoPedido={tipoPedido}/>]}/>
            <div className='tw-w-screen tw-flex tw-justify-end tw-my-7 tw-pr-4'>
                <Button variant="secondary" onClick={()=>{console.log("moviendo carrusel");handlePedidoCarusel(0)}}>Retornar</Button>
            </div>
        </>
    )
}
