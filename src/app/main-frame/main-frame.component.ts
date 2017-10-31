import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-main-frame',
  templateUrl: './main-frame.component.html',
  styleUrls: ['./main-frame.component.css']
})
export class MainFrameComponent implements OnInit {

  @Input() name: string;

  constructor() { }

  ngOnInit() {
  }

}
