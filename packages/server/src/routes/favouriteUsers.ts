import { Router } from "express";

import {
    getFavouriteUsers,
    addFavouriteUser,
    removeFavouriteUser,
} from "../controllers/favouriteUsers";

import { requireAuth } from "../middleware/requireAuth";

export const favouriteUsersRouter = Router();

favouriteUsersRouter.get(
    "/",
    requireAuth,
    getFavouriteUsers
);

favouriteUsersRouter.post(
    "/",
    requireAuth,
    addFavouriteUser
);

favouriteUsersRouter.delete(
    "/:favouriteUserId",
    requireAuth,
    removeFavouriteUser
);