import { dsctEquiv, truncate } from "../../utils/math";


export function mergeComments(str1, str2){
    if(!!str1 && !!str2){
        return  str1 + " | " + str2;
    }else if(!!str1 && !str2){
        return  str1;
    }else if(!str1 && !!str2){
        return  str2;
    }else{
        return '';
    }
}

export function makeSaleOrderBody(saleOrder, location, dsctFormato){
    // PayToCode: 'DOMICILIO_FISCAL',
    let body = {
        CardCode: saleOrder?.cliente_codigo,
        DocDueDate: saleOrder?.fentrega,
        U_MSSM_CLM: saleOrder?.numero,
        DiscountPercent: saleOrder?.montos?.descuento || 0,
        Comments: mergeComments(saleOrder?.comentarios.vendedor, saleOrder?.comentarios.nota_anticipo),
        PaymentGroupCode: saleOrder?.condicionpago[0]?.PaymentGroupCode,
        FederalTaxID: saleOrder?.ruc || '',
        PayToCode: saleOrder?.direccionentrega[0]?.identificador_direccion || '',
        ShipToCode: saleOrder?.direccionentrega[0]?.direccion_codigo || '',
        U_MSSL_RTR: saleOrder?.ructransporte?.documento_transporte || '',
        U_MSSL_NTR: saleOrder?.ructransporte?.nombre_transporte || '',
        U_MSSL_DTR: saleOrder?.ructransporte?.direccion_transportista || '',
        U_MSSL_ITR: saleOrder?.ructransporte?.distrito_transportista,
        U_MSSF_CEX1: saleOrder?.institucional?.cmp1,
        U_MSSF_CEX2: saleOrder?.institucional?.cmp2,
        U_MSSF_CEX3: saleOrder?.institucional?.cmp3,
        U_MSSF_ORDC: saleOrder?.institucional?.oc,
        grupo_familia: saleOrder?.grupo_familia,
        // ubicacion: saleOrder?.ubicacion,
        ubicacion: saleOrder?.direccionentrega[0]?.ubicacion,
        U_DIS_LATITU: location?.latitud?.toString() || null,
        U_DIS_LONGIT: location?.longitud?.toString() || null,
        U_DST_DESOTO: dsctFormato?.dsctDoc?.dsct1?.selected || 0.0,
        U_DST_PERCENT: dsctFormato?.dsctDoc?.dsctFP?.enabled ? dsctFormato?.dsctDoc?.dsctFP?.value || 0.0 : 0.0,
        U_MSS_CATESN: saleOrder?.dsctCateCode || null,
        // U_MSSL_SECL: saleOrder?.segmentacion_cliente || null, //segmento del cliente
        U_DIS_IDCOTI: saleOrder?.tipocotizacion || null,
        DocumentLines: saleOrder?.products?.map((product)=>({
          ItemCode: product?.codigo,
          Quantity: product?.cantidad,
          TaxCode: product?.impuesto?.codigo,
          WarehouseCode: product?.almacen,
          UnitPrice: product?.precio,
          U_MSSC_NV1: product?.dsct_porcentaje,
          U_MSSC_NV2: product?.dsct_porcentaje2 || 0,
          U_MSSC_NV3: 0,
          U_MSSC_DSC: truncate(dsctEquiv(product?.dsct_porcentaje, product?.dsct_porcentaje2), 2),
          DiscountPercent: truncate(dsctEquiv(product?.dsct_porcentaje, product?.dsct_porcentaje2), 2),
          U_MSS_ITEMBONIF: ('tipo' in product)?'Y':'N',
          U_MSSC_BONI: ('tipo' in product)?'Y':'N',
        }))
    }
    return body
}


/**
 * Funcion que retorna lista de descuentos con resolucion step,
 * descuentos dentro del intervalo de min y max
 */
export function generarDiscountNv1List({
    minVal=null, maxVal=null, step=null, minIgnore=null, maxIgnore=null, threshold=null
}) {
    const resultado = [[0.0, false]];  // Valor inicial [0.0, false]
    
    for (let i = minVal; i <= maxVal; i += step) {
        // Filtrar los valores dentro del intervalo [minIgnore, maxIgnore]
        if (i < minIgnore || i > maxIgnore) {
            // Agregar el número y el booleano según el parámetro threshold
            resultado.push([i, i > threshold]);
        }
    }
    return resultado;
}
// export function generarDiscountNv1List(minVal, maxVal, step, minIgnore, maxIgnore) {
//     const resultado = [0];
//     for (let i = minVal; i <= maxVal; i += step) {
//         // Filtrar los valores dentro del intervalo [minIgnore, maxIgnore]
//         if (i < minIgnore || i > maxIgnore) {
//             resultado.push(i);
//         }
//     }
//     return resultado;
// }