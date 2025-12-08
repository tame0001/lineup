import { Component, inject, signal } from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { BackendService } from '../../backend-service';
import { Player } from '../../data-interface';

@Component({
  selector: 'app-fee',
  imports: [CdkDrag, CdkDropList, CdkDropListGroup],
  templateUrl: './fee.html',
  styleUrl: './fee.scss',
})
export class Fee {
  paid = signal<Player[]>([]); // Names of players who have paid
  unpaid = signal<Player[]>([]); // Names of unpaid players
  private _backend = inject(BackendService);

  constructor() {
    // Fetch players from backend at the start of the component's lifecycle
    this._backend.getPlayers().subscribe((players) => {
      // Sort players alphabetically
      players = players.sort((a, b) => a.name.localeCompare(b.name));
      // For each player, if is_paid is true, add to paid list
      this.paid.set(players.filter((player) => player.is_paid));
      // And remove from players list
      this.unpaid.set(players.filter((player) => !player.is_paid));
    });
  }

  drop(event: CdkDragDrop<Player[]>) {
    // Handle drag and drop events
    // Extract which player is being moved
    const player = event.previousContainer.data[event.previousIndex];
    // If the item is dropped in the paid list
    const isPaid = event.container.data === this.paid();
    // Update backend to mark player as paid or unpaid
    this._backend.markPlayerPaidStatus(player.id, isPaid).subscribe(() => {
      console.log(`Marked ${player.name} as ${isPaid ? 'paid' : 'unpaid'}`);
    });
    // Handle moving items within the same list or between lists
    // From example in Angular documentation
    if (event.previousContainer !== event.container) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    // Sort paid and unpaid lists alphabetically after drop
    this.paid.set(this.paid().sort((a, b) => a.name.localeCompare(b.name)));
    this.unpaid.set(this.unpaid().sort((a, b) => a.name.localeCompare(b.name)));
  }
}
