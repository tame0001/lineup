export interface Player {
  name: string;
  id: number;
  is_paid: boolean;
  is_active: boolean;
  active_since: Date | null;
  inactive_since: Date | null;
  is_admin: boolean;
}

export interface RSVP {
  user_id: number;
  week_id: number;
  status: boolean;
}

export interface MatchDay {
  id: number;
  date: Date;
}
