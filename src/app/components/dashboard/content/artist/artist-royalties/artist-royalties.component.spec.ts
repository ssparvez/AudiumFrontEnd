import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistRoyaltiesComponent } from './artist-royalties.component';

describe('ArtistRoyaltiesComponent', () => {
  let component: ArtistRoyaltiesComponent;
  let fixture: ComponentFixture<ArtistRoyaltiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtistRoyaltiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistRoyaltiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
