import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWeek } from './add-week';

describe('AddWeek', () => {
  let component: AddWeek;
  let fixture: ComponentFixture<AddWeek>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddWeek]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWeek);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
