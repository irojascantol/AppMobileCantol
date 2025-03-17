import { useContext } from 'react'
import { commercialContext } from '../../context/ComercialContext'
import { MyListGroup } from './componentes/MyListGroup'
import MyTabPedido from './componentes/MyTabPedido'
// import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { useNavigate } from 'react-router-dom';

const actions = [
    { icon: <ModeEditIcon />, name: 'Editar' },
  ];

export default function DetallePedido({itemSelected = {}, tipoPedido= 'None'}) {
    // const {handlePedidoCarusel, handleTabPedido} = useContext(commercialContext)
    const navigate = useNavigate()
    return (
        <>
            {/* editar se activa solo para pendiente */}
            {tipoPedido === 'pendiente' && (
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



            <MyTabPedido components={[
            <MyListGroup data={itemSelected} plantilla='general' tipoPedido={tipoPedido}/>,
            <MyListGroup data={itemSelected} plantilla='contenido' tipoPedido={tipoPedido}/>,
            <MyListGroup data={itemSelected} plantilla='logistica' tipoPedido={tipoPedido}/>,
            <MyListGroup data={itemSelected} plantilla='finanzas' tipoPedido={tipoPedido}/>]}/>
        </>
    )
}
