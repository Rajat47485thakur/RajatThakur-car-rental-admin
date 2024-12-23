import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { FooterComponent } from "./footer/footer.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { DateTimestampPipePipe } from './date-timestamp-pipe.pipe';
// import { RelativeTimePipePipe } from "app/services/relative-time.pipe.pipe";
@NgModule({
  imports: [CommonModule, RouterModule,FormsModule,NgMultiSelectDropDownModule.forRoot(),],
  declarations: [FooterComponent, NavbarComponent, SidebarComponent, DateTimestampPipePipe],
  exports: [FooterComponent, NavbarComponent, SidebarComponent]
})
export class ComponentsModule {}
