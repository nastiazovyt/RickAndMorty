import {ReactNode} from "react";

export function ModalComponent({children, modalCloser}: {children: ReactNode, modalCloser: (arg: boolean) => void }) {

    const onClick = () => {
        modalCloser(false)
    }

    return (
        <div className="fixed h-dvh w-dvw z-20 top-0 left-0 font-raleway overflow-hidden flex justify-center items-center">
            <div onClick={onClick} className="absolute bg-[#00000033] h-full w-full"></div>
                <div className="2xl:p-12 relative p-8 z-21 2xl:w-[56rem] lg:w-3/5 w-4/5 h-fit bg-white rounded-2xl shadow-2xl">
                    {children}
            </div>
        </div>
    )
}
