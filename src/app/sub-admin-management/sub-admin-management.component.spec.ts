import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SubAdminManagementComponent } from "./sub-admin-management.component";

describe("SubAdminManagementComponent", () => {
  let component: SubAdminManagementComponent;
  let fixture: ComponentFixture<SubAdminManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubAdminManagementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SubAdminManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
