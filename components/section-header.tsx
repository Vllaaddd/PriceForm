import { FC } from "react";

type Props = {
    title: string
}

export const SectionHeader: FC<Props> = ({ title }) => (
  <h3 className="text-lg font-bold text-gray-800 mt-8 mb-3 pb-2 border-b-2 border-blue-500 inline-block">
    {title}
  </h3>
);