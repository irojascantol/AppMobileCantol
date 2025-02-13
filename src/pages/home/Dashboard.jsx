import React from 'react'
import fondo_principal from '../../componentes/navegacion/assets/landing_img.jpg'
import { useMediaQuery } from "usehooks-ts";

function Dashboard() {
  const background_mobile = useMediaQuery('(max-width: 780px)')
  return (
        <>
          {background_mobile ? (
            <div className="tw-h-fit tw-w-screen tw-rounded-none tw-mt-0">
                <img
                className="tw-w-full tw-rounded-none"
                src={fondo_principal}
                alt="oms_fondo"
                />
            </div>
          ):
          (
            <div className='tw-h-svh tw-flex tw-justify-center tw-pt-60'>
                <h1>Bienvenido al OMS</h1>
            </div>
          )
        }
      </>
  )
}

export {Dashboard}
