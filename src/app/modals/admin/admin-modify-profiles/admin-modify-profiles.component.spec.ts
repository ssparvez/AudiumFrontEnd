import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminModifyProfilesComponent } from './admin-modify-profiles.component';

describe('AdminModifyProfilesComponent', () => {
  let component: AdminModifyProfilesComponent;
  let fixture: ComponentFixture<AdminModifyProfilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminModifyProfilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminModifyProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
