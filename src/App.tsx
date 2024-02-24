import {CharacterResponse, getCharacters, Character} from "./shared/api";
import {keepPreviousData, QueryClient, QueryClientProvider, useInfiniteQuery} from "@tanstack/react-query";
import {useEffect, useRef, useState} from "react";
import {useClickAway} from "react-use";
import {useInView} from "react-intersection-observer";
import {useDebounce} from "./shared/helpers";
import errorSound from '../public/error.mp3'

const queryClient = new QueryClient()

const audio = new Audio(errorSound)

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Characters/>
        </QueryClientProvider>
    )
}

function CharacterCard({character, handlers}: {
    character: Character,
    handlers: { chooseCharacter: (character: Character) => void, setModalActive: (isActive: boolean) => void }
}) {
    const onClickHandler = () => {
        handlers.chooseCharacter(character)
        handlers.setModalActive(true)
    }
    return (
        <li onClick={onClickHandler}
            className="hover:shadow-2xl transition-all ease-in-out duration-200 cursor-pointer rounded-2xl shadow-md overflow-hidden pb-8 flex flex-col gap-y-4"
            key={character.id}>
            <img className="w-80 h-auto" src={character.image} alt={character.name}/>
            <span className="ps-3 font-raleway leading-5 text-green-700 text-md font-bold">{character.name}</span>
        </li>
    )
}

function Characters() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [activeCharacter, setActiveCharacter] = useState<Character>()
    const [searchValueName, setSearchValueName] = useState('')
    const [searchValueType, setSearchValueType] = useState('')
    const [searchValueSpecies, setSearchValueSpecies] = useState('')
    const [searchValueGender, setSearchValueGender] = useState('')
    const [searchValueStatus, setSearchValueStatus] = useState('')

    const {ref, inView} = useInView({});

    const fetchData = async ({name, pageParam, type, species, gender, status}: {
        name: string,
        pageParam: number,
        type: string,
        species: string,
        gender: string,
        status: string
    }): Promise<CharacterResponse> => {
        return getCharacters(name, pageParam, type, species, gender, status)
    }

    const debounceSearchTermName = useDebounce(searchValueName, 200)
    const debounceSearchTermType = useDebounce(searchValueType, 200)
    const debounceSearchTermSpecies = useDebounce(searchValueSpecies, 200)

    const {data, status, fetchNextPage, hasNextPage, isFetchingNextPage} = useInfiniteQuery({
        queryKey: ['charactersData', {
            name: debounceSearchTermName,
            type: debounceSearchTermType,
            species: debounceSearchTermSpecies,
            gender: searchValueGender,
            status: searchValueStatus
        }],
        queryFn: ({pageParam}) => fetchData({
            name: debounceSearchTermName,
            pageParam,
            type: debounceSearchTermType,
            species: debounceSearchTermSpecies,
            gender: searchValueGender,
            status: searchValueStatus
        }),
        initialPageParam: 1,
        retry: 0,
        placeholderData: keepPreviousData,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.info.next ? allPages.length + 1 : undefined
        }
    })

    useEffect(() => {
        if (inView && hasNextPage) {
            void fetchNextPage()
        }
    }, [inView, hasNextPage, fetchNextPage]);

    if (status === 'error') audio.play()

    return (
        <div className="pt-6 flex justify-center flex-col items-center mb-6">
            <h1 className="mb-8 font-raleway text-green-900 text-5xl font-extrabold">Characters</h1>
            <div className="flex flex-row gap-6">
                <div className="w-80 border-2 bg-gray-50 h-fit p-3 flex-col flex gap-y-2">
                    <TextInputComponent onInput={setSearchValueName} inputValue={searchValueName}
                                        placeholder={'Enter the name here'} label={'Name'}/>
                    <TextInputComponent onInput={setSearchValueType} inputValue={searchValueType}
                                        placeholder={'Enter the type here'} label={'Type'}/>
                    <TextInputComponent onInput={setSearchValueSpecies} inputValue={searchValueSpecies}
                                        placeholder={'Enter the species here'} label={'Species'}/>
                    <DropdownComponent oninput={setSearchValueGender}  label={'Gender'} options={['male', 'female', 'genderless', 'unknown']}/>
                    <DropdownComponent oninput={setSearchValueStatus}
                                       options={ ['alive', 'dead ', 'unknown']} label={'Status'}/>
                </div>
                <div className="w-[62rem]">
                    {status === 'pending' && <span className='font-raleway'>loading data...</span>}
                    {status === 'error' &&
                        <span className='font-raleway'>oops, something went wrong <br/> try changing the search parameters</span>}
                    {status === 'success' &&
                        <div className="flex items-center flex-col">
                            <ul className="grid grid-cols-3 gap-x-6 gap-y-8 m-auto mb-6">{
                                data && data.pages.map(page => {
                                    return page.results.map(character => <CharacterCard key={character.id} handlers={{
                                        chooseCharacter: setActiveCharacter,
                                        setModalActive: setIsModalOpen
                                    }} character={character}/>)
                                })
                            }</ul>
                            <span className="font-raleway"
                                  ref={ref}>{!hasNextPage ? 'nothing to load, this is the end =(' : isFetchingNextPage ? 'loading data...' : ''}</span>
                        </div>}
                </div>
            </div>
            {isModalOpen && activeCharacter && <Modal modalCloser={setIsModalOpen} modalContent={activeCharacter}/>}
        </div>
    )
}

function Modal({modalContent, modalCloser}: { modalContent: Character; modalCloser: (arg: boolean) => void }) {
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
                                    <span
                                        className="line-clamp-1">здесь будут вводиться ссылки с названиями эпизодов</span>
                                </li>
                                <li>
                                    <span
                                        className="line-clamp-1">здесь будут вводиться ссылки с названиями эпизодов</span>
                                </li>
                                <li>
                                    <span
                                        className="line-clamp-1">здесь будут вводиться ссылки с названиями эпизодов</span>
                                </li>
                                <li>
                                    <span
                                        className="line-clamp-1">здесь будут вводиться ссылки с названиями эпизодов</span>
                                </li>
                                <li>
                                    <span
                                        className="line-clamp-1">здесь будут вводиться ссылки с названиями эпизодов</span>
                                </li>
                                <li>
                                    <span
                                        className="line-clamp-1">здесь будут вводиться ссылки с названиями эпизодов</span>
                                </li>
                                <li>
                                    <span
                                        className="line-clamp-1">здесь будут вводиться ссылки с названиями эпизодов</span>
                                </li>
                                <li>
                                    <span
                                        className="line-clamp-1">здесь будут вводиться ссылки с названиями эпизодов</span>
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

function TextInputComponent({onInput, inputValue, placeholder, label}: {
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

function DropdownComponent({options, oninput, label}: {
    options: string[],
    oninput: (inputValue: string) => void,
    label: string
}) {
    return (
        <label className='flex-col flex gap-y-1.5'>
            <span className='font-raleway text-green-800 font-bold'>{label}</span>
            <select className="focus:outline-none w-full font-raleway h-12 border-2 p-2 rounded-md" onChange={(e) => {
                oninput(e.target.value)
            }}>
                <option value="">any</option>
                {options.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
        </label>
    )
}

export default App
