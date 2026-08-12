import React from 'react';
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
    const { logout } = useAuth();
    return (
        <div className="h-16 bg-white border-b flex items-center justify-between px-6">
            <h1 className="text-lg font-semibold text-neutral-800">
                Nav Items
            </h1>

            <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
                Logout
            </button>
        </div>
    );
};

export default Navbar;