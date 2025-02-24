import React, { useMemo } from 'react'
import Badge from 'react-bootstrap/Badge';
import { getHumanDateFormat, getHumanDateReporte } from '../../../utils/humandateformat';
import { ListGroup } from 'react-bootstrap'
import { BsBootstrap, BsTruck } from 'react-icons/bs';

function Pendiente({item}) {
  return (
    <ListGroup.Item
    as="li"
    className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1"
    >
      <div className="ms-2 me-auto">
        <div className="tw-font-semibold">{item.CardName}</div>
        <div className='text-secondary tw-text-md'>RUC: {item.LicTradNum}</div>
      </div>
      <div className='tw-h-12 tw-flex tw-flex-col tw-justify-between'>
        <Badge bg="secondary" pill>
          S/.{item.DocTotal.toLocaleString()}
        </Badge>
        <div className='text-secondary'>{getHumanDateReporte(item.DocDueDate)}</div>
      </div>
    </ListGroup.Item>
  )
}

function Aprobado({item}) {
  return (
    <ListGroup.Item
    as="li"
    className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1"
    >
      <div className="ms-2 me-auto">
        <div className="tw-font-semibold">{item.CardName}</div>
        <div className='text-secondary tw-text-md'>RUC: {item.LicTradNum}</div>
      </div>
      <div className='tw-h-12 tw-flex tw-flex-col tw-justify-between'>
        <Badge bg="secondary" pill>
        S/.{item.DocTotal.toLocaleString()}
        </Badge>
        <div className='text-secondary'>{getHumanDateReporte(item.DocDueDate)}</div>
      </div>
    </ListGroup.Item>
  )
}

function Rechazado({item}) {
  return (
    <ListGroup.Item
    as="li"
    className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1"
    >
      <div className="ms-2 me-auto">
        <div className="tw-font-semibold">{item.CardName}</div>
        <div className='text-secondary tw-text-md'>RUC: {item.LicTradNum}</div>
      </div>
      <div className='tw-h-12 tw-flex tw-flex-col tw-justify-between'>
        <Badge bg="secondary" pill>
          S/.{item.DocTotal.toLocaleString()}
        </Badge>
        <div className='text-secondary'>{getHumanDateReporte(item.DocDueDate)}</div>
      </div>
    </ListGroup.Item>
  )
}

function Facturado({item}) {
  const pending = useMemo(()=>(<div className='tw-inline-block tw-w-3 tw-h-3 tw-ml-1 tw-bg-yellow-400 tw-relative'><BsTruck color='black' className='tw-absolute tw-bottom-[-4px]'/></div>))
  
  return (
    <ListGroup.Item
    as="li"
    className="d-flex justify-content-between align-items-start active:tw-border-yellow-400 tw-pl-1"
    >
      <div className="ms-2 me-auto">
        <div className="tw-font-semibold">{item.CardName}</div>
        <div className='text-secondary tw-text-md'>RUC: {item.LicTradNum} {!!item?.Status && (pending)}</div>
      </div>
      <div className='tw-h-12 tw-flex tw-flex-col tw-justify-between'>
        <Badge bg="secondary" pill>
          S/.{item.DocTotal.toLocaleString()}
        </Badge>
        <div className='text-secondary'>{getHumanDateReporte(item.DocDueDate)}</div>
      </div>
    </ListGroup.Item>
  )
}

function PendienteChofer({item}) {

// const pending = useMemo(()=>(<div className='tw-inline-block tw-w-2 tw-h-2 tw-rounded tw-rounded-full tw-bg-yellow-400 tw-ml-1'/>))
// const completed = useMemo(()=>(<div className='tw-inline-block tw-w-2 tw-h-2 tw-rounded tw-rounded-full tw-bg-green-600 tw-ml-1'/>))
const pending = useMemo(()=>(<div className='tw-inline-block tw-w-3 tw-h-3 tw-ml-1 tw-bg-yellow-400 tw-relative'><BsTruck color='black' className='tw-absolute tw-bottom-[-4px]'/></div>))
// const completed = useMemo(()=>(<div className='tw-inline-block tw-w-2 tw-h-2  tw-ml-1'><BsTruck color='black'/></div>))

return (
    <ListGroup.Item
    as="li"
    className="active:tw-border-yellow-400 tw-pl-1"
    >
      <div
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400"
      >
      <div className="ms-2 me-auto">
        {/* <div className="tw-font-semibold">{item.razon_social}{Number(item?.estado)?pending:completed}</div> */}
        <div className="tw-font-semibold">{item.razon_social}{pending}</div>
        <div className='text-secondary tw-text-md'>RUC: {item.ruc}</div>
      </div>
      <div className='tw-h-12 tw-flex tw-flex-col tw-justify-between tw-gap-0'>
        <div className='text-secondary'>{getHumanDateFormat(item.fecha_entrega)}</div>
        <div className='text-secondary tw-text-md tw-font-light'>{item.numero_guia}</div>
      </div>
      </div>
      <div className='text-secondary tw-text-md tw-pl-2'>Dirección: 
      <span className='tw-text-sm'> {item.direccion_entrega}</span></div>
    </ListGroup.Item>
  )
}

function CompletoChofer({item}) {
  return (
    <ListGroup.Item
    as="li"
    className="active:tw-border-yellow-400 tw-pl-1"
    >
      <div
        className="d-flex justify-content-between align-items-start active:tw-border-yellow-400"
      >
      <div className="ms-2 me-auto">
        <div className="tw-font-semibold">{item.razon_social}</div>
        <div className='text-secondary tw-text-md'>RUC: {item.ruc}</div>
      </div>
      <div className='tw-h-12 tw-flex tw-flex-col tw-justify-between tw-gap-0'>
        <div className='text-secondary'>{getHumanDateFormat(item.fecha_entrega)}</div>
        <div className='text-secondary tw-text-md tw-font-light'>{item.numero_guia}</div>
      </div>
      </div>
      <div className='text-secondary tw-text-md tw-pl-2'>Dirección: 
      <span className='tw-text-sm'> {item.direccion_entrega}</span></div>
    </ListGroup.Item>
  )
}

function Contenido_Articulos({item}) {
  return (
    <ListGroup.Item
        as="li"
        className="tw-grid tw-grid-cols-7 tw-px-1 tw-mb-1 tw-border-t-2 tw-relative"
        variant="no style"
      >
        <div className="ms-2 me-auto tw-col-span-5 tw-flex tw-flex-col tw-justify-between tw-gap-1">
          <div>
            <div className="tw-font-normal text-dark">Descripción:</div>
            <div className='text-secondary tw-text-xs'>{item?.descripcion || 'No precisa'}</div>
          </div>
          <div>
            <div className="tw-font-normal text-dark">Precio:</div>
            <div className='text-secondary tw-text-md'>S/.{item?.precio_unitario || 'No precisa'}</div>
          </div>
        </div>

        {/* <div className="ms-2 me-auto tw-col-span-2 tw-flex tw-flex-col tw-items-end tw-justify-end"> */}
        <div className="ms-2 me-auto tw-col-span-2 tw-flex tw-justify-end">
          <div>
          <div className='tw-flex tw-flex-col tw-items-end'>
            <div className="tw-font-normal text-dark">Cantidad:</div>
            <div className='text-secondary tw-text-md'>{item?.cantidad || 'NO PRECISA'}</div>
          </div>
          <div className='tw-flex tw-flex-col tw-items-end'>
            <div className="tw-font-normal text-dark">Precio Total:</div>
            <div className='text-secondary tw-text-md'>S/.{item?.total_linea || '0'}</div>
          </div>
          </div>
        </div>

        {/* esperar este elemento */}
        <div className={`tw-absolute button-4 tw-right-[0px] tw-bottom-[0px] tw-px-0 tw-py-0 tw-bg-yellow-400 tw-text-black item-delete ${item?.bonificacion === 'Y' ? 'tw-visible tw-opacity-100': 'tw-invisible tw-opacity-0'}`}>
          <BsBootstrap size={20}/>
        </div>
      </ListGroup.Item>
  )
}

export { Pendiente, Aprobado, Rechazado, Facturado, Contenido_Articulos, PendienteChofer, CompletoChofer}

//CREATE BUTTON REACT jsx?
