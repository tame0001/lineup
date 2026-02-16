import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerAdmin } from './player-admin';

describe('PlayerAdmin', () => {
  let component: PlayerAdmin;
  let fixture: ComponentFixture<PlayerAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
