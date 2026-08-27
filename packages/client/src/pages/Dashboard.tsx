import { useEffect, useState } from 'react';
import api from "../lib/Api";
import { useQuery } from '@tanstack/react-query';

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
    // const [users, setUsers] = useState<User[]>([]);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState('');

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // const [total, setTotal] = useState(0);
    // const [totalPages, setTotalPages] = useState(0);

    // useEffect(() => {
    //     const fetchUsers = async () => {
    //         try {
    //             setLoading(true);
    //             setError('');

    //             const response = await api.get<UsersResponse>('/users', {
    //                 params: {
    //                     page,
    //                     pageSize,
    //                 },
    //             });

    //             setUsers(response.data.users);

    //             setTotal(response.data.pagination.total);
    //             setTotalPages(response.data.pagination.totalPages);

    //             console.log(response);
    //         } catch (error) {
    //             console.error('Failed to fetch users:', error);
    //             setError('Failed to load users.');
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchUsers();
    // }, [page, pageSize]);

    const {
        data,
        isLoading,
        isFetching,
        isError,
    } = useQuery({
        queryKey: ['users', page, pageSize],

        queryFn: async () => {
            const response = await api.get<UsersResponse>('/users', {
                params: {
                    page,
                    pageSize,
                },
            });

            return response.data;
        },

        staleTime: 5 * 60 * 1000,
    });

    const users = data?.users ?? [];
    const total = data?.pagination.total ?? 0;
    const totalPages = data?.pagination.totalPages ?? 0;

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

            {isLoading && (
                <p className="text-neutral-600">
                    Loading users...
                </p>
            )}

            {isError && (
                <p className="text-red-500">
                    {isError}
                </p>
            )}

            {!isLoading && !isError && (
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

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-4 py-3 border-t">
                        {/* Left side */}
                        <div className="text-sm text-neutral-600">
                            Page {page} of {totalPages} ({total} users)
                        </div>

                        {/* Right side */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-neutral-600">
                                Rows per page
                            </span>

                            <select
                                value={pageSize}
                                onChange={(event) => {
                                    setPageSize(Number(event.target.value));
                                    setPage(1);
                                }}
                                className="border rounded-md px-2 py-1 text-sm bg-white"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>

                            <button
                                onClick={() => setPage(1)}
                                disabled={page === 1}
                                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                First
                            </button>

                            <button
                                onClick={() => setPage((prev) => prev - 1)}
                                disabled={page === 1}
                                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>

                            {Array.from(
                                {
                                    length: Math.min(5, totalPages),
                                },
                                (_, index) => {
                                    let pageNumber;

                                    if (totalPages <= 5) {
                                        pageNumber = index + 1;
                                    } else if (page <= 3) {
                                        pageNumber = index + 1;
                                    } else if (page >= totalPages - 2) {
                                        pageNumber = totalPages - 4 + index;
                                    } else {
                                        pageNumber = page - 2 + index;
                                    }

                                    return (
                                        <button
                                            key={pageNumber}
                                            onClick={() => setPage(pageNumber)}
                                            className={`px-3 py-1 border rounded-md text-sm ${pageNumber === page
                                                ? 'bg-neutral-800 text-white'
                                                : 'bg-white text-neutral-700 hover:bg-neutral-50'
                                                }`}
                                        >
                                            {pageNumber}
                                        </button>
                                    );
                                }
                            )}

                            <button
                                onClick={() => setPage((prev) => prev + 1)}
                                disabled={page === totalPages}
                                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>

                            <button
                                onClick={() => setPage(totalPages)}
                                disabled={page === totalPages}
                                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Last
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;