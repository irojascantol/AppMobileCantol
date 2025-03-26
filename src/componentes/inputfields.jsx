import React from 'react'
import { Form, InputGroup } from 'react-bootstrap'
import { BsSearch } from 'react-icons/bs'

function InputField_lIcon({searchValue, setSearchValue, placeholder = 'Ingrese razón social o número de guía'}) {
  return (
    <div>
        {/* <InputGroup className="mb-3" size='md'> */}
        <InputGroup size='md'>
            <Form.Control
                placeholder={placeholder}
                aria-label="field1"
                aria-describedby="basic-addon1"
                value={searchValue}
                onChange={setSearchValue}
            />
            <InputGroup.Text id="basic-addon1">
                <BsSearch />
            </InputGroup.Text>
        </InputGroup>
    </div>
  )
}

export {InputField_lIcon}
