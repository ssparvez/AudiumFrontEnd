import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistContentSongsComponent } from './artist-content-songs.component';

describe('ArtistContentSongsComponent', () => {
  let component: ArtistContentSongsComponent;
  let fixture: ComponentFixture<ArtistContentSongsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtistContentSongsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistContentSongsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
