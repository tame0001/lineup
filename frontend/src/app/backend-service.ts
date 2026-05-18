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

  createWeek(date: Date): Observable<MatchDay> {
    return this._http.post<MatchDay>(`${this._baseUrl}/weeks`, { date: date });
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

  getWeekDetails(weekId: number): Observable<MatchDay> {
    return this._http.get<MatchDay>(`${this._baseUrl}/weeks/${weekId}`);
  }

  changePlayerPaidStatus(userId: number, isPaid: boolean): Observable<Player> {
    return this._http.patch<Player>(`${this._baseUrl}/users/${userId}`, {
      is_paid: isPaid,
    });
  }

  changePlayerActiveStatus(
    userId: number,
    details: {
      activeSinceDate?: Date;
      inactiveSinceDate?: Date;
    },
  ): Observable<Player> {
    // Map the details to the expected format for the backend
    const payload = {
      active_since: details.activeSinceDate,
      inactive_since: details.inactiveSinceDate,
    };
    // Check if payload has at least one of the properties set to a non-undefined value before making the request
    if (Object.values(payload).every((value) => value === undefined)) {
      throw new Error(
        'At least one of activeSinceDate or inactiveSinceDate must be provided',
      );
    }
    return this._http.patch<Player>(
      `${this._baseUrl}/users/${userId}`,
      payload,
    );
  }
}
