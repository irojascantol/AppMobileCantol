
export function truncate(number, decimals){
    let decima = Math.pow(10, decimals)
    if(Number.isInteger(decimals)){
        return (Math.floor(number * decima) / decima);
    }else{
        return null;
    }
}

//funcion que obtiene dsct equivalente en %
export function dsctEquiv(dsct1, dsct2){
    return (((dsct1*0.01) + (dsct2*0.01) - (dsct1*0.01)*(dsct2*0.01))*100) || 0;
}

export function addOneDecimal(number){
    return number.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}