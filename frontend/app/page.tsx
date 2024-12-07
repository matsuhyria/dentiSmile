'use client';

import Map from '@/components/Map';

export default function Home() {
    return (
        <main className="w-full">
            <div className="flex flex-col items-center">
                <h1 className="font-semibold my-4">
                    Select a Dentist Location
                </h1>
            </div>
            <Map />
        </main>
    );
}
