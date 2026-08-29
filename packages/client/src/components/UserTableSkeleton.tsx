import React from 'react';

interface UserTableSkeletonProps { rows?: number; }

const UserTableSkeleton = ({ rows = 10 }: UserTableSkeletonProps) => {
    return (
        <>
            {Array.from({ length: rows }).map((_, index) => (
                <tr key={index}>
                    <td className="px-6 py-4 text-sm">
                        <div className="h-4 w-48 bg-neutral-200 rounded animate-pulse" />
                    </td>

                    <td className="px-6 py-4 text-sm">
                        <div className="h-4 w-20 bg-neutral-200 rounded animate-pulse" />
                    </td>

                    <td className="px-6 py-4 text-sm">
                        <div className="h-4 w-32 bg-neutral-200 rounded animate-pulse" />
                    </td>

                    <td className="px-6 py-4 text-sm">
                        <div className="h-4 w-24 bg-neutral-200 rounded animate-pulse" />
                    </td>

                    <td className="px-6 py-4 text-sm">
                        <div className="h-4 w-28 bg-neutral-200 rounded animate-pulse" />
                    </td>

                </tr>
            ))}
        </>);
};

export default UserTableSkeleton;