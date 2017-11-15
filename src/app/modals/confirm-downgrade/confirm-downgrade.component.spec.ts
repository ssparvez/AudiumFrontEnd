import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDowngradeComponent } from './confirm-downgrade.component';

describe('ConfirmDowngradeComponent', () => {
  let component: ConfirmDowngradeComponent;
  let fixture: ComponentFixture<ConfirmDowngradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmDowngradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDowngradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
