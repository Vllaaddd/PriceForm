import { FC } from "react"

type Props = {
    className?: any;
}

export const FilterIcon: FC<Props> = ({ className }) =>{
    return(
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.125 1.125 0 1 1-2.25 0 1.125 1.125 0 0 1 2.25 0ZM10.5 6H7.5m3.75 6h9.75M13.5 12a1.125 1.125 0 1 1-2.25 0 1.125 1.125 0 0 1 2.25 0ZM13.5 12H7.5m4.5 6h9.75M15 18a1.125 1.125 0 1 1-2.25 0 1.125 1.125 0 0 1 2.25 0ZM15 18h-7.5" />
        </svg>
    )
}