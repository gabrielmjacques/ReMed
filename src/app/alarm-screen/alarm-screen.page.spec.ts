import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlarmScreenPage } from './alarm-screen.page';

describe('AlarmScreenPage', () => {
  let component: AlarmScreenPage;
  let fixture: ComponentFixture<AlarmScreenPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmScreenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
