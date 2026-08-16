import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelsMePage } from './channels-me-page';

describe('ChannelsMePage', () => {
  let component: ChannelsMePage;
  let fixture: ComponentFixture<ChannelsMePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelsMePage],
    }).compileComponents();

    fixture = TestBed.createComponent(ChannelsMePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
