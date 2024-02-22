import {Character, getCharacters, ResultType} from "./shared/api";
import {QueryClient, QueryClientProvider, useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {useEffect, useRef, useState} from "react";
import {useClickAway} from "react-use";
import {list} from "postcss";

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
    const [activeCharacter, setActiveCharacter] = useState<ResultType>()
    const [searchResult, setSearchResult] = useState('')


    const fetchData = async ({pageParam}: { pageParam: number }) => {
        return getCharacters(pageParam)
    }

    const {data, status, error, fetchNextPage} = useInfiniteQuery({
        queryKey: ['charactersData'],
        queryFn: fetchData,
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return allPages.length + 1
        }
    })

    const characters = data?.pages.map((characters: Character) => {
        return characters.results.map(character =>
            <li onClick={() => {
                setIsModalOpen(true);
                setActiveCharacter(character)
            }}
                className="hover:shadow-2xl transition-all ease-in-out duration-200 cursor-pointer rounded-2xl shadow-md overflow-hidden pb-8 flex flex-col gap-y-4"
                key={character.id}>
                <img src={character.image} alt={character.name}/>
                <span className="ps-3 font-raleway leading-5 text-green-700 text-md font-bold">{character.name}</span>
            </li>
        )
    })

    if (status === 'pending') {
        return <p>Loading</p>
    }
    if (status === 'error') {
        return <p>{error.message}</p>
    }


    const handleNameChange = (searchResult) => {
        setSearchResult(searchResult)
    }

    return (
        <div className="flex justify-center flex-col items-center pt-12">
            <h1 className="pt-6 mb-12 font-raleway leading-3 text-green-900 text-5xl font-extrabold">Characters</h1>
            <div className="grid grid-flow-col gap-6">
                <div className="row-span-3 w-72 border-2 h-96">Фильтры</div>
                <SearchBox onChange={handleNameChange}/>
                <span>{searchResult}</span>
                <ul className="grid grid-cols-3 gap-x-6 gap-y-12 w-fit m-auto row-span-2 col-span-2 mb-6">{characters}</ul>
            </div>
            <button onClick={() => fetchNextPage()}>Load more</button>
            {isModalOpen && activeCharacter && <Modal modalCloser={setIsModalOpen} modalContent={activeCharacter}/>}
        </div>
    )
}

function Modal({modalContent, modalCloser}: { modalContent: ResultType; modalCloser: (arg: boolean) => void }) {
    const modalRef = useRef(null)
    useClickAway(modalRef, () => {
        modalCloser(false)
    })


    return (
        <div className="fixed h-dvh w-dvw top-0 left-0 z-20 font-raleway">
            <div className="flex justify-center items-center h-full bg-[#00000033]">
                <div ref={modalRef} className="p-12 w-[56rem] h-[50rem] bg-white rounded-2xl shadow-2xl">
                    <div className="grid grid-rows-2 grid-cols-2 gap-x-12 gap-y-16">
                        <img className="rounded-2xl w-[24rem] h-[24rem]" src={modalContent.image}
                             alt={modalContent.name}/>
                        <div className="flex-col flex border-2 border-green-950 p-6 w-96">
                            <span
                                className="text-4xl font-bold text-green-950 mb-1.5 underline">{modalContent.name}</span>
                            <span className="mb-12 text-md">{modalContent.status}</span>
                            <ul className="flex text-lg flex-col mt-auto leading-6">
                                {
                                    modalContent.type &&
                                    <li className="flex gap-x-3">
                                        <span className="text-green-900 font-bold">type:</span>
                                        <span>{modalContent.type}</span>
                                    </li>
                                }
                                <li className="flex gap-x-3">
                                    <span className="text-green-900 font-bold">gender:</span>
                                    <span>{modalContent.gender}</span>
                                </li>
                                <li className="flex gap-x-3">
                                    <span className="text-green-900 font-bold">species:</span>
                                    <span>{modalContent.species}</span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <span className="text-2xl font-bold text-green-950 block mb-3">Episodes:</span>
                            <ul className="flex flex-col gap-y-1.5">
                                <li>здесь будут вводиться ссылки с названиями эпизодов</li>
                                <li>здесь будут вводиться ссылки с названиями эпизодов</li>
                                <li>здесь будут вводиться ссылки с названиями эпизодов</li>
                                <li>здесь будут вводиться ссылки с названиями эпизодов</li>
                            </ul>
                        </div>
                        <div className="">
                            <span className="text-2xl font-bold text-green-950 mb-3 block">Locations:</span>
                            <ul className="flex flex-col gap-y-1.5">
                                <li className="flex gap-x-3 text-lg">
                                    <span className="text-green-900 font-bold">last known location:</span>
                                    <span>{modalContent.location.name}</span>
                                </li>
                                <li className="flex gap-x-3 text-lg">
                                    <span className="text-green-900 font-bold">origin location:</span>
                                    <span>{modalContent.origin.name}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    )
}

function Result({data}: Character) {
    return (
        data?.results?.map(result =>
        <li key={result.id}>{result.name}</li>
        )
    )
}

function SearchBox({onChange}) {
    const [search, setSearch] = useState('')
    const debounceSearchTerm = useDebounce(search, 200)

    const {data} = useQuery({
        queryKey: ['search', debounceSearchTerm],
        queryFn: () => {
            if (debounceSearchTerm) {
                return fetch(`https://rickandmortyapi.com/api/character/?name=${debounceSearchTerm}`).then(res => res.json())
            }
            return []
        }
    })

    const handleNameChange = (e) => {
        onChange(e.target.value)
    }

    return (
        <div className="col-span-2 h-12 border-2 p-2">
            <input className="focus:outline-none w-full" type="search" placeholder="Enter your search term here"
                // value={search} onChange={(e) => setSearch(e.target.value)}/>
                   value={search} onChange={(e) => {
                setSearch(e.target.value);
                handleNameChange(e)
            }}/>
            {data && <Result data={data}/>}
        </div>
    )
}

function useDebounce(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)

        }, delay)
        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])
    return debouncedValue
}

export default App
