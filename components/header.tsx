'use client'

import { FC, useEffect, useState } from "react";
import { Container } from "./container";
import Link from "next/link";
import { Title } from "./title";
import { usePathname } from "next/navigation";
import Image from "next/image";

export const Header: FC = () => {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-200 shadow-sm">
            <Container>
                <div className="flex items-center justify-center px-4 md:px-8 py-3 relative">
                    <Link href="/" className="absolute left-4 md:left-8 hover:opacity-80 transition-opacity">
                        <Image
                            src="/fora-logo.png"
                            alt="Logo"
                            width={40}
                            height={40}
                            className="object-contain md:w-12 md:h-12"
                        />
                    </Link>

                    <nav className="flex items-center gap-6 md:gap-10">
                        <Link href="/">
                            <Title active={pathname === '/'} title="Create calculation" />
                        </Link>
                        <Link href="/all-calculations">
                            <Title active={pathname === '/all-calculations'} title="All calculations" />
                        </Link>
                    </nav>
                </div>
            </Container>
        </header>
    );
};