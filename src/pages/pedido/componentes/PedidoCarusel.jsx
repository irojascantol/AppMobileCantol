import { useContext, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { commercialContext } from '../../../context/ComercialContext';
import '../../../style/carusel.css'

function PedidoCarusel({children}) {
    const {indexPedidoCarusel} = useContext(commercialContext)
    return (
        <Carousel activeIndex={indexPedidoCarusel} slide={true} indicators={false}>
            {children}
        </Carousel>
    );
}

export {PedidoCarusel};