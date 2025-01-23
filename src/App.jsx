// import { BrowserRouter, HashRouter } from "react-router-dom";
import { HashRouter } from "react-router-dom";
import { MiRutas } from './routers/rutas'
import { ComercialContext } from "./context/ComercialContext";
import NoAutorizado from "./componentes/modal/autorizacion";
import { pdfjs } from "react-pdf";
// import { useMediaQuery } from "usehooks-ts";

// import { PublicClientApplication } from "@azure/msal-browser";
// import { msalConfig } from "./authConfig";
// import { MsalProvider } from "@azure/msal-react";
// import './App.css'
// const msalInstance = new PublicClientApplication(msalConfig);
// {/* <MsalProvider instance={msalInstance}> */}
// {/* </MsalProvider> */}

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  // '//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.js',
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function App() {
  //condicion para que trabaje con responsive en el mobile
  // const matches = useMediaQuery('(max-width: 570px)')
  return (
    <>
      <HashRouter>
      {/* <BrowserRouter> */}
          <ComercialContext>
            <NoAutorizado/>
            <div className='page-content'>
              <MiRutas/>
            </div>
          </ComercialContext>
      </HashRouter>
    </>
  )
}
// {/* <div className="tw-flex tw-justify-center tw-items-center tw-h-screen tw-text-lg tw-font-bold">Hola Mundo</div> */}
export default App

// {matches && ( 
// // {/* <BrowserRouter basename="AppMobileCantol"> */}
// // {/* <HashRouter basename="AppMobileCantol"> */}
// <HashRouter>
// {/* <BrowserRouter> */}
//   {/* <MsalProvider instance={msalInstance}> */}
//     <ComercialContext>
//       <NoAutorizado/>
//       <div className='page-content'>
//         <MiRutas/>
//       </div>
//     </ComercialContext>
//   {/* </MsalProvider> */}
// </HashRouter>
// )}