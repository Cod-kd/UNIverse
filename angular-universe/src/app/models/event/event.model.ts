export interface Event {
    id: number;
    name: string;
    creatorId: number;
    startDate: string;
    endDate: string;
    place: string;
    attachmentRelPath: string;
    description: string;
    participantsCount: number;
    interestedUsersCount: number;
    isActual: boolean;
}