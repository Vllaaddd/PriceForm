import Link from "next/link";

export default function NavItem ({ href, active, children }: { href: string, active: boolean, children: React.ReactNode }){
    return (
        <Link
            href={href}
            className={`
                px-4 py-2 text-sm font-medium rounded-full transition-all duration-200
                ${active 
                    ? "bg-black text-white shadow-md" 
                    : "text-gray-600 hover:bg-gray-100 hover:text-black"
                }
            `}
        >
            {children}
        </Link>
    );
};