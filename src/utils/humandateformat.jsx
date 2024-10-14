export const getHumanDateFormat = (data) => {
    const date = new Date(data);
    date.setDate(date.getDate() + 1);
    const options = { year: 'numeric', month: 'numeric', day: 'numeric'
    };
    return date.toLocaleDateString('es-PE', options);
  }

export const getHumanDateFormat_plus = (data, daysmore) => {
  const date = new Date(data);
  date.setDate(date.getDate() + 1 + daysmore);
  return date
}

//2024-05-06
export function getFormatShipDate({fechacontable: fecha, moredays = 0}) {
  fecha.setDate(fecha.getDate() + 1 + moredays);
  fecha.toISOString().split('T')[0]
  var d = fecha?.getDate();
  var m = ("0" + (fecha.getMonth() + 1)).slice(-2);
  var y = fecha?.getFullYear();
  return '' +  y + '-' + m + '-' + (d <= 9 ? '0' + d : d)
}

//06-05-2024
export function getFormatShipDate_peru({fecha: fecha_date, moredays = 0}) {
  fecha_date.setDate(fecha_date.getDate() + 1 + moredays);
  let d = String(fecha_date.getDate()).padStart(2, '0'); // Asegura que tenga dos dígitos
  let m = String(fecha_date.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
  let y = fecha_date.getFullYear();
  return '' + (Number(d) <= 9 ? '0' + Number(d) : d) + '/' + m + '/' + y;
}