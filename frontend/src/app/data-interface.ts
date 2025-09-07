export interface Player {
  name: string;
  id: number;
}

export interface RSVP {
  user_id: number;
  week_id: number;
  status: boolean;
}

export interface MatchDay {
  id: number;
  date: string;
}
