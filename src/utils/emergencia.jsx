

export const direccion_entrega_cambio = (data, canal) => {
    if (canal === 114){ //canal institucional
        return data.filter((item)=>item.direccion_codigo === 'entrega')
    }else{
        return data
    }
}