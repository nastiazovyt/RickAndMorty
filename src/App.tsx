import {Character, getCharacters, ResultType} from "./shared/api";
import {QueryClient, QueryClientProvider, useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {useEffect, useRef, useState} from "react";
import {useClickAway} from "react-use";
import {useInView} from "react-intersection-observer";

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
    const [searchResult, setSearchResult] = useState<Element>()


    const { ref, inView } = useInView({});

    const fetchData = async ({pageParam}: { pageParam: number }) => {
        return getCharacters(pageParam)
    }

    const {data, status, error, fetchNextPage, hasNextPage, isFetchingNextPage} = useInfiniteQuery({
        queryKey: ['charactersData'],
        queryFn: fetchData,
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            const nextPage = lastPage.info.next ? allPages.length +1 : undefined
            return nextPage
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
                <img className="w-80 h-auto" src={character.image} alt={character.name}/>
                <span className="ps-3 font-raleway leading-5 text-green-700 text-md font-bold">{character.name}</span>
            </li>
        )
    })

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage()
        }
    }, [inView, hasNextPage, fetchNextPage]);

    if (status === 'pending') {
        return <p>Loading</p>
    }
    if (status === 'error') {
        return <p>{error.message}</p>
    }

    const changeSearchData = (searchResult: Character) => {
        const searchCharacters = searchResult?.results?.map(results => {
            return <li onClick={() => {
                setIsModalOpen(true);
                setActiveCharacter(results)
            }}
                       className="hover:shadow-2xl transition-all ease-in-out duration-200 cursor-pointer rounded-2xl shadow-md overflow-hidden pb-8 flex flex-col gap-y-4"
                       key={results.id}>
                <img className="w-80 h-auto" src={results.image} alt={results.name}/>
                <span className="ps-3 font-raleway leading-5 text-green-700 text-md font-bold">{results.name}</span>
            </li>
        })

        setSearchResult(searchCharacters)
    }

    return (
        <div className="flex justify-center flex-col items-center mb-6">
            <h1 className="pt-6 mb-8 font-raleway text-green-900 text-5xl font-extrabold">Characters</h1>
            <div className="grid grid-flow-col gap-6">
                <div className="row-span-3 w-72 border-2 h-96">Фильтры</div>
                <SearchBox onChange={changeSearchData}/>
                <div className="flex items-center flex-col row-span-2 col-span-2">
                    <ul className="grid grid-cols-3 gap-x-6 gap-y-8 w-fit m-auto  mb-6">{!searchResult ? characters : searchResult}</ul>
                    <span className="font-raleway" ref={ref}>{!hasNextPage ? 'nothing to load, this is the end =(' : isFetchingNextPage ? 'loading data...' : ''}</span>
                </div>
            </div>
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
                            <ul className="flex flex-col gap-y-1.5 h-52 overflow-auto">
                                <li>
                                    <span className="line-clamp-1">здесь будут вводиться ссылки с названиями эпизодов</span>
                                </li>
                                <li>
                                    <span className="line-clamp-1">здесь будут вводиться ссылки с названиями эпизодов</span>
                                </li>
                                <li>
                                    <span className="line-clamp-1">здесь будут вводиться ссылки с названиями эпизодов</span>
                                </li>
                                <li>
                                    <span className="line-clamp-1">здесь будут вводиться ссылки с названиями эпизодов</span>
                                </li>
                                <li>
                                    <span className="line-clamp-1">здесь будут вводиться ссылки с названиями эпизодов</span>
                                </li>
                                <li>
                                    <span className="line-clamp-1">здесь будут вводиться ссылки с названиями эпизодов</span>
                                </li>
                                <li>
                                    <span className="line-clamp-1">здесь будут вводиться ссылки с названиями эпизодов</span>
                                </li>
                                <li>
                                    <span className="line-clamp-1">здесь будут вводиться ссылки с названиями эпизодов</span>
                                </li>
                            </ul>
                        </div>
                        <div className="">
                            <span className="text-2xl font-bold text-green-950 mb-3 block">Locations:</span>
                            <ul className="flex flex-col gap-y-6">
                                <li className="flex flex-col text-lg">
                                    <span className="text-green-900 font-bold">last known location:</span>
                                    <span>{modalContent.location.name}</span>
                                </li>
                                <li className="flex flex-col text-lg">
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

    const changeSearchData = (data: Character) => {
        onChange(data)
    }

    return (
        <div className="col-span-2 h-12 border-2 p-2">
            <input className="focus:outline-none w-full font-raleway" type="search" placeholder="Enter your search term here"
                   value={search} onChange={(e) => {
                setSearch(e.target.value);
                changeSearchData(data)
            }}/>
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
