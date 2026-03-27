export interface Player {
  name: string;
  id: number;
  is_paid: boolean;
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
