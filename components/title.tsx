import { FC } from "react";

interface Props{
    title: String;
    active: Boolean;
}

export const Title: FC<Props> = ({ title, active }) => {
    return(
        <h2 className={`font-bold relative pb-1 ${
            active ? "after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-black" : ""
        }`}>{title}</h2>
    )
}