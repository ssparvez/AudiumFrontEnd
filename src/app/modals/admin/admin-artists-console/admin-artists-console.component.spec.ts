import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminArtistsConsoleComponent } from './admin-artists-console.component';

describe('AdminArtistsConsoleComponent', () => {
  let component: AdminArtistsConsoleComponent;
  let fixture: ComponentFixture<AdminArtistsConsoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminArtistsConsoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminArtistsConsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
