export interface UsersData {
    userId: number,
    name: string,
    gender: boolean | null,
    birthDate: string,
    universityName: string,
    profilePictureExtension: string,
    followerCount: number,
    followedCount: number
}

export interface Profile {
    userId: number;
    faculty: string;
    description: string;
    usersData: UsersData,
    contacts: string[],
    roles: string[],
    interests: string[]
}