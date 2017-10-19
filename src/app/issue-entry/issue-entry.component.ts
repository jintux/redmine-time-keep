import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-issue-entry',
  templateUrl: './issue-entry.component.html',
  styleUrls: ['./issue-entry.component.css']
})
export class IssueEntryComponent implements OnInit {

  @Input() id: number;
  @Input() title: string;

  constructor() { }

  ngOnInit() {
  }

}
