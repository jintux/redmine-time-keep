import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueEntryComponent } from './issue-entry.component';

describe('IssueEntryComponent', () => {
  let component: IssueEntryComponent;
  let fixture: ComponentFixture<IssueEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
