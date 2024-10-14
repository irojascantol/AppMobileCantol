import React from "react";
import { Typography, Button } from "@material-tailwind/react";
import { FlagIcon } from "@heroicons/react/24/solid";

function NotFound() {
  return (
      <div className="tw-h-fit tw-mx-auto tw-grid tw-place-items-center tw-text-center tw-px-8 tw-mt-32">
        <div>
          <FlagIcon className="tw-w-20 tw-h-20 tw-mx-auto" />
          <Typography
            variant="h1"
            color="blue-gray"
            className="tw-mt-10 !tw-text-3xl !tw-leading-snug tw-md:!tw-text-4xl"
          >
            Error 404 <br /> Pagina no encontrada.
          </Typography>
          <Typography className="tw-mt-8 tw-mb-14 tw-text-[18px] tw-font-normal tw-text-gray-500 tw-mx-auto md:tw-max-w-sm">
            No se preocupe, se encuentra en una direccion que no existe. Por favor, redirijase a una ruta valida.
          </Typography>
        </div>
      </div>
  );
}

export { NotFound };