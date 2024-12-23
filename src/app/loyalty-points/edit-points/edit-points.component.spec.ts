import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditPointsComponent } from "./edit-points.component";

describe("EditPointsComponent", () => {
  let component: EditPointsComponent;
  let fixture: ComponentFixture<EditPointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditPointsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
