
export const upSelectedOption = (org_data, value, operacion) => {
    if (org_data !== null){
    
    let data = [...org_data]

    //funcion que ordena alfabeticamente la condicion de pago
    data.sort((a,b)=>{
        if (a.PymntGroup < b.PymntGroup) {
            return -1; // 'a' viene antes que 'b'
          }
          if (a.PymntGroup > b.PymntGroup) {
            return 1;  // 'b' viene antes que 'a'
          }
          return 0; // Si son iguales
    })

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
    }else{
        return [value]
    }

}