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
    let body = {
        CardCode: saleOrder?.cliente_codigo,
        DocDueDate: saleOrder?.fentrega,
        U_MSSM_CLM: saleOrder?.numero,
        DiscountPercent: saleOrder?.montos?.descuento || 0,
        Comments: mergeComments(saleOrder?.comentarios.vendedor, saleOrder?.comentarios.nota_anticipo),
        PaymentGroupCode: saleOrder?.condicionpago[0]?.PaymentGroupCode,
        FederalTaxID: saleOrder?.ruc || '',
        PayToCode: 'DOMICILIO_FISCAL',
        ShipToCode: saleOrder?.direccionentrega[0]?.direccion_codigo || '',
        U_MSSL_RTR: saleOrder?.ructransporte?.documento_transporte || '',
        U_MSSL_NTR: saleOrder?.ructransporte?.nombre_transporte || '',
        U_MSSF_CEX1: saleOrder?.institucional?.cmp1,
        U_MSSF_CEX2: saleOrder?.institucional?.cmp2,
        U_MSSF_CEX3: saleOrder?.institucional?.cmp3,
        U_MSSF_ORDC: saleOrder?.institucional?.oc,
        grupo_familia: saleOrder?.grupo_familia,
        ubicacion: saleOrder?.ubicacion,
        U_DIS_LATITU: location?.latitud?.toString() || null,
        U_DIS_LONGIT: location?.longitud?.toString() || null,
        U_DST_DESOTO: dsctFormato?.dsctDoc?.dsct1?.selected || 0.0,
        U_DST_PERCENT: dsctFormato?.dsctDoc?.dsctFP?.enabled ? dsctFormato?.dsctDoc?.dsctFP?.value || 0.0 : 0.0,
        DocumentLines: saleOrder?.products?.map((product)=>({
          ItemCode: product?.codigo,
          Quantity: product?.cantidad,
          TaxCode: product?.impuesto?.codigo,
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
export function generarDiscountNv1List(minVal, maxVal, step) {
    const resultado = [0];
    for (let i = minVal; i <= maxVal; i += step) {
        resultado.push(i);
    }
    return resultado;
}