import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Player } from './data-interface';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private _http = inject(HttpClient);
  private _baseUrl = 'http://localhost:8000';

  getPlayers(): Observable<Player[]> {
    return this._http.get<Player[]>(`${this._baseUrl}/users`);
  }
}
