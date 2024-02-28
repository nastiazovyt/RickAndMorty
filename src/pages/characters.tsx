import {useState} from "react";
import {
    Character,
    fetchCharactersData, fetchMultipleEpisodesData,
    setWithLocalStorage,
    useDebounce,
    useError,
    withDefault
} from "../shared/helpers";
import {keepPreviousData, useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {Card, DropdownComponent, ModalComponent, TextInputComponent} from "../shared/ui";
import {CardsGrid} from "../shared/ui/cardsGrid.tsx";

export function Characters() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [activeCharacter, setActiveCharacter] = useState<Character>()
    const [searchValueName, setSearchValueName] = useState(withDefault('characterName', ''))
    const [searchValueType, setSearchValueType] = useState(withDefault('characterType', ''))
    const [searchValueSpecies, setSearchValueSpecies] = useState(withDefault('characterSpecies', ''))
    const [searchValueGender, setSearchValueGender] = useState(withDefault('characterGender', ''))
    const [searchValueStatus, setSearchValueStatus] = useState(withDefault('characterStatus', ''))
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
                        return page.results.map(character => <Card data={character} key={character.id} handlers={{
                            chooseActiveCard: setActive,
                            setModalActive: setIsModalOpen
                        }}>{
                            <div className="font-raleway text-green-700 pb-4 flex flex-col gap-y-4">
                                <img className="w-80 h-auto" src={character.image} alt={character.name}/>
                                <span
                                    className="ps-3 pe-3 w-80 sm:w-full lg:w-80 font-raleway leading-5 text-green-700 text-md font-bold">{character.name}</span>
                            </div>
                        }</Card>)
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
