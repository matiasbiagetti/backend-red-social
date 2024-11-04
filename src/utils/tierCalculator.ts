import userRepository from "../repositories/userRepository";

export default async function updateTier(userId: string): Promise<"bronze" | "silver" | "gold" | "platinum"> {
    const user = await userRepository.findUserById(userId);
    if (user) {
        const { posts, comments } = user;
        if (posts.length === 0) {
            return "bronze";
        } else if (posts.length >= 2 && posts.length < 4) {
            return "silver";
        } else if (posts.length >= 4 && comments.length < 4) {
            return "gold";
        } else if (posts.length >= 4 && comments.length >= 4) {
            return "platinum";
        }
    }
    return "bronze";
}