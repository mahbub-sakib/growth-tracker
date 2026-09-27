import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { setUser } from "@/store/userSlice";
import api from "@/lib/Api";

const Profile = () => {
    const dispatch = useDispatch<AppDispatch>();

    const user = useSelector((state: RootState) => state.user.user);

    const [name, setName] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get("/auth/me");

                dispatch(setUser(response.data.user));
                setName(response.data.user.name ?? "");
            } catch (error) {
                console.error("Failed to load profile:", error);
            }
        };

        fetchUser();
    }, [dispatch]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);

            const response = await api.post("/auth/update", {
                name,
            });

            dispatch(setUser(response.data.user));

            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update profile:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) {
        return <p>Loading profile...</p>;
    }

    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-neutral-800 mb-6">
                Profile
            </h1>

            <div className="bg-white border rounded-lg p-6 space-y-5">

                <div>
                    <p className="text-sm text-neutral-500">
                        Name
                    </p>

                    {isEditing ? (
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 w-full border rounded-lg px-3 py-2"
                        />
                    ) : (
                        <p className="mt-1 text-neutral-800">
                            {user.email || "Not set"}
                        </p>
                    )}
                </div>

                <div>
                    <p className="text-sm text-neutral-500">
                        Email
                    </p>

                    <p className="mt-1 text-neutral-800">
                        {user.email}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-neutral-500">
                        Role
                    </p>

                    <p className="mt-1 text-neutral-800">
                        {user.role}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-neutral-500">
                        Department
                    </p>

                    <p className="mt-1 text-neutral-800">
                        {user.department}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-neutral-500">
                        Experience Level
                    </p>

                    <p className="mt-1 text-neutral-800">
                        {user.experienceLevel}
                    </p>
                </div>

                <div className="pt-2">
                    {isEditing ? (
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold px-4 py-2 rounded-lg"
                        >
                            {isSaving ? "Saving..." : "Save"}
                        </button>
                    ) : (
                        <button
                            onClick={handleEdit}
                            className="bg-neutral-800 hover:bg-neutral-900 text-white font-semibold px-4 py-2 rounded-lg"
                        >
                            Edit
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;