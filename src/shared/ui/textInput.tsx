export function TextInputComponent({onInput, inputValue, placeholder, label}: {
    onInput: (inputValue: string) => void,
    inputValue: string,
    placeholder: string,
    label: string
}) {
    return (
        <label className='flex-col flex gap-y-1.5'>
            <span className='font-raleway text-green-800 font-bold'>{label}</span>
            <input className="focus:outline-none w-full font-raleway h-12 border-2 p-2 rounded-md" type="search"
                   placeholder={placeholder}
                   value={inputValue} onChange={(e) => {
                onInput(e.target.value);
            }}/>
        </label>
    )
}
