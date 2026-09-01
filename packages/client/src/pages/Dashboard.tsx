import { useEffect, useState } from 'react';
import api from "../lib/Api";
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import UserTableSkeleton from '../components/UserTableSkeleton';

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

    const [page, setPage] = useState(() => {
        const savedPage = localStorage.getItem('usersPage');
        return savedPage ? Number(savedPage) : 1;
    });

    const [pageSize, setPageSize] = useState(() => {
        const savedPageSize = localStorage.getItem('usersPageSize');
        return savedPageSize ? Number(savedPageSize) : 10;
    });

    // Search input 
    const [search, setSearch] = useState('');

    // Debounced search value 
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        localStorage.setItem('usersPage', String(page));
        localStorage.setItem('usersPageSize', String(pageSize));
    }, [page, pageSize]);

    // Debounce search by 500ms 
    useEffect(() => {
        const timer = setTimeout(() => {
            const trimmedSearch = search.trim();

            setDebouncedSearch(trimmedSearch);

            if (trimmedSearch !== debouncedSearch) {
                setPage(1);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);


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
        queryKey: ['users', page, pageSize, debouncedSearch],

        queryFn: async () => {
            const response = await api.get<UsersResponse>('/users', {
                params: {
                    page,
                    pageSize,
                    ...(debouncedSearch && {
                        search: debouncedSearch,
                    }),
                },
            });
            console.log(response);
            return response.data;
        },
        placeholderData: keepPreviousData,

        staleTime: 1 * 60 * 1000,
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

            {/* Search */}
            <div className="mb-4">
                <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by email or team name..."
                    className="w-full max-w-md border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300" />
            </div>

            {isFetching && (
                <p className="text-sm text-neutral-500 mb-2">
                    Fetching users...
                </p>
            )}

            {/* {isLoading && (
                <p className="text-neutral-600">
                    Loading users...
                </p>
            )} */}

            {isError && (
                <p className="text-red-500">
                    Failed to load users.
                </p>
            )}

            {!isError && (
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
                            {isLoading ? (
                                <UserTableSkeleton rows={pageSize} />
                            ) : (
                                users.map((user) => (
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
                                ))
                            )}
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