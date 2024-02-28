export function DropdownComponent({options, oninput, label, value}: {
    options: string[],
    oninput: (inputValue: string) => void,
    label: string,
    value: string
}) {
    return (
        <label className='flex-col flex gap-y-1.5 sm:w-96 w-72 2xl:w-full'>
            <span className='font-raleway text-green-800 font-bold'>{label}</span>
            <select className="focus:outline-none w-full font-raleway h-12 border-2 p-2 rounded-md" onChange={(e) => {
                oninput(e.target.value)
            }}
            value={value}
            >
                <option value="">any</option>
                {options.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
        </label>
    )
}
