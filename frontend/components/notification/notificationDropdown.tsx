import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    useEffect(() => {
        async function fetchNotifications() {
            try {
                const response = await fetch("/api/notifications");
                const data = await response.json();
                setNotifications(data);
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            }
        }
        fetchNotifications();
    }, []);

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
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <li
                                    key={notification.id}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    {notification.message}
                                </li>
                            ))
                        ) : (
                            <li className="p-2 text-gray-500">No notifications available.</li>
                        )}
                    </ul>
                    <div className="p-2 text-center text-blue-500 hover:underline cursor-pointer">
                        View All
                    </div>
                </div>
            )
            }
        </div >
    );
}

export default NotificationDropdown;
