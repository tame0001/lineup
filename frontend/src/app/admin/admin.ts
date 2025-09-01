import { Component } from '@angular/core';
import { PlayerCard } from './player-card/player-card';

@Component({
  selector: 'app-admin',
  imports: [PlayerCard],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {}
