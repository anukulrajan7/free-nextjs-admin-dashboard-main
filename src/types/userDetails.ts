export type UserProfile = {
    _id: string;
    number: number;
    name: string;
    email: string;
    balance: number;
    wishlist: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    profilePicture?: string; // optional field
};

export type UserProfiles = UserProfile[];