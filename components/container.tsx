import { FC } from 'react';

export const Container: FC<React.PropsWithChildren> = ({ children }) => {
  return <div className='mx-auto max-w-[1280px]'>{children}</div>;
};