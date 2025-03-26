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

/**
 * Selector mejor conocido como combate
 */
function Combate({value, options, onChange, cmb_name, size='lg'}) {
  return (
    <Form.Select onChange={onChange} name={cmb_name} value={value.toString()} size={size} required className='tw-bg-gray-100 tw-text-base tw-font-semibold'>
      {
        options.map((option, index) => (<option key={index} value={option?.id?.toString()} disabled={index === 0}>{option?.text}</option>))
      }
    </Form.Select>
  );
}

//catch event when form.select react bootstrap?
export { MySelector, Combate }

