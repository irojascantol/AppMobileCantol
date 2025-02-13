import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { Checkbox, FormControl, FormControlLabel, ListItemIcon, Radio, RadioGroup } from '@mui/material';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { generarDiscountNv1List } from '../utils';
import Divider from '@mui/material/Divider';
import lgoLogo from '../../login/assets/lgo.png';


function DiscountOvDialog(props) {
  const { handleShowDsctDialog, open, dsctObj, handleDescuento} = props;
  const [dsctFormato, setDsctFormato] = useState({...dsctObj});

  /**
   * handle dsct format
   */
  const handleDsctFormat = (obj) => setDsctFormato({...dsctFormato, ...obj})

  /**
   * Controla que salida sea sin clickear backdrop
   */
  const handleClose = (event, reason) => {
    if (reason && reason === "backdropClick")
      return;
    // Evitar cierre al presionar "Esc"
    if (event && event.key === 'Escape') return;
    handleShowDsctDialog({show:false, accepted: false});
  };

  /**
   * Zona de handlers
   */
  const handleAccept = () => {
    handleDescuento({...dsctFormato});
    handleShowDsctDialog({show: false, accepted: true});
    }

  const handlePromociones = (value) => {
    handleDsctFormat({promociones: {enabled: !value}})
  }
  
  const handleFormaPago = (value_) => {
    handleDsctFormat({dsctDoc: {dsct1: {...dsctFormato.dsctDoc.dsct1}, dsctFP: {value: dsctFormato.dsctDoc.dsctFP.value, enabled: !value_}}})
  }

  const handleDsctCategoria = (event) =>{
    handleDsctFormat({
        dsctDoc: {dsct1: {
        selected: (event.target.value).toString(), 
        min: dsctFormato.dsctDoc.dsct1.min, 
        max: dsctFormato.dsctDoc.dsct1.max,
        default: dsctFormato.dsctDoc.dsct1.default,
        catName: dsctFormato.dsctDoc.dsct1.catName,
      }, 
        dsctFP: {...dsctFormato.dsctDoc.dsctFP}}
      })
  }

  /**
   * Primer render
   */
  useEffect(() => {
    if(open.show)
      setDsctFormato({...dsctObj}) // condicion inicial, copia obj dsctuento
      handleShowDsctDialog({accepted: false}) // condicion inicial accepted: false
    }, [open.show]);

  return (
    <Dialog onClose={handleClose} open={open.show} >
      {
        //evalua que dsct min y maximo sean diferentes, en caso sea min y max 0.0 no muestra opcion de dsct categoria cliente
        !(dsctFormato?.dsctDoc?.dsct1?.min === dsctFormato?.dsctDoc?.dsct1?.max) && (
          <>
            <DialogTitle className='tw-pt-2 tw-pb-0 tw-px-5 tw-text-center'>Dsct. Categoria cliente</DialogTitle>
            <FormControl className='tw-h-48 tw-overflow-y-scroll'>
            <RadioGroup 
              value={dsctFormato?.dsctDoc?.dsct1?.selected}
              onChange={handleDsctCategoria}
            >
              {
                generarDiscountNv1List(
                { minVal:dsctFormato.dsctDoc.dsct1.min, 
                  maxVal:dsctFormato.dsctDoc.dsct1.max, 
                  step:0.5, 
                  minIgnore:13.0, 
                  maxIgnore:15.0, 
                  threshold:dsctFormato.dsctDoc.dsct1.default
                }).map(([value, color], idx)=>(
                  <>
                  <FormControlLabel key={(idx+10).toString()} value={value.toString()} control={<Radio />} label={
                    <div className={`tw-w-[103px] tw-flex tw-justify-${value >= 15.5 ? 'between': 'center'} tw-items-center`}>
                      { value >= 15.5 ? (
                        <img
                          className="tw-w-7"
                          src={lgoLogo}
                          alt="logo" // agrega el logo de la marca LGO
                        />
                      ) : (<p>&nbsp;</p>)
                      }
                      <div className='tw-text-sm tw-font-bold'>
                        {
                          `${value === 0.0 ? 'Sin descuento' : value.toFixed(2).toString() + '%'}`
                        }
                      </div>
                    </div>
                  }sx={{  display: 'flex', flexDirection: 'row-reverse', justifyContent: 'space-between', 
                          paddingLeft: '35px', paddingRight: '25px', marginRight: '0px', backgroundColor: `${color ? 'rgb(255,186,186)' : 'rgb(255,255,255)'}`}} />
                  </>
                )
                )
              }
            </RadioGroup>
            </FormControl>
          </>
        )
      }

      {
        !!dsctFormato?.dsctDoc?.dsctFP?.value && (
          <>
            <Divider sx={{ borderBottomWidth: 3, borderColor: 'gray' }}/>
            <DialogTitle className='tw-pt-1 tw-pb-0 tw-text-center'>Dsct. Forma de pago</DialogTitle>
            <List sx={{ pt: 0 }}>
            {[dsctFormato.dsctDoc.dsctFP.value].map((value, idx) => {
              const labelId = `checkbox-list-label-${value}`;
              return (
                  <ListItem
                    key={(idx+20).toString()}
                    disablePadding
                  >
                    <ListItemButton role={undefined} 
                    onClick={()=>handleFormaPago(dsctFormato.dsctDoc.dsctFP.enabled)}
                    className='tw-py-0 tw-my-0 tw-h-8'>
                      <ListItemText className='tw-ml-9' primary={`${value} %`} sx={{fontSize: '25px'}} />
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={dsctFormato.dsctDoc.dsctFP.enabled}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </ListItemIcon>
                    </ListItemButton>
                  </ListItem>
              );
            })}
            </List>
          </>
        )
      }

      <Divider sx={{ borderBottomWidth: 3, borderColor: 'gray' }}/>
      <DialogTitle className='tw-pt-1 tw-pb-0 tw-text-center'>Promociones</DialogTitle>
      <List sx={{ pt: 0 }}>
        <ListItem className='tw-py-0'>
            <ListItemButton 
              role={undefined} 
              onClick={()=>handlePromociones(dsctFormato?.promociones?.enabled)}
              className='tw-flex tw-justify-between tw-my-0 tw-py-0 tw-h-8 tw-px-3'>
              <ListItemText className='tw-ml-3'id={'checkbox-list-label-Activar'} primary={'Activar'} />
              <ListItemIcon className='tw-pr-0'>
                <Checkbox
                  edge="end"
                  checked={dsctFormato?.promociones?.enabled}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': 'checkbox-list-label-Activar' }}
                />
              </ListItemIcon>
            </ListItemButton>
        </ListItem>
      </List>
      <ButtonGroup variant="contained" aria-label="Basic button group" fullWidth >
        <button className='button-4 tw-w-1/2 tw-bg-red-300 tw-mr-1' onClick={handleClose}>
                    <span>Cancelar</span>
        </button>
        <button className='button-4 tw-w-1/2 tw-bg-green-300 tw-ml-1' onClick={(handleAccept)}>
                    <span>Aplicar</span>
        </button>
      </ButtonGroup>
    </Dialog>
  );
}

export {DiscountOvDialog}
