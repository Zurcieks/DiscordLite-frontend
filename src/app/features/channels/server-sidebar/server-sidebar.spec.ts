import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerSidebar } from './server-sidebar';

describe('ServerSidebar', () => {
  let component: ServerSidebar;
  let fixture: ComponentFixture<ServerSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServerSidebar],
    }).compileComponents();

    fixture = TestBed.createComponent(ServerSidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
