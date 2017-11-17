import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistDropdownComponent } from './playlist-dropdown.component';

describe('PlaylistDropdownComponent', () => {
  let component: PlaylistDropdownComponent;
  let fixture: ComponentFixture<PlaylistDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
