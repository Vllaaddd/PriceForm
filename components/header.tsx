'use client'

import { FC, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Container } from "./container";
import NavItem from "./nav-item";

export const Header: FC = () => {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        setMounted(true);
        
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (!mounted) return null;

    return (
        <header 
            className={`
                sticky top-0 z-50 transition-all duration-300 border-b
                ${scrolled 
                    ? "bg-white/80 backdrop-blur-xl border-gray-200/50 shadow-sm py-2" 
                    : "bg-white/0 border-transparent py-4"
                }
            `}
        >
            <Container>
                <div className="flex items-center justify-between px-4 md:px-8 relative">
                    
                    <Link 
                        href="/" 
                        className="flex-shrink-0 hover:opacity-80 transition-opacity"
                    >
                        <Image
                            src="/fora-logo.png"
                            alt="Logo"
                            width={40}
                            height={40}
                            className="object-contain md:w-12 md:h-12"
                        />
                    </Link>

                    <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-1 bg-white/50 backdrop-blur-md p-1.5 rounded-full border border-gray-100 shadow-sm">
                        <NavItem href="/" active={pathname === '/'}>
                            Create calculation
                        </NavItem>
                        <NavItem href="/all-calculations" active={pathname === '/all-calculations'}>
                            All calculations
                        </NavItem>
                    </nav>

                    <div className="w-10 md:w-12" />
                </div>
            </Container>
        </header>
    );
};