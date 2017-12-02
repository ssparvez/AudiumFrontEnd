import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistSidenavComponent } from './artist-sidenav.component';

describe('ArtistSidenavComponent', () => {
  let component: ArtistSidenavComponent;
  let fixture: ComponentFixture<ArtistSidenavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtistSidenavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
