import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Player, RSVP, MatchDay } from './data-interface';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private _http = inject(HttpClient);
  private _baseUrl = 'http://localhost:8000';

  getPlayers(): Observable<Player[]> {
    return this._http.get<Player[]>(`${this._baseUrl}/users`);
  }

  getPlayer(playerId: number): Observable<Player> {
    return this._http.get<Player>(`${this._baseUrl}/users/${playerId}`);
  }

  getWeekRSVPs(weekId: number): Observable<RSVP[]> {
    return this._http.get<RSVP[]>(`${this._baseUrl}/rsvp/${weekId}`);
  }

  getPlayerRSVP(userId: number, weekId: number): Observable<RSVP> {
    return this._http.get<RSVP>(`${this._baseUrl}/rsvp/${weekId}/${userId}`);
  }

  postPlayerRSVP(rsvp: RSVP): Observable<RSVP> {
    return this._http.post<RSVP>(`${this._baseUrl}/rsvp`, rsvp);
  }

  getMatchDays(): Observable<MatchDay[]> {
    return this._http.get<MatchDay[]>(`${this._baseUrl}/weeks`);
  }
  markPlayerPaidStatus(userId: number, isPaid: boolean): Observable<Player> {
    return this._http.patch<Player>(`${this._baseUrl}/users/${userId}`, {
      is_paid: isPaid,
    });
  }

  changePlayerActiveStatus(
    userId: number,
    isActive: boolean,
  ): Observable<Player> {
    return this._http.patch<Player>(`${this._baseUrl}/users/${userId}`, {
      is_active: isActive,
    });
  }
}
