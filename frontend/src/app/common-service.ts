import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private breakpointObserver = inject(BreakpointObserver);

  private isHandsetState = toSignal(
    this.breakpointObserver.observe(Breakpoints.Handset),
  );

  public isHandsetSignal = computed(
    () => this.isHandsetState()?.matches ?? false,
  );
}
