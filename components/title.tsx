import { FC } from "react";

interface Props {
    title: string;
    active: boolean;
}

export const Title: FC<Props> = ({ title, active }) => {
  return (
    <h2
        className={`
            font-medium relative pb-1 text-gray-700 text-sm md:text-base transition-all duration-200
            cursor-pointer select-none
            after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px]
            after:transition-all after:duration-300
            ${active
                ? "after:w-full after:bg-black text-black font-semibold"
                : "after:w-0 after:bg-transparent hover:after:w-full hover:after:bg-gray-400 hover:text-black"
            }
        `}
    >
        {title}
    </h2>
  );
};
