import { useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

const Navbar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const user = useSelector((state: RootState) => state.user.user);

    const [isOpen, setIsOpen] = useState(false);

    const dropdownItems = [
        {
            label: "Profile",
            action: () => navigate("/profile"),
        },
        {
            label: "Logout",
            action: logout,
        },
    ];

    const firstLetter = user?.email?.charAt(0).toUpperCase() || "U";

    // return (
    //     <div className="h-16 bg-white border-b flex items-center justify-between px-6">
    //         <h1 className="text-lg font-semibold text-neutral-800">
    //             {user?.email || "User"}
    //         </h1>

    //         <div className="flex items-center gap-3">

    //             <button
    //                 onClick={() => navigate("/profile")}
    //                 className="bg-neutral-800 hover:bg-neutral-900 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
    //             >
    //                 Profile
    //             </button>

    //             <button
    //                 onClick={logout}
    //                 className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
    //             >
    //                 Logout
    //             </button>

    //         </div>
    //     </div>
    // );

    return (
        <div className="h-16 bg-white border-b flex items-center justify-between px-6">
            <h1 className="text-lg font-semibold text-neutral-800">
                {user?.email || "User"}
            </h1>
            <div className="relative">
                {/* User Circle */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-10 h-10 rounded-full bg-neutral-800 text-white flex items-center justify-center font-semibold"
                >
                    {firstLetter}
                </button>

                {/* Dropdown */}
                {isOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg py-1 z-50">
                        {dropdownItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => {
                                    item.action();
                                    setIsOpen(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;