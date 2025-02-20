export interface Group {
  id: number;
  name: string;
  isPublic: boolean;
  membersCount: number;
  postCount: number;
  actualEventCount: number;
  allEventCount: number;
}