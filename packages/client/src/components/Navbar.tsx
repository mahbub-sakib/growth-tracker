import React from 'react';
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

const Navbar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const user = useSelector((state: RootState) => state.user.user);

    return (
        <div className="h-16 bg-white border-b flex items-center justify-between px-6">
            <h1 className="text-lg font-semibold text-neutral-800">
                {user?.email || "User"}
            </h1>

            <div className="flex items-center gap-3">

                <button
                    onClick={() => navigate("/profile")}
                    className="bg-neutral-800 hover:bg-neutral-900 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
                >
                    Profile
                </button>

                <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
                >
                    Logout
                </button>

            </div>
        </div>
    );
};

export default Navbar;