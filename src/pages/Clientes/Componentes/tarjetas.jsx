import { Badge, ListGroup } from "react-bootstrap";
import { BsFileEarmarkPdf } from "react-icons/bs";
import '../style/tabla.css'

const estado = {
    O: 'Abierto',
    C: 'Cerrado'
}


export function DocumentoCard({item, handlePDF, tipo}){
    //0: facturas, 1: notas de credito
    return (
        <div>
        <div className="card default animate tw-w-full tw-px-3 tw-pb-2 tw-pt-1 tw-rounded-b-none tw-bg-[#6C757D]">
            <div className="tw-flex tw-justify-between tw-w-full">
                {/* Se quita el codigo LT O 08 ANTES DEL - */}
                <div className="tw-flex tw-flex-col tw-w-full">
                    <div className="tw-flex tw-justify-between">
                        <div className="tw-flex">
                            <p className="tw-text-[#F5F5F5] tw-mb-0 tw-text-sm">Folio: &nbsp;</p>
                            <p className="tw-text-[#FFFFFF] tw-mb-0 tw-text-sm tw-font-semibold">{`${item.FOLIO_PREFIJO}-${item.FOLIO_NUMERO}` || (<>&nbsp;</>)}</p>
                        </div>
                        <div className="tw-flex">
                            <p className="tw-text-[#F5F5F5] tw-mb-0 tw-text-sm">Total: &nbsp;</p>
                            <p className="tw-text-[#FFFFFF] tw-mb-0 tw-text-sm tw-font-semibold">S/.{item.TOTAL.toLocaleString() || (<>&nbsp;</>)}</p>
                        </div>
                    </div>
                    <div className="tw-flex">
                        {tipo === '0' ? (
                        <>
                            <p className="tw-text-[#F5F5F5] tw-mb-0 tw-text-sm">T. De pago: &nbsp;</p>
                            <p className="tw-text-[#FFFFFF] tw-mb-0 tw-text-sm">{`${item.TIPO_PAGO || ''}` || (<>&nbsp;</>)}</p>
                        </>
                        ):(
                        <>
                            <p className="tw-text-[#F5F5F5] tw-mb-0 tw-text-sm">Estado: &nbsp;</p>
                            <Badge bg={item.STATUS === 'O' ? "success" : "warning"}>{`${estado[item.STATUS] || ''}`}</Badge>
                            {/* <p className="tw-text-[#FFFFFF] tw-mb-0 tw-text-sm tw-bg-red-500">{`${estado[item.STATUS] || ''}`}</p> */}
                        </>
                        )}
                    </div>
                </div>
            </div>
        </div>
        <ListGroup className="tw-w-full tw-border tw-border-yellow-500 tw-rounded-lg" >
        <ListGroup.Item className="tw-px-3 tw-py-1 tw-w-full tw-rounded-t-none" >
            <div className="tw-flex tw-justify-between tw-items-center">
                <div>
                    <p className="tw-text-sm tw-font-medium tw-mb-0 tw-text-gray-700">F. Emisión:</p>
                    <p className="tw-text-sm tw-my-0">{item.FECHA_EMISION || (<>&nbsp;</>)}</p>
                </div>
                <div>
                    <p className="tw-text-sm tw-font-medium tw-my-0">F. Vencimiento:</p>
                    <p className="tw-text-sm tw-my-0">{item.FECHA_VENCIMIENTO || (<>&nbsp;</>)}</p>
                </div>
                <div>
                    <p className="tw-text-sm tw-font-medium tw-my-0">Archivo:</p>
                    <div>
                        <button className="button-14 tw-w-fit tw-h-10" onClick={()=>{handlePDF(item.RUTA_ARCHIVO)}}>
                            <BsFileEarmarkPdf size={22}/>
                        </button>
                    </div>
                </div>
            </div>
        </ListGroup.Item>
        </ListGroup>
        </div>
    )
}