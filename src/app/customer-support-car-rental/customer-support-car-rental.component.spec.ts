import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSupportCarRentalComponent } from './customer-support-car-rental.component';

describe('CustomerSupportCarRentalComponent', () => {
  let component: CustomerSupportCarRentalComponent;
  let fixture: ComponentFixture<CustomerSupportCarRentalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerSupportCarRentalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerSupportCarRentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
