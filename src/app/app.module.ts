import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule, MatSelectModule, MatInput, MatToolbarModule } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent, MatInput
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule, MatFormFieldModule, MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
