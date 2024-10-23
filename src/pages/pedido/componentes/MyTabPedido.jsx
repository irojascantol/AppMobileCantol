import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
// import { Tab, Nav, Tabs } from 'react-bootstrap';
// import { Route, Routes, Link, useLocation } from 'react-router-dom';
import { commercialContext } from '../../../context/ComercialContext';
import { useContext } from 'react';

// const handleKeyDown = (event) => {
//   // Disable arrow key navigation
//   if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
//     event.preventDefault();
//   }
// };

export default function MyTabPedido({components = []}) {
  const {tabActivePedido, handleTabPedido} = useContext(commercialContext);
  // const location = useLocation();
  // const parts = location.pathname.split('/')
  // const lastElement = parts[parts.length - 1]
  
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