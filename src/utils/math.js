export function truncate(number, decimals){
    let decima = Math.pow(10, decimals)
    if(Number.isInteger(decimals)){
        return (Math.floor(number * decima) / decima);
    }else{
        return null;
    }
}