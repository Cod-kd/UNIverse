export interface Post {
    id: number;
    creatorId: number;
    groupId: number;
    creditCount: number;
    description: string;
    imageUrl?: string;
    creatorName?: string;
    comments?: Comment[];
    hasImage?: boolean;
    showComments?: boolean;
}