import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {SetStateAction, useState} from "react";
import {localStorageSaver, withDefault} from "./shared/helpers";
import {Locations, Episodes, Characters} from "./pages";

const queryClient = new QueryClient()

function App() {
    const [value, setValue] = useState(withDefault('mainChoice', 'Characters'));

    const changeValue = (e: { target: { value: SetStateAction<string> } }) => {
        setValue(e.target.value)
    }

    localStorageSaver.set('mainChoice', value)
    return (
        <QueryClientProvider client={queryClient}>
            <div className="flex flex-col gap-y-8 pt-4 m-auto">
                <div className="flex sm:flex-row flex-col justify-center border-2 xl:w-[64rem] w-4/5 m-auto bg-gray-50 text-xl h-fit p-3 gap-x-12 mb-4">
                    <label className="flex flex-row gap-x-2">
                        <input className="accent-yellow-100 w-3" type="radio" value="Characters"
                               checked={value === 'Characters'}
                               onChange={changeValue}/>
                        <span className="font-raleway text-green-900 font-bold">Characters</span>
                    </label>
                    <label className="flex flex-row gap-x-2">
                        <input className="accent-yellow-100 w-3" type="radio" value="Locations"
                               checked={value === 'Locations'}
                               onChange={changeValue}/>
                        <span className="font-raleway text-green-900 font-bold">Locations</span>
                    </label>
                    <label className="flex flex-row gap-x-2">
                        <input className="accent-yellow-100 w-3" type="radio" value="Episodes"
                               checked={value === 'Episodes'}
                               onChange={changeValue}/>
                        <span className="font-raleway text-green-900 font-bold">Episodes</span>
                    </label>
                </div>
                <h1 className="font-raleway text-green-900 sm:text-5xl text-4xl font-extrabold m-auto">{value}</h1>
                {value === 'Characters' && <Characters/>}
                {value === 'Locations' && <Locations/>}
                {value === 'Episodes' && <Episodes/>}
            </div>
        </QueryClientProvider>
    )
}

export default App
