import { RedmineService } from './../redmine.service';
import { Observable, Subject } from 'rxjs/Rx';
import { Component, OnInit, Input } from '@angular/core';
import { IssueHead } from './../home/home.component';

@Component({
  selector: 'app-issue-entry',
  templateUrl: './issue-entry.component.html',
  styleUrls: ['./issue-entry.component.css']
})
export class IssueEntryComponent implements OnInit {

  @Input() head: IssueHead;

  public open$ = new Subject<void>();

  public description$ = this.open$.asObservable()
    .switchMap(_ => this.redmine.getApi().getIssues({issue_id: this.head.id}))
    .map(r => r.length > 0 ? r[0].description : '')
    .startWith('');

  constructor(private redmine: RedmineService) { }

  ngOnInit() {
  }
}
