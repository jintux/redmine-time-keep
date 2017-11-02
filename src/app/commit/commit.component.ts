import { logObs } from './../log.service';
import { RedmineService, RedmineApi, makeQuery } from './../redmine.service';
import { WorktimeService } from './../worktime.service';
import { Observable } from 'rxjs/Rx';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs/Subject';

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

  public workPerc$ = new Subject<number>();
  public commitDuration$ = this.worktime.runningTime$.withLatestFrom(this.workPerc$.startWith(1))
    .map(([dur, perc]) => Math.floor(dur * perc));

  public finalDuration = 0;
  
  commit = this.fb.group({
    comment: [''],
  });
    
  constructor(private fb: FormBuilder, private route: ActivatedRoute, public worktime: WorktimeService, redmineService: RedmineService) {
    this.redmine = redmineService.getApi();
  }

  onDurationChange(newVal) {
    if (newVal instanceof Event) {
      return; // Somtimes it is of type Event??
    }
    this.finalDuration = newVal;
  }

  onWorkPercChange(v) {
    this.workPerc$.next(v.value);
  }

  onCommit() {
    console.log('Create time-entry here. Subtract duration. Go back.');
  }
}
