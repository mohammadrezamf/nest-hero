export interface GeneralCounselingTimes {
  id: string;
  day: string;
  time: {
    booked: boolean;
    active: boolean;
    clock: string;
  }[];
}
