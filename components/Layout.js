import Nav from "@/components/Nav";
import Logo from "@/components/Logo";
import {useState} from "react";
import {useSession, signIn} from "next-auth/react"

export default function Layout({children}) {
    const [showNav,setShowNav] = useState(false);
    const {data: session} = useSession();
    if (!session) {
        return (
            <div className="w-screen h-screen flex items-center justify-center bg-gray-800 ">
                <button onClick={() => signIn('google')}
                        className="login-btn">
                    <span className="mr-2">Login with Google</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
            </div>
        );
    }

    return (
        <div className="bg-bgGray min-h-screen ">
            <div className="md:hidden flex items-center p-4">
                <button onClick={() => setShowNav(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                    </svg>
                </button>
                <div className="flex grow justify-center mr-6">
                    <Logo />
                </div>
            </div>
            <div className="flex">
                <Nav show={showNav} />
                <div className="flex-grow p-4">
                    {children}
                </div>
            </div>
        </div>
    );
}