
export const upSelectedOption = (org_data, value, operacion) => {
    let data = [...org_data]
    if (operacion === 'condicionpago'){
        data.forEach(function(item,i){
            if(item.PaymentGroupCode === Number(value)){
                data.splice(i, 1);
                data.unshift(item);
            }
        })
    }else if(operacion = 'direccionentrega'){
        data.forEach(function(item,i){
            if(item?.direccion_codigo === value){
                data.splice(i, 1);
                data.unshift(item);
            }
        })
    }else{
        data.forEach(function(item,i){
            if(item === value){
                data.splice(i, 1);
                data.unshift(item);
            }
        })
    }
    return data;        
}