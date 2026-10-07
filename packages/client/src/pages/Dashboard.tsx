import { useEffect, useState } from 'react';
import api from "../lib/Api";
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import UserTableSkeleton from '../components/UserTableSkeleton';
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import {
    setFavouriteUsers,
    addFavouriteUser,
    removeFavouriteUser,
} from "../store/favouriteUsersSlice";

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

    const dispatch = useDispatch<AppDispatch>();

    const favouriteUserIds = useSelector(
        (state: RootState) =>
            state.favouriteUsers.favouriteUserIds
    );

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
    const [role, setRole] = useState('');
    const [department, setDepartment] = useState('');
    const [experienceLevel, setExperienceLevel] = useState('');

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


    useEffect(() => {
        const fetchFavouriteUsers = async () => {
            try {
                const response = await api.get("/favourite-users");

                const favouriteIds = response.data.users.map(
                    (user: User) => user.id
                );

                dispatch(setFavouriteUsers(favouriteIds));
            } catch (error) {
                console.error(
                    "Failed to load favourite users:",
                    error
                );
            }
        };

        fetchFavouriteUsers();
    }, [dispatch]);

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
        isPending,
        isFetching,
        status,
        isError,
    } = useQuery({
        queryKey: ['users', page, pageSize, debouncedSearch, role, department, experienceLevel],

        queryFn: async () => {
            const response = await api.get<UsersResponse>('/users', {
                params: {
                    page,
                    pageSize,
                    ...(debouncedSearch && {
                        search: debouncedSearch,
                    }),
                    ...(role && { role, }),
                    ...(department && { department, }),
                    ...(experienceLevel && { experienceLevel, }),
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

    const handleClearFilters = () => {
        setSearch('');
        setRole('');
        setDepartment('');
        setExperienceLevel('');
        setPage(1);
    };
    const hasFilters = search.trim() !== '' || role !== '' || department !== '' || experienceLevel !== '';

    const handleFavouriteToggle = async (userId: string) => {
        const isFavourite =
            favouriteUserIds.includes(userId);

        try {
            if (isFavourite) {
                await api.delete(
                    `/favourite-users/${userId}`
                );

                dispatch(removeFavouriteUser(userId));
            } else {
                await api.post("/favourite-users", {
                    favouriteUserId: userId,
                });

                dispatch(addFavouriteUser(userId));
            }
        } catch (error) {
            console.error(
                "Failed to update favourite user:",
                error
            );
        }
    };

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
            <div className="bg-white border rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="lg:col-span-4">
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                            Search
                        </label>
                        <input
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search by email or team name..."
                            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300" />
                    </div>
                    {/* Role */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                            Role
                        </label>
                        <select
                            value={role}
                            onChange={(event) => {
                                setRole(event.target.value);
                                setPage(1);
                            }}
                            className="w-full border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-neutral-300" >
                            <option value="">All Roles</option>
                            <option value="LEARNER">LEARNER</option>
                            <option value="MANAGER">MANAGER</option>
                        </select>
                    </div>
                    {/* Department */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                            Department
                        </label>
                        <select
                            value={department}
                            onChange={(event) => {
                                setDepartment(event.target.value);
                                setPage(1);
                            }}
                            className="w-full border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-neutral-300" >
                            <option value="">All Departments</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Product">Product</option>
                            <option value="Design">Design</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Operations">Operations</option>
                            <option value="HR">HR</option>
                            <option value="Other">Other</option>
                        </select> </div>
                    {/* Experience Level */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                            Experience Level
                        </label>
                        <select
                            value={experienceLevel}
                            onChange={(event) => {
                                setExperienceLevel(event.target.value);
                                setPage(1);
                            }}
                            className="w-full border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-neutral-300" >
                            <option value="">All Levels</option>
                            <option value="JUNIOR">JUNIOR</option>
                            <option value="MID">MID</option>
                            <option value="SENIOR">SENIOR</option>
                        </select> </div>
                    {/* Clear Filters */}
                    <div className="flex items-end">
                        <button
                            onClick={handleClearFilters}
                            disabled={!hasFilters}
                            className="w-full border rounded-md px-3 py-2 text-sm text-neutral-700 bg-white hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed" >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {isFetching && (
                <p className="text-sm text-neutral-500 mb-2 bg-green-500">
                    Fetching users...
                </p>
            )}

            {isPending && (
                <p className="text-neutral-600 bg-red-500">
                    Pending users...
                    <span>testing</span>
                </p>

            )}

            {isError && (
                <p className="text-red-500">
                    Failed to load users.
                </p>
            )}

            <p className="text-orange-500">
                Current status: {status}
            </p>

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
                                <th className="px-6 py-3 text-sm font-medium">
                                    Favorite
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {isLoading ? (
                                <UserTableSkeleton rows={pageSize} />
                            ) : users.length > 0 ? (
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
                                        <td className="px-6 py-4 text-sm">
                                            <button
                                                onClick={() => handleFavouriteToggle(user.id)}
                                                className="text-xl"
                                                title={
                                                    favouriteUserIds.includes(user.id)
                                                        ? "Remove from favorites"
                                                        : "Add to favorites"
                                                }
                                            >
                                                {favouriteUserIds.includes(user.id) ? "★" : "☆"}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-8 text-center text-sm text-neutral-500" >
                                        No users found.
                                    </td>
                                </tr>
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
                                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                First
                            </button>

                            <button
                                onClick={() => setPage((prev) => prev - 1)}
                                disabled={page === 1}
                                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                                            className={`px-3 py-1 border rounded-md text-sm cursor-pointer ${pageNumber === page
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
                                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                Next
                            </button>

                            <button
                                onClick={() => setPage(totalPages)}
                                disabled={page === totalPages}
                                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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