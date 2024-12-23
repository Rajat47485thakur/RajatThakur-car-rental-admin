import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AddCmsComponent } from "./add-cms.component";

describe("AddCmsComponent", () => {
  let component: AddCmsComponent;
  let fixture: ComponentFixture<AddCmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddCmsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddCmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
