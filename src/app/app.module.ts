import { RedmineService } from './redmine.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MarkdownModule } from 'angular2-markdown';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule, MatSelectModule, MatInput, MatSidenavModule,
  MatToolbarModule, MatProgressSpinnerModule, MatIconModule,
  MatButtonModule, MatListModule, MatExpansionModule } from '@angular/material';

import { AppComponent } from './app.component';
import { ConfigComponent } from './config/config.component';
import { HomeComponent } from './home/home.component';
import { IssueEntryComponent } from './issue-entry/issue-entry.component';

const routes: Routes = [
  { path: 'config', component: ConfigComponent },
  { path: '', component: HomeComponent }
];

@NgModule({
  declarations: [
    AppComponent, MatInput, ConfigComponent, HomeComponent, IssueEntryComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    MarkdownModule.forRoot(),
    MatToolbarModule, MatFormFieldModule, MatSelectModule,
    MatProgressSpinnerModule, MatIconModule, MatButtonModule,
    MatSidenavModule, MatListModule, MatExpansionModule
  ],
  providers: [RedmineService],
  bootstrap: [AppComponent]
})
export class AppModule { }
