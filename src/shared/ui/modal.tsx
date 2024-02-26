import {ReactNode, useRef} from "react";
import {useClickAway} from "react-use";

export function ModalComponent({children, modalCloser}: {children: ReactNode, modalCloser: (arg: boolean) => void }) {
    const modalRef = useRef(null)
    useClickAway(modalRef, () => {
        modalCloser(false)
    })

    return (
        <div className="fixed h-dvh w-dvw top-0 left-0 z-20 font-raleway">
            <div className="flex justify-center items-center h-full bg-[#00000033]">
                <div ref={modalRef} className="p-12 w-[56rem] h-fit bg-white rounded-2xl shadow-2xl">
                    {children}
                </div>
            </div>
        </div>
    )
}
