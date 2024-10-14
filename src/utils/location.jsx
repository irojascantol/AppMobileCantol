const options = {
    enableHighAccuracy: true,
    timeout: 1000,
    maximumAge: 0,
}
//
export const getCurrentLocation = async () => {
    return new Promise((resolve, reject)=>{
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
                position => {
                    const latitud = position.coords.latitude;
                    const longitud = position.coords.longitude;
                    resolve({latitud, longitud})
                }, 
                error=>{
                    resolve({message: error.message})
                    // reject(error)
                }, 
                options);
        } else{
            reject("No se pudo obtener la ubicacion")
        }
    })
}