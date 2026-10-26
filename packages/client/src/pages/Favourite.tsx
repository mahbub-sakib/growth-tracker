import { useEffect, useState } from "react";
import api from "../lib/Api";

interface User {
    id: string;
    email: string;
    role: string;
    department: string;
    experienceLevel: string;
    teamName?: string;
}

const Favourite = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchFavouriteUsers = async () => {
            try {
                const response = await api.get("/favourite-users");

                setUsers(response.data.users);
            } catch (error) {
                console.error("Failed to load favourite users:", error);
                setError("Failed to load favourite users");
            } finally {
                setIsLoading(false);
            }
        };

        fetchFavouriteUsers();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">
                Favourite Users
            </h1>

            {isLoading && (
                <p className="text-neutral-600">
                    Loading favourite users...
                </p>
            )}

            {error && (
                <p className="text-red-500">
                    {error}
                </p>
            )}

            {!isLoading && !error && users.length === 0 && (
                <p className="text-neutral-600">
                    You have no favourite users.
                </p>
            )}

            {!isLoading && !error && users.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b text-left">
                                <th className="px-6 py-3">
                                    Email
                                </th>
                                <th className="px-6 py-3">
                                    Role
                                </th>
                                <th className="px-6 py-3">
                                    Department
                                </th>
                                <th className="px-6 py-3">
                                    Experience
                                </th>
                                <th className="px-6 py-3">
                                    Team
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-b"
                                >
                                    <td className="px-6 py-4">
                                        {user.email}
                                    </td>

                                    <td className="px-6 py-4">
                                        {user.role}
                                    </td>

                                    <td className="px-6 py-4">
                                        {user.department}
                                    </td>

                                    <td className="px-6 py-4">
                                        {user.experienceLevel}
                                    </td>

                                    <td className="px-6 py-4">
                                        {user.teamName || "-"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Favourite;