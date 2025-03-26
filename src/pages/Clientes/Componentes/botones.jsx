

export function SearchClientButton({onClick, disabled = false}){
    return (
            <button className='button-14 tw-w-full tw-h-10 tw-my-0 tw-px-10 tw-font-sans tw-font-medium' onClick={onClick} disabled={disabled}>
                Buscar cliente
            </button>
        );
}