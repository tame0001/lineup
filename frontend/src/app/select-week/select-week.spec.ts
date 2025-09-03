import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectWeek } from './select-week';

describe('SelectWeek', () => {
  let component: SelectWeek;
  let fixture: ComponentFixture<SelectWeek>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectWeek]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectWeek);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
