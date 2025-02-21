
export function truncate(number, decimals){
    let decima = Math.pow(10, decimals)
    if(Number.isInteger(decimals)){
        return (Math.floor(number * decima) / decima);
    }else{
        return null;
    }
}

//funcion que obtiene dsct equivalente en %
export function dsctEquiv(dsct1, dsct2, decimal=false){
    //decimal true, para que devuelva el porcetaje entre 0 y 1
    dsct1 = dsct1 === undefined ? 0 : dsct1;
    dsct2 = dsct2 === undefined ? 0 : dsct2;
    return !decimal ? ((((dsct1*0.01) + (dsct2*0.01) - (dsct1*0.01)*(dsct2*0.01))*100) || 0) : ((dsct1*0.01) + (dsct2*0.01) - (dsct1*0.01)*(dsct2*0.01));
}

export function addOneDecimal(number){
    // console.log(parseFloat(number).toFixed(2))
    // return number.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
    return parseFloat(number).toFixed(2)
}