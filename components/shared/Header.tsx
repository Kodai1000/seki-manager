import Image from "next/image";


export default function Header () {
    return (
        <header className="border-y-4 border-[#2F5D8C] text-slate-900 bg-blue-50 ">
            <div className="mx-auto flex h-14 w-full max-w-7xl items-center px-6 flex justify-between">
                <div className="flex">
                    <Image
                        src="/images/sekimane_icon_seats.svg"
                        alt="席マネ"
                        width={48}
                        height={48}
                        className="inline-block mr-2"
                        />
                    <h1 className="text-lg font-bold flex items-center">席マネ</h1>
                </div>
            </div>
        </header>
    )
}