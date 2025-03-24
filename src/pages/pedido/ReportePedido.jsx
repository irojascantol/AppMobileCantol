import { useEffect, useState, useContext } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getPedido } from '../../services/pedidoService';
import { MyListGroup } from './componentes/MyListGroup';
import { commercialContext } from '../../context/ComercialContext';
import { decodeJWT } from '../../utils/decode';
// import Carousel from 'react-bootstrap/Carousel';
// import DetallePedido from './DetallePedido';

// const pages = {
//     lista: 0,
//     detalle: 1,
// }

export default function ReportePedido() {
    const [listReporte, setListReporte] = useState([]);
    // const [itemSelected,  setItemSelected] = useState(null);
    const {
        setLoading,
        handleShow,
        handleTabPedido,
    } = useContext(commercialContext);

    const location = useLocation();
    const navigate = useNavigate()
    const params = useParams();
    const {tipo} = location.state; //tipo define si es pedido u oferta
    const page = new URLSearchParams(location.search).get('page');

    useEffect(()=>{
        const waitFunc = async () => {
            setLoading(true);
            const {username} = await decodeJWT();
            const response = await getPedido({usuario_codigo: username}, params.reporte, tipo) //tipo: ofertas, pedido
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
    const move2Detail = (item) => {
        handleTabPedido('general')
        navigate(`/main/pedido/detalle/${params.reporte}`, {state: {item: item, tipo: tipo}})
    }

    return (
        <div >
            <MyListGroup data={listReporte} plantilla={params.reporte} move2Detail={move2Detail}/>
        </div>
    )
}



