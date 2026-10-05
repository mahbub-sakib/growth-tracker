import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { setUser } from "@/store/userSlice";
import api from "@/lib/Api";

const Profile = () => {
    const dispatch = useDispatch<AppDispatch>();

    const user = useSelector((state: RootState) => state.user.user);

    const [email, setEmail] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get("/auth/me");

                dispatch(setUser(response.data.user));
            } catch (error) {
                console.error("Failed to load user:", error);
            }
        };

        fetchUser();
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            setEmail(user.email);
        }
    }, [user]);

    const handleEdit = () => {
        setError("");
        setEmail(user?.email ?? "");
        setIsEditing(true);
    };

    const handleCancel = () => {
        setEmail(user.email);
        setIsEditing(false);
    };

    const handleSave = async () => {
        if (!email.trim()) {
            setError("Email is required");
            return;
        }
        try {
            setIsSaving(true);
            setError("");

            const response = await api.post("/auth/update", {
                email: email.trim(),
            });

            dispatch(setUser(response.data.user));

            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update profile:", error);
            setError(
                error.response?.data?.message ||
                "Failed to update email"
            );
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
                        Email
                    </p>

                    {isEditing ? (
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                        <div className="flex gap-2">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold px-4 py-2 rounded-lg"
                            >
                                {isSaving ? "Saving..." : "Save"}
                            </button>

                            <button
                                onClick={handleCancel}
                                disabled={isSaving}
                                className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-semibold px-4 py-2 rounded-lg"
                            >
                                Cancel
                            </button>
                        </div>
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




    // return (
    //     <div className="p-6">
    //         <h1 className="text-2xl font-semibold mb-6">
    //             Profile
    //         </h1>

    //         <div className="max-w-md">
    //             <label className="block text-sm font-medium text-neutral-600 mb-2">
    //                 Email
    //             </label>

    //             {isEditing ? (
    //                 <>
    //                     <input
    //                         type="email"
    //                         value={email}
    //                         onChange={(e) => setEmail(e.target.value)}
    //                         className="w-full border rounded-lg px-3 py-2"
    //                     />

    //                     {error && (
    //                         <p className="text-sm text-red-500 mt-2">
    //                             {error}
    //                         </p>
    //                     )}

    //                     <div className="flex gap-2 mt-4">
    //                         <button
    //                             onClick={handleSave}
    //                             disabled={isSaving}
    //                             className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg"
    //                         >
    //                             {isSaving ? "Saving..." : "Save"}
    //                         </button>

    //                         <button
    //                             onClick={() => setIsEditing(false)}
    //                             disabled={isSaving}
    //                             className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800 px-4 py-2 rounded-lg"
    //                         >
    //                             Cancel
    //                         </button>
    //                     </div>
    //                 </>
    //             ) : (
    //                 <>
    //                     <p className="text-lg text-neutral-800">
    //                         {user.email}
    //                     </p>

    //                     <button
    //                         onClick={handleEdit}
    //                         className="mt-4 bg-neutral-800 hover:bg-neutral-900 text-white px-4 py-2 rounded-lg"
    //                     >
    //                         Edit
    //                     </button>
    //                 </>
    //             )}
    //         </div>
    //     </div>
    // );
};

export default Profile;