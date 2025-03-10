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
    userId: number,
    contactTypeId: number,
    path: string
}

interface RoleObj {
    userId: number,
    roleId: number,
}

interface InterestObj {
    userId: number,
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