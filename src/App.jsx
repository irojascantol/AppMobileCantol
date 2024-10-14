import { BrowserRouter } from "react-router-dom";
import { MiRutas } from './routers/rutas'
import { ComercialContext } from "./context/ComercialContext";
import NoAutorizado from "./componentes/modal/autorizacion";
import { msalConfig } from "./authConfig";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";

// import './App.css'

const msalInstance = new PublicClientApplication(msalConfig);

function App() {
  return (
    <>
      <BrowserRouter basename="comercial">
        <MsalProvider instance={msalInstance}>
          <ComercialContext>
            <NoAutorizado/>
            <div className='page-content'>
              <MiRutas/>
            </div>
          </ComercialContext>
        </MsalProvider>
      </BrowserRouter>
    </>
  )
}
export default App
