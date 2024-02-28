import {useState} from "react";
import {
    fetchLocationsData,
    fetchMultipleCharactersData,
    Location,
    setWithLocalStorage,
    useDebounce,
    useError,
    withDefault
} from "../shared/helpers";
import {keepPreviousData, useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {Card, ModalComponent, TextInputComponent} from "../shared/ui";
import {CardsGrid} from "../shared/ui/cardsGrid.tsx";

export function Locations() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [activeLocation, setActiveLocation] = useState<Location>()
    const [searchValueName, setSearchValueName] = useState(withDefault('locationName', ''))
    const [searchValueType, setSearchValueType] = useState(withDefault('locationType', ''))
    const [searchValueDimensions, setSearchValueDimensions] = useState(withDefault('locationDimensions', ''))
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
                        return page.results.map(location => <Card data={location} key={location.id} handlers={{
                            chooseActiveCard: setActive,
                            setModalActive: setIsModalOpen
                        }}>{
                            <div className="font-raleway text-green-700 p-2 ps-4 pb-4 flex flex-col gap-y-8">
                                <span className="text-xl font-bold underline">{location.name}</span>
                                <div className="flex flex-col gap-y-1.5 mt-auto">
                                    <span className="text-sm">{location.type}</span>
                                    <span className="text-md">{location.dimension}</span>
                                </div>
                            </div>
                        }</Card>)
                    })
                }</CardsGrid>
            </div>
            {isModalOpen && activeLocation && <ModalComponent modalCloser={setIsModalOpen}>
                {<div className="flex sm:flex-row flex-col gap-x-12 gap-y-4 sm:gap-y-0">
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
                </div>}
            </ModalComponent>}
        </div>
    )
}
