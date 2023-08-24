import {useSession} from "next-auth/react";

export default function HomeHeader() {
    const {data:session} = useSession();
    return (
        <div className="text-blue-900 flex-col justify-between">
            <div className="hidden sm:block mb-8">
                <div className="flex justify-center overflow-hidden">
                    <img src={session?.user?.image} alt="" className="w-24 h-24 rounded-3xl"/>
                </div>
            </div>
            <h2 className="mt-0">
                <div className="flex gap-4 items-center justify-center">
                    <img src={session?.user?.image} alt="" className="w-10 h-10 rounded-md sm:hidden"/>
                    <div className='text-2xl'>
                        Hello, <b>{session?.user?.name}</b>
                    </div>
                </div>
            </h2>
        </div>
    );
}