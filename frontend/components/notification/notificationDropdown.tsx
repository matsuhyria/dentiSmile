import { useState } from "react";
import { Bell } from "lucide-react";
import { useNotification } from "@/hooks/useNotification";

const NotificationDropdown = ({ patientId }: { patientId: string; }) => {
    const [isOpen, setIsOpen] = useState(false);
    const {
        isLoading,
        error,
        notifications,
        clearNotifications,
    } = useNotification(patientId);

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <div className="flex mr-5">
            <button onClick={toggleDropdown} className="focus:outline-none">
                <Bell size={24}
                    className="text-gray-600 hover:text-gray-900"
                />
            </button>

            {isOpen && (
                <div className="absolute right-1 top-full w-64 bg-white border rounded-lg shadow-lg mt-2"
                    style={{ zIndex: 200 }}
                >
                    <div className="p-4">
                        <h4 className="text-gray-800 font-semibold">Notifications</h4>
                    </div>
                    <ul className="divide-y divide-gray-200">
                        {isLoading && <p>Loading...</p>}
                        {error && <p>Error: {error}</p>}
                        {notifications.length > 0 ? (
                            notifications.map((notification, index) => (
                                <li
                                    key={index}
                                    className="text-gray-800 p-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    {notification}
                                </li>
                            ))
                        ) : (
                            <li className="p-2 text-gray-500">Notification list is empty.</li>
                        )}
                    </ul>
                    <div className="p-2 text-center text-blue-500 hover:underline cursor-pointer">
                        <button onClick={clearNotifications}>Clear notifications</button>
                    </div>
                </div>
            )
            }
        </div >
    );
}

export default NotificationDropdown;
