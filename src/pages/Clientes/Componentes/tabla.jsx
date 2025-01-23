import { ListGroup } from "react-bootstrap";
import { getCurrentDate_day } from "../../../utils/humandateformat";
import '../style/tabla.css'


export function CuentaEstadoCard({bodyItem}){
      return (
        <div>
            <div className="card default animate tw-w-full tw-px-3 tw-pb-2 tw-pt-1 tw-rounded-b-none tw-bg-[#6C757D]">
                <div className="tw-flex tw-justify-between">
                    {/* Se quita el codigo LT O 08 ANTES DEL - */}
                    <div className="tw-flex">
                        <p className="tw-text-[#F5F5F5] tw-mb-0 tw-text-sm">{bodyItem.TIPO_DOCUMENTO?.split('-')[1]?.trim()?.toUpperCase() || (<>&nbsp;</>)}:<>&nbsp;</></p>
                        <p className="tw-text-[#F5F5F5] tw-mb-0 tw-text-sm">{bodyItem.FOLIO_DOCUMENTO || (<>&nbsp;</>)}</p>
                    </div>
                    <div>
                        <p className="tw-text-[#F5F5F5] tw-mb-0 tw-font-medium tw-text-sm">{bodyItem.SERIE_DESCRIPCION || (<>&nbsp;</>)}</p>
                    </div>
                </div>
                <div className="tw-flex">
                    {!!bodyItem.NUMERO_UNICO && (
                        <>
                            <p className="tw-text-[#F5F5F5] tw-mb-0 tw-text-sm">N° UNICO:<>&nbsp;</></p>
                            <p className="tw-text-[#F5F5F5] tw-mb-0 tw-text-sm">{bodyItem.NUMERO_UNICO || (<>&nbsp;</>)}</p>
                        </>
                        )
                    }
                </div>
            </div>
        <ListGroup className="tw-w-full tw-border tw-border-yellow-500 tw-rounded-lg" >
            <ListGroup.Item className="tw-px-3 tw-py-1 tw-w-full tw-rounded-t-none" >
                <div className="tw-flex tw-justify-between">
                    <div>
                        <p className="tw-text-sm tw-font-medium tw-mb-0 tw-text-gray-700">Creado:</p>
                        <p className="tw-text-sm tw-my-0">{getCurrentDate_day(bodyItem.FECHA_CREACION) || (<>&nbsp;</>)}</p>
                    </div>
                    <div>
                        <p className="tw-text-sm tw-font-medium tw-my-0">Contable:</p>
                        <p className="tw-text-sm tw-my-0">{getCurrentDate_day(bodyItem.FECHA_CONTABILIZACION) || (<>&nbsp;</>)}</p>
                    </div>
                    <div>
                        <p className="tw-text-sm tw-font-medium tw-my-0">Vencimiento:</p>
                        <p className="tw-text-sm tw-my-0">{getCurrentDate_day(bodyItem.FECHA_VENCIMIENTO) || (<>&nbsp;</>)}</p>
                    </div>
                </div>
            </ListGroup.Item>
            <ListGroup.Item className="tw-w-full tw-py-1">
                <div className="tw-flex tw-justify-between">
                    <div className={!!bodyItem.TOTAL_DOCUMENTO_ME ? 'tw-visible' : 'tw-invisible'}>
                        <p className="tw-text-sm tw-font-medium tw-underline tw-my-0">Total (US$):</p>
                        <p className="tw-text-sm tw-my-0">{bodyItem.TOTAL_DOCUMENTO_ME.toLocaleString() || (<>&nbsp;</>)}</p>
                    </div>
                    <div>
                        <p className="tw-text-sm tw-font-medium tw-underline tw-my-0">Total (s/.):</p>
                        <p className="tw-text-sm tw-my-0">{bodyItem.TOTAL_DOCUMENTO_MN.toLocaleString() || (<>&nbsp;</>)}</p>
                    </div>
                    <div>
                        <p className="tw-text-sm tw-font-medium tw-underline tw-my-0">Saldo (s/.):</p>
                        <p className="tw-text-sm tw-font-medium tw-my-0 tw-bg-red-200 tw-w-fit">{bodyItem.SALDO_MN.toLocaleString() || (<>&nbsp;</>)}</p>
                    </div>
                </div>
            </ListGroup.Item>
        </ListGroup>
        </div>
      )
}


// {/* <div>
// <div className="card default animate tw-w-full tw-px-3 tw-pb-2 tw-pt-1 tw-rounded-b-none tw-bg-[#6C757D]">
//     <div className="tw-flex tw-justify-between">
//         {/* Se quita el codigo LT O 08 ANTES DEL - */}
//         <div className="tw-flex">
//             <p className="tw-text-[#F5F5F5] tw-mb-0 tw-text-sm">{bodyItem.TIPO_DOCUMENTO?.split('-')[1]?.trim()?.toUpperCase() || (<>&nbsp;</>)}:<>&nbsp;</></p>
//             <p className="tw-text-[#F5F5F5] tw-mb-0 tw-text-sm">{bodyItem.FOLIO_DOCUMENTO || (<>&nbsp;</>)}</p>
//         </div>
//         <div>
//             <p className="tw-text-[#F5F5F5] tw-mb-0 tw-font-medium tw-text-sm">{bodyItem.SERIE_DESCRIPCION || (<>&nbsp;</>)}</p>
//         </div>
//     </div>
//     <div className="tw-flex">
//         {!!bodyItem.NUMERO_UNICO && (
//             <>
//                 <p className="tw-text-[#F5F5F5] tw-mb-0 tw-text-sm">N° UNICO:<>&nbsp;</></p>
//                 <p className="tw-text-[#F5F5F5] tw-mb-0 tw-text-sm">{bodyItem.NUMERO_UNICO || (<>&nbsp;</>)}</p>
//             </>
//             )
//         }
//     </div>
// </div>
// <ListGroup className="tw-w-full tw-border tw-border-yellow-500 tw-rounded-lg" >
// <ListGroup.Item className="tw-px-3 tw-py-1 tw-w-full tw-rounded-t-none" >
//     <div className="tw-flex tw-justify-between">
//         <div>
//             <p className="tw-text-sm tw-font-medium tw-mb-0 tw-text-gray-700">Creado:</p>
//             <p className="tw-text-sm tw-my-0">{getCurrentDate_day(bodyItem.FECHA_CREACION) || (<>&nbsp;</>)}</p>
//         </div>
//         <div>
//             <p className="tw-text-sm tw-font-medium tw-my-0">Contable:</p>
//             <p className="tw-text-sm tw-my-0">{getCurrentDate_day(bodyItem.FECHA_CONTABILIZACION) || (<>&nbsp;</>)}</p>
//         </div>
//         <div>
//             <p className="tw-text-sm tw-font-medium tw-my-0">Vencimiento:</p>
//             <p className="tw-text-sm tw-my-0">{getCurrentDate_day(bodyItem.FECHA_VENCIMIENTO) || (<>&nbsp;</>)}</p>
//         </div>
//     </div>
// </ListGroup.Item>
// </ListGroup>
// </div> */}