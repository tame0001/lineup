export interface Player {
  name: string;
  id: number;
  is_paid: boolean;
  is_active: boolean;
  active_since: string | null;
  inactive_since: string | null;
  is_admin: boolean;
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
