import Link from 'next/link'
import Image from 'next/image'
import { User } from 'lucide-react'

export default function Nav() {
    return (
        <div className="sticky top-0 inset-x-0 z-50 group w-full">
            <header className="relative h-16 mx-auto border-b duration-200 bg-white border-ui-border-base">
                <nav className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex">
                                <Link
                                    href="/"
                                    className="flex-shrink-0 flex items-center"
                                >
                                    <Image
                                        src="/logo.svg"
                                        alt="DentiSmile Logo"
                                        width={40}
                                        height={40}
                                        className="h-10 w-auto"
                                    />
                                </Link>
                            </div>
                            <div className="flex items-center">
                                <Link
                                    href="/account"
                                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                                >
                                    <User size={24} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        </div>
    )
}
