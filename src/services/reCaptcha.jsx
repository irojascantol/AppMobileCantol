import axios from "axios";

//este codigo debe ejecutarse desde el backend, temporal por aqui
async function validarCaptcha(token) {
    // secret : '',
    // const params = {
    //     secret : '',
    //     response : token,
    // }

    const params = {
        key : '',
    }

    const bodyData =  {
        "event": {
          "token": token,
          "siteKey": "6Lfiy1MqAAAAAHcepIzS3inu4JEisDbyKWfaXuDp",
        }
      }

    // add params to post axios method as object?

    try{
        // const reCaptchaResponse = await axios.post('https://www.google.com/recaptcha/api/siteverify', 
        const reCaptchaResponse = await axios.post('https://recaptchaenterprise.googleapis.com/v1/projects/cantol-ventas-1727703185825/assessments', bodyData, {
            params: params
        });
        //config post method axios with access control allow origin?
        console.log(response)
        console.log(response.data)
        if (reCaptchaResponse.data.success){
            return true;
        }else
        {
            return null;
        }
    }catch(error){
        console.log(`An Error ocurred: (validarCaptcha) _ ${error}`);
        return null;
    }
}

export { validarCaptcha }