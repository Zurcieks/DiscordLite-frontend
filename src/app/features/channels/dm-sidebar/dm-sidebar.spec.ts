import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmSidebar } from './dm-sidebar';

describe('DmSidebar', () => {
  let component: DmSidebar;
  let fixture: ComponentFixture<DmSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DmSidebar],
    }).compileComponents();

    fixture = TestBed.createComponent(DmSidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
