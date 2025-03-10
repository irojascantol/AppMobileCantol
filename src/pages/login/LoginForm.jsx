import { useContext, useState } from "react";
import { commercialContext } from "../../context/ComercialContext";
import { MySelector } from "../../componentes/Selector";
import { Form, Button, Alert, Dropdown, InputGroup } from "react-bootstrap";
import { Login } from "../../services/login";
import { delay } from "../../utils/delay";
import { useNavigate } from "react-router-dom";
import { decodeJWT } from "../../utils/decode";
import { reverseString } from "../../utils/string";
// import { useMsal } from "@azure/msal-react";
import ReCAPTCHA from 'react-google-recaptcha';
import useRecaptcha from "../../hooks/useRecaptcha";
import meLogo from './assets/cantol_black.png';
// import {Button} from 'react-bootstrap/Button';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import 'C:/AppMobile/src/style/login.css'
// import { validarCaptcha } from "../../services/reCaptcha";

const LoginForm = () => {
  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [inputCompany,  setInputCompany] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { handleLogo, handleUser } = useContext(commercialContext);
  const { capchaToken, recaptchaRef, handleRecaptcha } = useRecaptcha();
  // const { instance, accounts } = useMsal();

  //inicia proceso de autenticacion
  const handleSubmit = async (event) => {
    event.preventDefault();
    //aqui se tiene validar catpcha con el backend, falta implementar
    // const response = await validarCaptcha(capchaToken)
    
    // let responseJson = undefined;
    let responseJson = true;

    setLoading(true);
    responseJson = await Login(inputUsername, inputPassword, inputCompany);
    await delay(200);
    // if(capchaToken && inputUsername && inputPassword && inputCompany){
    //   setLoading(false);
    // }

    if (responseJson !== undefined){
      if (!responseJson.detail) {
        sessionStorage.setItem("CDTToken", responseJson);
        const {username} = await decodeJWT();
        sessionStorage.setItem("USR", reverseString(username));
        handleUser(username)
        handleLogo(inputCompany)
        setShow(false);
        navigate('/main/home')
      } else {
        setShow(true);
      }
    }
  };

  const handlePassword = async () => {alert("Contactar con TI Cantol")};

  return (
    <div
      className="sign-in__wrapper tw-bg-gray-100 tw-flex tw-items-center tw-h-screen"
    >
      {/* Overlay */}
      <div className="sign-in__backdrop tw-bg-gray-100 tw-h-screen"></div>
      {/* Form */}
      <Form className="shadow p-4 bg-white rounded" onSubmit={handleSubmit}>
        {/* Header */}
        {/* Comienza logo */}
        <div className="tw-bg-yellow-300 tw-mx-auto tw-w-[200px] tw-h-fit tw-rounded-xl">
            <img
            className="tw-w-fit tw-h-fit"
            src={meLogo}
            alt="logo"
            />
        </div>
        {/* Termina logo */}

        <div className="h4 my-3 text-center">OMS</div>
        {/* Empieza aviso contraseña o clave incorrecta */}
        {show ? (
          <Alert
            className="mb-2"
            variant="danger"
            onClose={() => setShow(false)}
            dismissible
          >
            Usuario o contraseña incorrecta
          </Alert>
        ) : (
          <div />
        )}

        {/* Empieza combo empresa */}
        <div className="tw-my-3 tw-w-full">
          <MySelector width={'w-100'} initText={'Empresa'} setInputCompany={setInputCompany}/>
        </div>
        {/* Termina combo empresa */}

        {/* Termina aviso contraseña o clave incorrecta */}
        <Form.Group className="mb-2" controlId="username">
          <Form.Label>Usuario</Form.Label>
          <Form.Control
            type="text"
            value={inputUsername}
            placeholder="Usuario"
            onChange={(e) => setInputUsername(e.target.value.toUpperCase())}
            required
          />
        </Form.Group>

        <Form.Group className="mb-2" controlId="password">
          <Form.Label>Contraseña</Form.Label>
          <InputGroup className="mb-3">
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              value={inputPassword}
              placeholder="Contraseña"
              onChange={(e) => setInputPassword(e.target.value)}
              required
            />
            <Button variant="outline-secondary" id="button-addon2" onClick={()=>setShowPassword(!showPassword)}>
              <div className="password-toggle-icon" >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </Button>
          </InputGroup>
        </Form.Group>

        <div className="tw-flex tw-justify-center tw-mt-3">
          <ReCAPTCHA
          ref={recaptchaRef}
          sitekey="6Lfiy1MqAAAAAHcepIzS3inu4JEisDbyKWfaXuDp"
          onChange={handleRecaptcha}
          />
        </div>
        {!loading ? (
          // <Button className="w-100 tw-mt-3" variant="dark" type="submit" disabled={!capchaToken}>
            <Button className="w-100 tw-mt-3" variant="dark" type="submit">
            <span className="tw-text-sm">INGRESAR</span>
          </Button>
        ) : (
          // <Button className="w-100 tw-mt-3" variant="dark" type="submit" disabled={!capchaToken}>
            <Button className="w-100 tw-mt-3" variant="dark" type="submit" disabled={false}>
              <span className="tw-text-sm">INGRESANDO....</span>
          </Button>
        )}
        <div className="d-grid justify-content-end">
          <Button
            className="text-muted px-0 tw-mt-2"
            variant="link"
            onClick={handlePassword}
          >
            Olvidaste la contraseña?
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default LoginForm;