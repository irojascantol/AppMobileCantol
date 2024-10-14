import React from 'react';
import Form  from 'react-bootstrap/Form';
import '../style/NavBar1.css'

function MySelector({initText, setInputCompany}) {
  return (
    <Form.Select aria-label="Default select example" onChange={(event)=>{setInputCompany(event.target.value)}} required>
      <option>{initText}</option>
      <option value="CNT">Cantol</option>
      <option value="TCN">Tecnopress</option>
      <option value="DTM">Distrimax</option>
    </Form.Select>
  );
}
//catch event when form.select react bootstrap?
export { MySelector }

