import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getFavouriteUsers = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user!.sub;

        // const favouriteUsers = await prisma.$queryRaw<
        //     {
        //         id: string;
        //         email: string;
        //         role: string;
        //         department: string;
        //         experienceLevel: string;
        //         teamName: string | null;
        //     }[]
        // >`
        //     SELECT
        //         u.id,
        //         u.email,
        //         u.role,
        //         u.department,
        //         u."experienceLevel",
        //         u."teamName"
        //     FROM "FavouriteUser" f
        //     INNER JOIN "User" u
        //         ON u.id = f."favouriteUserId"
        //     WHERE f."userId" = ${userId}
        //     ORDER BY f."createdAt" DESC
        // `;

        // res.json({
        //     users: favouriteUsers,
        // });

        // First get the IDs of the users that I have favorited
        const favourites = await prisma.favouriteUser.findMany({
            where: {
                userId,
            },
            select: {
                favouriteUserId: true,
            },
        });

        const favouriteUserIds = favourites.map(
            (favourite) => favourite.favouriteUserId
        );

        // Then get the actual users
        const users = await prisma.user.findMany({
            where: {
                id: {
                    in: favouriteUserIds,
                },
            },
        });

        res.json({
            users,
        });

    } catch (error) {
        console.error("Get favourite users error:", error);

        res.status(500).json({
            message: "Failed to load favourite users",
        });
    }
};


export const addFavouriteUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user!.sub;
        const { favouriteUserId } = req.body;

        if (!favouriteUserId) {
            res.status(400).json({
                message: "favouriteUserId is required",
            });

            return;
        }

        if (userId === favouriteUserId) {
            res.status(400).json({
                message: "You cannot favourite yourself",
            });

            return;
        }

        await prisma.favouriteUser.create({
            data: {
                userId,
                favouriteUserId,
            },
        });

        res.status(201).json({
            message: "User added to favourites",
        });
    } catch (error) {
        console.error("Add favourite user error:", error);

        res.status(500).json({
            message: "Failed to add favourite user",
        });
    }
};


export const removeFavouriteUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user!.sub;
        const { favouriteUserId } = req.params;

        await prisma.favouriteUser.delete({
            where: {
                userId_favouriteUserId: {
                    userId,
                    favouriteUserId,
                },
            },
        });

        res.json({
            message: "User removed from favourites",
        });
    } catch (error) {
        console.error("Remove favourite user error:", error);

        res.status(500).json({
            message: "Failed to remove favourite user",
        });
    }
};