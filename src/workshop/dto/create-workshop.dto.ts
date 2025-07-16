export class CreateWorkshopDto {
  name: string;
  description: string;
  category: string;
  date: string;
  time: string;
  isFree: boolean;
  price?: number;
  mentorName: string;
  userIds?: number[];
}
