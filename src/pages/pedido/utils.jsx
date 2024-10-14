

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

export function makeSaleOrderBody(saleOrder, location){
    let body = {
        CardCode: saleOrder?.cliente_codigo,
        DocDueDate: saleOrder?.fentrega,
        U_MSSM_CLM: saleOrder?.numero,
        DiscountPercent: saleOrder?.montos?.descuento || 0,
        Comments: mergeComments(saleOrder?.comentarios.vendedor, saleOrder?.comentarios.nota_anticipo),
        PaymentGroupCode: saleOrder?.condicionpago[0]?.PaymentGroupCode,
        FederalTaxID: saleOrder?.ruc || '',
        ShipToCode: saleOrder?.direccionentrega[0]?.direccion_codigo || '',
        U_MSSL_RTR: saleOrder?.ructransporte?.documento_transporte || '',
        U_MSSF_CEX1: saleOrder?.institucional?.cmp1,
        U_MSSF_CEX2: saleOrder?.institucional?.cmp2,
        U_MSSF_CEX3: saleOrder?.institucional?.cmp3,
        U_MSSF_ORDC: saleOrder?.institucional?.oc,
        grupo_familia: saleOrder?.grupo_familia,
        ubicacion: saleOrder?.ubicacion,
        U_DIS_LATITU: location?.latitud?.toString() || null,
        U_DIS_LONGIT: location?.longitud?.toString() || null,
        DocumentLines: saleOrder?.products?.map((product)=>({
          ItemCode: product?.codigo,
          Quantity: product?.cantidad,
          TaxCode: product?.impuesto?.codigo,
          UnitPrice: product?.precio,
          DiscountPercent: product?.dsct_porcentaje,
          U_MSSC_NV1: product?.dsct_porcentaje,
          U_MSSC_NV2: 0,
          U_MSSC_NV3: 0,
          U_MSSC_DSC: product?.dsct_porcentaje,
          U_MSS_ITEMBONIF: ('tipo' in product)?'Y':'N',
          U_MSSC_BONI: ('tipo' in product)?'Y':'N',
        }))
    }
    return body
}