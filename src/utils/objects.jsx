export function getCodigo(basePattern, route){
    let returnedValue = null
    for (const key1 in basePattern){
        for (const key2 in basePattern[key1]){
            if(basePattern[key1][key2]['direccion'] === route){
                returnedValue = basePattern[key1][key2]['codigo']
            }
        }
    }
    return returnedValue
}