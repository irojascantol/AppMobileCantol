import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { commercialContext } from '../../../context/ComercialContext';
import { useContext } from 'react';

export default function MyTabPedido({components = []}) {
  const {tabActivePedido, handleTabPedido} = useContext(commercialContext);

  return (
    <Tabs
    defaultActiveKey={tabActivePedido}
    activeKey={tabActivePedido}
    onSelect={(tab)=>handleTabPedido(tab)}
    id="uncontrolled-tab-example"
    className="mb-3"
  >
        <Tab eventKey="general" title="General">
            {components[0]}
        </Tab>
        <Tab eventKey="contenido" title="Contenido">
            {components[1]}
        </Tab>
        <Tab eventKey="logistica" title="Logistica">
            {components[2]}
        </Tab>
        <Tab eventKey="finanzas" title="Finanzas">
            {components[3]}
        </Tab>
    </Tabs>
  )
}

// {/* <Tab eventKey="contact" title="Contact" disabled>
// Tab content for Contact
// </Tab> */}
