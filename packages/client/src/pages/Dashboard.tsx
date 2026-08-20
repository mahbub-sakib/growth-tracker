import { useEffect, useState } from 'react';
import api from "../lib/Api";

interface User {
    id: string;
    email: string;
    role: string;
    department: string;
    experienceLevel: string;
    teamName: string;
    bio: string;
    birthdate: string;
    createdAt: string;
}

interface UsersResponse {
    users: User[];
    pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
}

const Dashboard = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get<UsersResponse>('/users');

                setUsers(response.data.users);
                console.log(response);
            } catch (error) {
                console.error('Failed to fetch users:', error);
                setError('Failed to load users.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-neutral-800">
                    Dashboard
                </h1>

                <p className="text-sm text-neutral-500 mt-1">
                    Overview of users
                </p>
            </div>

            {loading && (
                <p className="text-neutral-600">
                    Loading users...
                </p>
            )}

            {error && (
                <p className="text-red-500">
                    {error}
                </p>
            )}

            {!loading && !error && (
                <div className="bg-white border rounded-lg overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-neutral-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-sm font-medium">
                                    Email
                                </th>

                                <th className="px-6 py-3 text-sm font-medium">
                                    Role
                                </th>

                                <th className="px-6 py-3 text-sm font-medium">
                                    Department
                                </th>

                                <th className="px-6 py-3 text-sm font-medium">
                                    Experience
                                </th>

                                <th className="px-6 py-3 text-sm font-medium">
                                    Team
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 text-sm">
                                        {user.email}
                                    </td>

                                    <td className="px-6 py-4 text-sm">
                                        {user.role}
                                    </td>

                                    <td className="px-6 py-4 text-sm">
                                        {user.department}
                                    </td>

                                    <td className="px-6 py-4 text-sm">
                                        {user.experienceLevel}
                                    </td>

                                    <td className="px-6 py-4 text-sm">
                                        {user.teamName}
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

export default Dashboard;