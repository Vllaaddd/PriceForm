'use client'

import { FC, useEffect, useState } from "react";
import { Container } from "./container";
import Link from "next/link";
import { Title } from "./title";
import { usePathname } from "next/navigation";
import Image from "next/image";

export const Header: FC = () => {

    const pathname = usePathname()
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

  if (!mounted) return null;

    return(
        <header className="bg-white p-4 flex items-center">
            <Image src='/fora-logo.png' alt="Logo" width={50} height={20} className="md:w-24" />
            <Container>
                <div className="flex items-center gap-5 md:gap-10 justify-center">
                    <Link href={'/'}>
                        <Title active={pathname == '/' ? true : false} title={'Create calculation'} />
                    </Link>
                    <Link href={'/all-calculations'}>
                        <Title active={pathname == '/all-calculations' ? true : false} title={'All calculations'} />
                    </Link>
                </div>
            </Container>
        </header>
    )
}