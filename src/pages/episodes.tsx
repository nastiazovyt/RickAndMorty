import {useState} from "react";
import {
    Episode,
    fetchEpisodesData,
    fetchMultipleCharactersData, setWithLocalStorage,
    useDebounce,
    useError,
    withDefault
} from "../shared/helpers";
import {keepPreviousData, useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {Card, ModalComponent, TextInputComponent} from "../shared/ui";
import {CardsGrid} from "../shared/ui/cardsGrid.tsx";

export function Episodes() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [activeEpisode, setActiveEpisode] = useState<Episode>()
    const [searchValueName, setSearchValueName] = useState(withDefault('episodeName', ''))
    const [searchValueAirDate, setSearchValueAirDate] = useState(withDefault('airData', ''))
    const [searchValueEpisode, setSearchValueEpisode] = useState(withDefault('episodeCode', ''))
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
                        return page.results.map(episode => <Card data={episode} key={episode.id} handlers={{
                            chooseActiveCard: setActive,
                            setModalActive: setIsModalOpen
                        }}>{
                            <div className="font-raleway text-green-700 flex flex-col gap-y-8 ps-4 p-2 pb-4"><span
                                className="text-xl font-bold underline">{episode.name}</span>
                                <div className="flex lg:flex-row flex-col gap-x-10 mt-auto">
                                    <span className="text-sm">{episode.air_date}</span>
                                    <span className="text-md">{episode.episode}</span>
                                </div>
                            </div>
                        }</Card>)
                    })
                }</CardsGrid>
            </div>
            {isModalOpen && activeEpisode && <ModalComponent modalCloser={setIsModalOpen}>{
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
            }</ModalComponent>}
        </div>
    )
}
