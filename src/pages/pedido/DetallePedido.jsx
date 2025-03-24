import { MyListGroup } from './componentes/MyListGroup'
import MyTabPedido from './componentes/MyTabPedido'
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const actions = [
    { icon: <ModeEditIcon />, name: 'Editar' },
  ];

export default function DetallePedido() {
    const navigate = useNavigate() // se utiliza para la opcion editar
    const location = useLocation();
    const {reporte: tipoPedido} = useParams();
    const {item: itemSelected, tipo: tipoDoc} = location.state;


    return (
        <>
            {/* editar se activa solo para pendiente */}
            {tipoPedido === 'pendiente' && tipoDoc === 'pedido' && (
                <SpeedDial
                    ariaLabel="SpeedDial basic example"
                    sx={{ position: 'fixed', bottom: 32, right: 16 }}
                    icon={<SpeedDialIcon />}
                >
                    {actions.map((action) => (
                    <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    tooltipOpen
                    onClick={()=>navigate('/main/nuevopedido/editar', {state: {docentry: itemSelected?.DocEntry}})}
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
        </>
    )
}
