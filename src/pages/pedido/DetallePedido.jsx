import { MyListGroup } from './componentes/MyListGroup'
import MyTabPedido from './componentes/MyTabPedido'
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { check_module } from '../../utils/security';
import Backdrop from '@mui/material/Backdrop';
import { useState } from 'react';
import { delay } from '../../utils/delay';
import { getQuotationFile } from '../../services/pedidoService';
import { descargar_enlace_archivo } from '../../utils/file';
import { CircularProgress } from '@mui/material';

const actions = [
    { icon: <ModeEditIcon />, name: 'Editar', valida: true},
  ];

const actions_oferta = [
    { icon: <PictureAsPdfIcon />, name: 'Descargar PDF', valida: false },
  ];

export default function DetallePedido() {
    const navigate = useNavigate() // se utiliza para la opcion editar
    const location = useLocation();
    const {reporte: tipoPedido} = useParams();
    const {item: itemSelected, tipo: tipoDoc} = location.state;
    const [backdrop, setBackdrop] = useState({show: false, message: ''});

    const handleBackdrop  = (obj) => {
        setBackdrop((prop)=>({...prop, ...obj}));
    }

    const derivated_actions = tipoPedido === 'pendiente' && tipoDoc === 'pedido' ? actions : (tipoPedido === 'pendiente' && tipoDoc === 'ofertas') ? actions_oferta : [];

    const validarAccesso = async(valida, item) => {
        if (valida) {
            let acceso = await check_module('COMEOV') //VALIDA ACCESO PARA EDITAR OV
            if(!!acceso){
                navigate('/main/nuevopedido/editar', {state: {docentry: itemSelected?.DocEntry}})
            }else{
            alert('No cuenta con permisos para editar');
        }}else{
            console.log(itemSelected)
            let innerParams = {
                docentry: itemSelected?.DocEntry,
            }
            handleBackdrop({show: true, message: 'Obteniendo cotización ....'}) //inicia ventana bloqueo
            const dataFile = await getQuotationFile(innerParams) //servicio para consumir pdf
            handleBackdrop({show: false}) //termina la venta bloqueo
            !!dataFile && descargar_enlace_archivo(dataFile, `cotizacion-${itemSelected?.DocEntry}`)
        }
    }

    return (
        <>
            {/* editar se activa solo para pendiente */}
            {(tipoPedido === 'pendiente' && (tipoDoc === 'pedido' || tipoDoc === 'ofertas'))  && (
                <SpeedDial
                    ariaLabel="SpeedDial basic example"
                    sx={{ position: 'fixed', bottom: 32, right: 16 }}
                    icon={<SpeedDialIcon />}
                >
                    {derivated_actions.map((action) => (
                        <SpeedDialAction
                            key={action.name}
                            icon={action.icon}
                            tooltipTitle={action.name}
                            tooltipOpen
                            onClick={()=>{validarAccesso(action.valida, itemSelected)}}
                        />
                    ))}
                </SpeedDial>
            )}

            {/* tipoPedido: pendiente, tipoDoc: pedidos */}
            <MyTabPedido components={[
            <MyListGroup data={itemSelected} plantilla='general' tipoPedido={tipoPedido} tipoDoc={tipoDoc}/>,
            <MyListGroup data={itemSelected} plantilla='contenido' tipoPedido={tipoPedido} tipoDoc={tipoDoc}/>,
            <MyListGroup data={itemSelected} plantilla='logistica' tipoPedido={tipoPedido} tipoDoc={tipoDoc}/>,
            <MyListGroup data={itemSelected} plantilla='finanzas' tipoPedido={tipoPedido} tipoDoc={tipoDoc}/>]}/>

            <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={backdrop.show}
            >
                <div className='tw-flex tw-gap-2 tw-items-center'>
                    <CircularProgress color="inherit" size='1rem' />
                    {backdrop.message}
                </div>
                
            </Backdrop>
        </>
    )
}
