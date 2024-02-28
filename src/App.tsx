import {Character, Location, Episode} from './shared/types.ts'
import {
    TextInputComponent,
    DropdownComponent,
    ModalComponent,
    EpisodeCard,
    LocationCard,
    CharacterCard
} from "./shared/ui";
import {keepPreviousData, QueryClient, QueryClientProvider, useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {SetStateAction, useEffect, useState} from "react";
import {
    useDebounce,
    fetchEpisodesData,
    fetchCharactersData,
    fetchLocationsData,
    fetchMultipleCharactersData,
    fetchMultipleEpisodesData,
    localStorageSaver,
    withDefault,
    setWithLocalStorage,
    useError
} from "./shared/helpers";
import {CardsGrid} from "./shared/ui/cardsGrid.tsx";

const queryClient = new QueryClient()

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Content/>
        </QueryClientProvider>
    )
}

function Content() {
    const [value, setValue] = useState(() => {
        return localStorageSaver.get('mainChoice') ?? 'Characters'
    });

    const changeValue = (e: { target: { value: SetStateAction<string> } }) => {
        setValue(e.target.value)
    }

    useEffect(() => {
        localStorageSaver.set('mainChoice', value)
    }, [value]);

    return (
        <div className="flex flex-col gap-y-8 pt-4 m-auto">
            <div
                className="flex sm:flex-row flex-col justify-center border-2 xl:w-[64rem] w-4/5 m-auto bg-gray-50 text-xl h-fit p-3 gap-x-12 mb-4">
                <label className="flex flex-row gap-x-2">
                    <input className="accent-yellow-100" type="radio" value="Characters"
                           checked={value === 'Characters'}
                           onChange={changeValue}/>
                    <span className="font-raleway text-green-900 font-bold">Characters</span>
                </label>
                <label className="flex flex-row gap-x-2">
                    <input className="accent-yellow-100" type="radio" value="Locations"
                           checked={value === 'Locations'}
                           onChange={changeValue}/>
                    <span className="font-raleway text-green-900 font-bold">Locations</span>
                </label>
                <label className="flex flex-row gap-x-2">
                    <input className="accent-yellow-100" type="radio" value="Episodes"
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
    )
}

function Characters() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [activeCharacter, setActiveCharacter] = useState<Character>()
    const [searchValueName, setSearchValueName] = useState(withDefault('characterName'))
    const [searchValueType, setSearchValueType] = useState(withDefault('characterType'))
    const [searchValueSpecies, setSearchValueSpecies] = useState(withDefault('characterSpecies'))
    const [searchValueGender, setSearchValueGender] = useState(withDefault('characterGender'))
    const [searchValueStatus, setSearchValueStatus] = useState(withDefault('characterStatus'))
    const [activeCharacterEpisodeId, setActiveCharacterEpisodeId] = useState<string[]>([])

    const debounceSearchTermName = useDebounce(searchValueName, 200)
    const debounceSearchTermType = useDebounce(searchValueType, 200)
    const debounceSearchTermSpecies = useDebounce(searchValueSpecies, 200)

    const {data, status, fetchNextPage, hasNextPage, isFetchingNextPage, isError} =
        useInfiniteQuery({
            queryKey: ['charactersData', {
                name: debounceSearchTermName,
                type: debounceSearchTermType,
                species: debounceSearchTermSpecies,
                gender: searchValueGender,
                status: searchValueStatus
            }],
            queryFn: ({pageParam}) => fetchCharactersData({
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

    useError(isError)

    const saveName = setWithLocalStorage('characterName', setSearchValueName)
    const saveType = setWithLocalStorage('characterType', setSearchValueType)
    const saveSpecies = setWithLocalStorage('characterSpecies', setSearchValueSpecies)
    const saveGender = setWithLocalStorage('characterGender', setSearchValueGender)
    const saveStatus = setWithLocalStorage('characterStatus', setSearchValueStatus)

    const {data: activeCharacterEpisodesData} = useQuery({
        queryKey: ['characterEpisodesData', activeCharacterEpisodeId],
        queryFn: () => fetchMultipleEpisodesData(activeCharacterEpisodeId),
        enabled: !!activeCharacterEpisodeId.length
    })

    const setActive = (character: Character) => {
        setActiveCharacter(character)
        setActiveCharacterEpisodeId(!character
            ? []
            : character.episode.reduce((acc, url) => {
                const id = url.split('/').pop()
                if (id) acc.push(id)
                return acc
            }, [] as string[])
        )
    }

    return (
        <div className="flex flex-col items-center">
            <div
                className="flex 2xl:w-[90rem] sm:w-[38rem] lg:w-[60rem] flex-col gap-6 2xl:flex-row items-center 2xl:items-start">
                <div
                    className="2xl:w-80 w-full border-2 bg-gray-50 h-fit p-3 flex-col items-center flex gap-y-2 relative">
                    <span
                        className="text-green-800 font-bold absolute sm:-top-12 -top-14 text-center sm:-left-10 -left-7 -rotate-12 block bg-amber-200 p-2 rounded-2xl">turn on <br/>the sound</span>
                    <TextInputComponent onInput={saveName} inputValue={searchValueName}
                                        placeholder={'Enter the name here'} label={'Name'}/>
                    <TextInputComponent onInput={saveType} inputValue={searchValueType}
                                        placeholder={'Enter the type here'} label={'Type'}/>
                    <TextInputComponent onInput={saveSpecies} inputValue={searchValueSpecies}
                                        placeholder={'Enter the species here'} label={'Species'}/>
                    <DropdownComponent oninput={saveGender} label={'Gender'} value={searchValueGender}
                                       options={['male', 'female', 'genderless', 'unknown']}/>
                    <DropdownComponent oninput={saveStatus} value={searchValueStatus}
                                       options={['alive', 'dead ', 'unknown']} label={'Status'}/>
                </div>
                <CardsGrid status={status} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage}
                           fetchFunction={async () => void fetchNextPage()}>{
                    data && data.pages.map(page => {
                        return page.results.map(character => <CharacterCard key={character.id} handlers={{
                            chooseActiveCard: setActive,
                            setModalActive: setIsModalOpen
                        }} character={character}/>)
                    })
                }</CardsGrid>
            </div>
            {isModalOpen && activeCharacter && <ModalComponent modalCloser={setIsModalOpen}>
                <div className='2xl:h-[44rem] h-[36rem]'>
                    <div
                        className="sm:grid flex flex-col grid-rows-2 grid-cols-2 lg:gap-x-12 2xl:gap-y-16 sm:gap-12 gap-6">
                        <img className="rounded-2xl 2xl:w-[24rem] 2xl:h-[24rem] sm:w-64 sm:h-64 hidden sm:block"
                             src={activeCharacter.image}
                             alt={activeCharacter.name}/>
                        <div className="flex-col flex border-2 border-green-950 sm:p-6 p-4 2xl:w-96">
                            <span
                                className="2xl:text-4xl sm:text-2xl text-xl font-bold text-green-950 mb-1.5 underline">{activeCharacter.name}</span>
                            <span className="2xl:mb-12 text-md">{activeCharacter.status}</span>
                            <ul className="flex text-lg flex-col mt-auto leading-6">
                                {
                                    activeCharacter.type &&
                                    <li className="flex gap-x-3">
                                        <span className="text-green-900 font-bold">type:</span>
                                        <span>{activeCharacter.type}</span>
                                    </li>
                                }
                                <li className="flex gap-x-3">
                                    <span className="text-green-900 font-bold">gender:</span>
                                    <span>{activeCharacter.gender}</span>
                                </li>
                                <li className="flex gap-x-3">
                                    <span className="text-green-900 font-bold">species:</span>
                                    <span>{activeCharacter.species}</span>
                                </li>
                            </ul>
                        </div>
                        <div className="2xl:w-96">
                            <span
                                className="sm:text-2xl text-xl font-bold text-green-950 block mb-2 sm:mb-3">Episodes:</span>
                            <ul className="flex flex-col gap-y-1.5 2x;:h-52 h-44 overflow-auto">
                                {!!setActiveCharacterEpisodeId.length &&
                                    <ul className="flex flex-col gap-y-1.5 2xl:h-52 h-44 overflow-auto">
                                        {activeCharacterEpisodesData?.map(episode =>
                                            <li key={episode.id}>
                                                <span className="line-clamp-1">{episode.name}</span>
                                            </li>
                                        )}
                                    </ul>}
                            </ul>
                        </div>
                        <div className="">
                            <span
                                className="sm:text-2xl text-xl font-bold text-green-950 block mb-2 sm:mb-3">Locations:</span>
                            <ul className="flex flex-col sm:gap-y-6 gap-y-3">
                                <li className="flex flex-col text-lg">
                                    <span className="text-green-900 font-bold">last known location:</span>
                                    <span>{activeCharacter.location.name}</span>
                                </li>
                                <li className="flex flex-col text-lg">
                                    <span className="text-green-900 font-bold">origin location:</span>
                                    <span>{activeCharacter.origin.name}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </ModalComponent>}
        </div>
    )
}

function Locations() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [activeLocation, setActiveLocation] = useState<Location>()
    const [searchValueName, setSearchValueName] = useState(withDefault('locationName'))
    const [searchValueType, setSearchValueType] = useState(withDefault('locationType'))
    const [searchValueDimensions, setSearchValueDimensions] = useState(withDefault('locationDimensions'))
    const [activeLocationCharactersId, setActiveLocationCharactersId] = useState<string[]>([])

    const debounceSearchTermName = useDebounce(searchValueName, 200)
    const debounceSearchTermType = useDebounce(searchValueType, 200)

    const {data, status, fetchNextPage, hasNextPage, isFetchingNextPage, isError} = useInfiniteQuery({
        queryKey: ['locationsData', {
            name: debounceSearchTermName,
            type: debounceSearchTermType,
            dimension: searchValueDimensions
        }],
        queryFn: ({pageParam}) => fetchLocationsData({
            name: debounceSearchTermName,
            pageParam,
            type: debounceSearchTermType,
            dimension: searchValueDimensions
        }),
        initialPageParam: 1,
        retry: 0,
        placeholderData: keepPreviousData,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.info.next ? allPages.length + 1 : undefined
        }
    })

    useError(isError)

    const saveLocationName = setWithLocalStorage('locationName', setSearchValueName)
    const saveLocationType = setWithLocalStorage('locationType', setSearchValueType)
    const saveDimensions = setWithLocalStorage('locationDimensions', setSearchValueDimensions)

    const {data: activeLocationCharactersData} = useQuery({
        queryKey: ['locationCharactersData', activeLocationCharactersId],
        queryFn: () => fetchMultipleCharactersData(activeLocationCharactersId),
        enabled: !!activeLocationCharactersId.length
    })

    const setActive = (location: Location) => {
        setActiveLocation(location)
        setActiveLocationCharactersId(!location
            ? []
            : location.residents.reduce((acc, url) => {
                const id = url.split('/').pop()
                if (id) acc.push(id)
                return acc
            }, [] as string[])
        )
    }

    return (
        <div className="flex justify-center flex-col items-center mb-6">
            <div
                className="flex 2xl:w-[90rem] sm:w-[38rem] lg:w-[60rem] flex-col gap-6 2xl:flex-row items-center 2xl:items-start">
                <div
                    className="2xl:w-80 w-full border-2 bg-gray-50 h-fit p-3 flex-col items-center flex gap-y-2 relative">
                    <span
                        className="text-green-800 font-bold absolute sm:-top-12 -top-16 text-center sm:-left-10 -left-3 -rotate-12 block bg-amber-200 p-2 rounded-2xl">turn on <br/>the sound</span>
                    <TextInputComponent onInput={saveLocationName} inputValue={searchValueName}
                                        placeholder={'Enter the location name here'} label={'Location'}/>
                    <TextInputComponent onInput={saveLocationType} inputValue={searchValueType}
                                        placeholder={'Enter the type here'} label={'Type'}/>
                    <TextInputComponent onInput={saveDimensions} inputValue={searchValueDimensions}
                                        placeholder={'Enter the dimension here'} label={'Dimension'}/>
                </div>
                <CardsGrid status={status} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage}
                           fetchFunction={async () => void fetchNextPage()}>{
                    data && data.pages.map(page => {
                        return page.results.map(location => <LocationCard key={location.id} handlers={{
                            chooseActiveCard: setActive,
                            setModalActive: setIsModalOpen
                        }} location={location}/>)
                    })
                }</CardsGrid>
            </div>
            {isModalOpen && activeLocation && <ModalComponent modalCloser={setIsModalOpen} children={
                <div className="flex sm:flex-row flex-col gap-x-12 gap-y-4 sm:gap-y-0">
                    <div className="flex-col flex border-2 border-green-950 p-6 lg:w-96 sm:w-64">
                        <span
                            className="lg:text-4xl sm:text-3xl text-2xl mb-4 font-bold text-green-950 underline sm:mb-auto">{activeLocation.name}</span>
                        <span className="text-md mt-4">{activeLocation.type}</span>
                        <span className="text-md">{activeLocation.dimension}</span>
                    </div>
                    <div>
                        <span className="text-2xl font-bold text-green-950 block mb-3">Characters:</span>
                        {!!activeLocationCharactersId.length &&
                            <ul className="flex flex-col gap-y-1.5 h-52 overflow-auto lg:w-96">
                                {activeLocationCharactersData?.map(character =>
                                    <li key={character.id}>
                                        <span className="line-clamp-1">{character.name}</span>
                                    </li>
                                )}
                            </ul>}
                        {!activeLocationCharactersId.length && <span>nothing to show</span>}
                    </div>
                </div>
            }/>}
        </div>
    )
}

function Episodes() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [activeEpisode, setActiveEpisode] = useState<Episode>()
    const [searchValueName, setSearchValueName] = useState(withDefault('episodeName'))
    const [searchValueAirDate, setSearchValueAirDate] = useState(withDefault('airData'))
    const [searchValueEpisode, setSearchValueEpisode] = useState(withDefault('episodeCode'))
    const [activeEpisodeCharacters, setActiveEpisodeCharacters] = useState<string[]>([])

    const debounceSearchTermName = useDebounce(searchValueName, 200)
    const debounceSearchTermAirDate = useDebounce(searchValueAirDate, 200)
    const debounceSearchTermEpisode = useDebounce(searchValueEpisode, 200)

    const {data, status, fetchNextPage, hasNextPage, isFetchingNextPage, isError} = useInfiniteQuery({
        queryKey: ['episodeData', {
            name: debounceSearchTermName,
            air_date: debounceSearchTermAirDate,
            dimension: debounceSearchTermEpisode
        }],
        queryFn: ({pageParam}) => fetchEpisodesData({
            name: debounceSearchTermName,
            pageParam,
            air_date: debounceSearchTermAirDate,
            episode: debounceSearchTermEpisode
        }),
        initialPageParam: 1,
        retry: 0,
        placeholderData: keepPreviousData,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.info.next ? allPages.length + 1 : undefined
        }
    })

    const {data: activeEpisodeCharactersData} = useQuery({
        queryKey: ['episodeCharactersData', activeEpisodeCharacters],
        queryFn: () => fetchMultipleCharactersData(activeEpisodeCharacters),
        enabled: !!activeEpisodeCharacters.length
    })

    useError(isError)

    const saveEpisodeName = setWithLocalStorage('episodeName', setSearchValueName)
    const saveAirData = setWithLocalStorage('airData', setSearchValueAirDate)
    const saveEpisodeCode = setWithLocalStorage('episodeCode', setSearchValueEpisode)

    const setActive = (episode: Episode) => {
        setActiveEpisode(episode)

        setActiveEpisodeCharacters(!episode
            ? []
            : episode.characters.reduce((acc, url) => {
                const id = url.split('/').pop()
                if (id) acc.push(id)
                return acc
            }, [] as string[])
        )
    }

    return (
        <div className="flex justify-center flex-col items-center mb-6">
            <div
                className="flex 2xl:w-[90rem] sm:w-[38rem] lg:w-[60rem] flex-col gap-6 2xl:flex-row items-center 2xl:items-start">
                <div
                    className="2xl:w-80 w-full border-2 bg-gray-50 h-fit p-3 flex-col items-center flex gap-y-2 relative">
                    <span
                        className="text-green-800 font-bold absolute sm:-top-12 -top-16 text-center sm:-left-10 -left-3 -rotate-12 block bg-amber-200 p-2 rounded-2xl">turn on <br/>the sound</span>
                    <TextInputComponent onInput={saveEpisodeName} inputValue={searchValueName}
                                        placeholder={'Enter the episode name  here'} label={'Episode'}/>
                    <TextInputComponent onInput={saveAirData} inputValue={searchValueAirDate}
                                        placeholder={'Enter the air data here'} label={'Air data'}/>
                    <TextInputComponent onInput={saveEpisodeCode} inputValue={searchValueEpisode}
                                        placeholder={'Enter the episode code here'} label={'Episode code'}/>
                </div>
                <CardsGrid status={status} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage}
                           fetchFunction={async () => void fetchNextPage()}>{
                    data && data.pages.map(page => {
                        return page.results.map(episode => <EpisodeCard key={episode.id} handlers={{
                            chooseActiveCard: setActive,
                            setModalActive: setIsModalOpen
                        }} episode={episode}/>)
                    })
                }</CardsGrid>
            </div>
            {isModalOpen && activeEpisode && <ModalComponent modalCloser={setIsModalOpen} children={
                <div className="flex sm:flex-row flex-col gap-x-12 gap-y-4 sm:gap-y-0">
                    <div className="flex-col flex border-2 border-green-950 sm:p-6 p-2 lg:w-96 sm:w-64">
                        <span
                            className="lg:text-4xl sm:text-3xl text-2xl mb-4  font-bold text-green-950 underline sm:mb-auto">{activeEpisode.name}</span>
                        <span className="text-md">{activeEpisode.episode}</span>
                        <span className="text-md">{activeEpisode.air_date}</span>
                    </div>
                    <div>
                        <span className="text-2xl font-bold text-green-950 block mb-3">Characters:</span>
                        <ul className="flex flex-col gap-y-1.5 h-52 overflow-auto lg:w-96 sm:w-48">
                            {activeEpisodeCharactersData?.map(character =>
                                <li key={character.id}>
                                    <span className="line-clamp-1">{character.name}</span>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            }/>}
        </div>
    )
}

export default App
