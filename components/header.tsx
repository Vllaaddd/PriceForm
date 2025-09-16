'use client'

import { FC, useEffect, useState } from "react";
import { Container } from "./container";
import Link from "next/link";
import { Title } from "./title";
import { usePathname } from "next/navigation";

export const Header: FC = () => {

    const pathname = usePathname()
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

  if (!mounted) return null;

    return(
        <header className="bg-white p-4">
            <Container>
                <div className="flex items-center gap-10 justify-center">
                    <Link href={'/'}>
                        <Title active={pathname == '/' ? true : false} title={'Створити розрахунок'} />
                    </Link>
                    <Link href={'/all-calculations'}>
                        <Title active={pathname == '/all-calculations' ? true : false} title={'Всі розрахунки'} />
                    </Link>
                </div>
            </Container>
        </header>
    )
}