import Link from 'next/link'
import Image from 'next/image'
import AccountButton from './AccountButton'

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
                                        width={80}
                                        height={40}
                                        priority
                                    />
                                </Link>
                            </div>
                            <div className="flex items-center">
                                <AccountButton />
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        </div>
    )
}
