import {getCharacters} from "./shared/api";
import {QueryClient, QueryClientProvider, useQuery} from "@tanstack/react-query";
import {useState} from "react";

const queryClient = new QueryClient()


function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Characters/>
        </QueryClientProvider>


    )
}

function Characters() {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const {isPending, error, data} = useQuery({
        queryKey: ['charactersData'],
        queryFn: () => getCharacters()
    })
    if (isPending) return 'Loading'
    if (error) return 'Error' + error.message

    const modalContent = {title: 'Заголовок'}

    const characters = data?.results.map(character =>
        <li onClick={() => setIsModalOpen(true)} className="hover:shadow-2xl transition-all ease-in-out duration-200 cursor-pointer rounded-2xl shadow-md overflow-hidden pb-8 flex flex-col gap-y-4"
            key={character.id}>
            <img src={character.image} alt={character.name}/>
            <span className="ps-3 font-raleway leading-3 text-green-700 text-md font-bold">{character.name}</span>
        </li>
    )

    return (
        <div className="flex justify-center flex-col items-center pt-12">
            <h1 className="pt-6 mb-12 font-raleway leading-3 text-green-900 text-5xl font-extrabold">Characters</h1>
            <div className="grid grid-flow-col gap-6">
                <div className="row-span-3 w-72 border-2 h-96">Фильтры</div>
                <div className="col-span-2 h-12 border-2 p-2">Поиск</div>
                <ul className="grid grid-cols-3 gap-x-6 gap-y-12 w-fit m-auto row-span-2 col-span-2">{characters}</ul>
            </div>
            {isModalOpen && <Modal modalContent={modalContent}/>}
        </div>
    )

}

function Modal ({modalContent}: {modalContent: {title: string}}) {
    return (
        <div className="fixed w-96 h-96 bg-amber-200 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <span>{modalContent.title}</span>
        </div>
    )
}

export default App
