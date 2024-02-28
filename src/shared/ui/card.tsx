import {ReactNode} from "react";

export function Card<T extends {id: number}>({children, handlers, data}: {
    children: ReactNode,
    data: T
    handlers: {
        chooseActiveCard: (data: T) => void,
        setModalActive: (isActive: boolean) => void
    },
}) {
    const onClickHandler = () => {
        handlers.chooseActiveCard(data)
        handlers.setModalActive(true)
    }

    return (
        <li onClick={onClickHandler}
            className="hover:shadow-2xl transition-all
             2xl:w-[20rem] sm:w-full w-[20rem] ease-in-out duration-200 cursor-pointer rounded-2xl shadow-md overflow-hidden"
            key={data.id}>
            {children}
        </li>
    )
}
