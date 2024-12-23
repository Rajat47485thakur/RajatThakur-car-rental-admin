import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ViewPointsComponent } from "./view-points.component";

describe("ViewPointsComponent", () => {
  let component: ViewPointsComponent;
  let fixture: ComponentFixture<ViewPointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewPointsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
