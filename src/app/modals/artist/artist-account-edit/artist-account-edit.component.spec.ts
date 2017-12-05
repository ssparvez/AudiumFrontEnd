import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistAccountEditComponent } from './artist-account-edit.component';

describe('ArtistAccountEditComponent', () => {
  let component: ArtistAccountEditComponent;
  let fixture: ComponentFixture<ArtistAccountEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtistAccountEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistAccountEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
