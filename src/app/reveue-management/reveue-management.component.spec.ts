import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ReveueManagementComponent } from "./reveue-management.component";

describe("ReveueManagementComponent", () => {
  let component: ReveueManagementComponent;
  let fixture: ComponentFixture<ReveueManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReveueManagementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReveueManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
