import { WorktimeService } from './worktime.service';
import { Component } from '@angular/core';
import { RedmineService } from './redmine.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // Make sure redmine instance is the same across the app
  constructor(redmine: RedmineService, worktime: WorktimeService) { }

}
