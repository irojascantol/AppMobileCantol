
import '../../style/globales.css'

export function InputNumberSpinner({value, min, max, disabled, onChange}){
    return (
        <div className='tw-min-w-[75px]'>
            <span className="input-number-decrement" onClick={()=>{(min+1)<value && onChange('down')}}>–</span>
                <input className="input-number" type="text" value={value} min={min} max={max} disabled={disabled} readOnly={true}/>
            <span className="input-number-increment" onClick={()=>{max>value && onChange('up')}}>+</span>
        </div>
    )
}