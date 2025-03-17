import { useEffect, useState, useContext } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getPedido } from '../../services/pedidoService';
import { MyListGroup } from './componentes/MyListGroup';
import { commercialContext } from '../../context/ComercialContext';
import { decodeJWT } from '../../utils/decode';
import { PedidoCarusel } from './componentes/PedidoCarusel';
import Carousel from 'react-bootstrap/Carousel';
import DetallePedido from './DetallePedido';

const pages = {
    lista: 0,
    detalle: 1,
}

export default function ReportePedido() {
    const [listReporte, setListReporte] = useState([]);
    const [itemSelected,  setItemSelected] = useState(null);
    const {
        setLoading,
        handleShow,
        handlePedidoCarusel,
        handleTabPedido,
        indexPedidoCarusel,
    } = useContext(commercialContext);

    //obtener la pagina del carusel
    const location = useLocation();
    const navigate = useNavigate()
    const params = useParams();
    const page = new URLSearchParams(location.search).get('page');

    // console.log(page)

    useEffect(()=>{
        handlePedidoCarusel(pages[page])
    },[params])

    useEffect(()=>{
        const waitFunc = async () => {
            setLoading(true);
            const {username} = await decodeJWT();
            const response = await getPedido({usuario_codigo: username}, params.reporte)
            //secure shield
            if(response !== undefined){
                setLoading(false);
                await setListReporte(response);
            }else{
                handleShow();
                setLoading(false);
            }
    };
        waitFunc();
    }, [params]);

    //esta parte para ingresar a la parte detalle
    const handleCarusel = (item) => {
        handleTabPedido('general')
        setItemSelected(item);
        navigate(`/main/pedido/${params.reporte}?page=detalle`)
        // handlePedidoCarusel(1);
    }

    return (
        <div >
            <PedidoCarusel indexPedidoCarusel={indexPedidoCarusel}>
                <Carousel.Item>
                    <MyListGroup data={listReporte} plantilla={params.reporte} handleCarusel={handleCarusel}/>
                </Carousel.Item>
                <Carousel.Item>
                    <DetallePedido itemSelected={itemSelected} tipoPedido={params?.reporte}/>
                </Carousel.Item>
            </PedidoCarusel>
        </div>
    )
}