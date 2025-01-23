const options = {
    enableHighAccuracy: true,
    timeout: 3000, // 3 segundos de timeout
    maximumAge: 0,
}

export const getCurrentLocation = (intentos = 2) => {
    return new Promise((resolve, reject) => {
      function intento() {
        if (intentos <= 0) {
            reject("No se pudo obtener la geolocalización");
            return;
        }
        navigator.geolocation.getCurrentPosition(
          (posicion) => {
                const latitud = posicion.coords.latitude;
                const longitud = posicion.coords.longitude;
                resolve({latitud, longitud})
          },
          (error) => {
            console.log(`Intento fallido. Quedan ${intentos - 1} intentos.`);
            getCurrentLocation(intentos - 1).then(resolve).catch(reject);
          }
        );
      }
  
      intento(); // Empezamos el primer intento
    });
  }