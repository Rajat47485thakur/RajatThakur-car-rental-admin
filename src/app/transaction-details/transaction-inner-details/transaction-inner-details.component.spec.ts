import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionInnerDetailsComponent } from './transaction-inner-details.component';

describe('TransactionInnerDetailsComponent', () => {
  let component: TransactionInnerDetailsComponent;
  let fixture: ComponentFixture<TransactionInnerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionInnerDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionInnerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
