import User from "../models/user.model.js";
import createError from "../utils/createError.js";

export const getNewReleases = async (req, res, next) => {
    const { latestDate } = req.query;
    const latestReleases = await SportCard.find({
        createdAt: { $gte: latestDate }
    });
    res.json(latestReleases);
};

export const deleteUser = async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (req.userId !== user._id.toString()) {
        return next(createError(403, "You can delete only your account!"));
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).send("deleted.");
};

export const getUser = async (req, res, next) => {
    const user = await User.findById(req.params.id);
    const { password, ...info } = user._doc;
    res.status(200).send(info);
};

export const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { username, email, country, phone } = req.body;

        const user = await User.findById(id); // Find user by ID using findById

        if (!user) {
            return next(createError(404, "User not found")); // Handle user not found case
        }
        // console.log(req.userId + " " + user._id)
        if (req.userId !== user._id.toString()) {
            return next(createError(403, "You can update only your account!"));
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { username, email, country, phone },
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};
