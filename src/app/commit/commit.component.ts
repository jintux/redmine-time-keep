import { logObs } from './../log.service';
import { RedmineService, RedmineApi, makeQuery } from './../redmine.service';
import { WorktimeService } from './../worktime.service';
import { Observable } from 'rxjs/Rx';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-commit',
  templateUrl: './commit.component.html',
  styleUrls: ['./commit.component.css']
})
export class CommitComponent {

  private redmine: RedmineApi;
  public issue$ = this.route.paramMap
    .map(v => parseInt(v.get('issue'), 10))
    .switchMap(id => this.redmine.getIssues({ issue_id: id }))
    .map(v => v[0])
    .share();
  public title$ = this.issue$.map(v => `${v.tracker.name} #${v.id}`);
  public subject$ = this.issue$.map(v => v.subject);
  public description$ = this.issue$.map(v => v.description).startWith('');

  constructor(private route: ActivatedRoute, public worktime: WorktimeService, redmineService: RedmineService) {
    this.redmine = redmineService.getApi();
  }

  onDurationChange(newVal) {
    if (newVal instanceof Event) {
      return; // Somtimes it is of type Event??
    }
    this.worktime.setDuration(newVal);
  }
}
