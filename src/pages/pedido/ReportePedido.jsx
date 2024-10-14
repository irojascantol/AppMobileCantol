import { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { getPedido } from '../../services/pedidoService';
import { MyListGroup } from './componentes/MyListGroup';
import { commercialContext } from '../../context/ComercialContext';
import { decodeJWT } from '../../utils/decode';
import { PedidoCarusel } from './componentes/PedidoCarusel';
import Carousel from 'react-bootstrap/Carousel';
import DetallePedido from './DetallePedido';

export default function ReportePedido() {
    const params = useParams();
    const [listReporte, setListReporte] = useState([]);
    const [itemSelected,  setItemSelected] = useState(null);
    const {
        setLoading,
        handleShow,
        handlePedidoCarusel,
        handleTabPedido,
    } = useContext(commercialContext);

    useEffect(()=>{
        const waitFunc = async () => {
            setLoading(true);
            const {username} = await decodeJWT();
            const response = await getPedido({usuario_codigo: username}, params.reporte)
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

    const handleCarusel = (item) => {
        setItemSelected(item);
        handleTabPedido('general')
        handlePedidoCarusel(1);
    }

    return (
        <div >
            <PedidoCarusel>
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
