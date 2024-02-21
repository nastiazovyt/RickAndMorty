import {getCharacters} from "./shared/api";
import {QueryClient, QueryClientProvider, useQuery} from "@tanstack/react-query";

const queryClient = new QueryClient()


function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Characters/>
        </QueryClientProvider>


    )
}

function Characters() {
    const {isPending, error, data} = useQuery({
        queryKey: ['charactersData'],
        queryFn: () => getCharacters()
    })

    if (isPending) return 'Loading'
    if (error) return 'Error' + error.message

    const characters = data?.results.map(character =>
        <li key={character.id}>
            <img src={character.image} alt={character.name}/>
            <span>{character.name}</span>
        </li>
    )


    return (
        <div className="flex justify-center flex-col items-center">
            <h1 className="pt-6 mb-12 font-raleway leading-3 text-green-900 text-5xl font-extrabold">Characters</h1>
            <ul className="grid grid-cols-3 gap-6 w-fit m-auto">{characters}</ul>
        </div>
    )
}

export default App
