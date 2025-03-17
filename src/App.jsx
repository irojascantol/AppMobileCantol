// import { BrowserRouter, HashRouter } from "react-router-dom";
import { HashRouter } from "react-router-dom";
import { MiRutas } from './routers/rutas'
import { ComercialContext } from "./context/ComercialContext";
import { pdfjs } from "react-pdf";
import NoAutorizado from "./componentes/modal/autorizacion";
import { SnackbarProvider } from 'notistack';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function App() {
  return (
    <>
      <HashRouter>
          <ComercialContext>
          <SnackbarProvider maxSnack={1}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}>
            <NoAutorizado/>
            <div className='page-content'>
              <MiRutas/>
            </div>
          </SnackbarProvider>
          </ComercialContext>
      </HashRouter>
    </>
  )
}
export default App