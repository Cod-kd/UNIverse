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

interface ContactObj {
    contactTypeId: number,
    path: string
}

interface RoleObj {
    roleId: number,
}

interface InterestObj {
    categoryId: number
}

export interface Profile {
    userId: number;
    faculty: string;
    description: string;
    usersData: UsersData,
    contacts: ContactObj[],
    roles: RoleObj[],
    interests: InterestObj[]
}