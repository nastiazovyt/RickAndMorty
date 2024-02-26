import {ReactNode, useEffect} from "react";
import {useInView} from "react-intersection-observer";

export function CardsGrid({children, status, hasNextPage, isFetchingNextPage, fetchFunction}: {
    children: ReactNode,
    status: string,
    hasNextPage: boolean,
    isFetchingNextPage: boolean,
    fetchFunction: () => Promise<void>
}) {
    const {ref, inView} = useInView({});

    useEffect(() => {
        if (inView && hasNextPage) {
            void fetchFunction()
        }
    }, [inView, hasNextPage, fetchFunction]);

    return (
        <div className="w-[62rem]">
            {status === 'pending' && <span className='font-raleway'>loading data...</span>}
            {status === 'error' &&
                <span
                    className='font-raleway'>oops, something went wrong <br/> try changing the search parameters</span>}
            {status === 'success' &&
                <div className="flex items-center flex-col">
                    <ul className="grid grid-cols-3 gap-x-6 gap-y-8 m-auto mb-6">{children}</ul>
                    <span className="font-raleway"
                          ref={ref}>{!hasNextPage ? 'this is the end =(' : isFetchingNextPage ? 'loading data...' : ''}</span>
                </div>}
        </div>
    )
}
