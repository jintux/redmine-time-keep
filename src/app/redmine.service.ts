import { IssueParams } from './redmine.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { obsLog } from './log.service';

export interface Issue {
  id: number;
  subject: string;
  description: string;
}

export interface IssueParams {
  offset?: number;
  limit?: number;
  sort?: boolean;

  issue_id?: number;
}

export interface SearchResult {
  datetime: Date;
  description: string;
  id: number;
  title: string;
  type: string;
  url: string;
}

export interface SearchParams {
  q: string;
}

export interface RedmineApi {
  getIssues(params: IssueParams): Observable<Issue[]>;
  test(cmd: string, arg: any): Observable<string>;
  search(params: SearchParams): Observable<SearchResult[]>;
}


export interface RedmineConfig {
  url: string;
  username: string;
  password: string;
}


const toRedmineQuery = (cmd: string, params?: any) => {
  let str = '';
  if (!params) {
    return cmd + '.json';
  } else if (typeof params === 'string') {
    return cmd + '.json?' + params;
  }
  // tslint:disable-next-line:forin
  for (const key in params) {
    if (str === '') {
        str += '?';
      } else {
          str += '&';
      }
      str += key + '=' + encodeURIComponent(params[key]);
  }
  return `${cmd}.json${str}`;
};

const makeQueryRunner = (http: HttpClient, cred: RedmineConfig) => <T>(cmd: string, params?: any): Observable<T> => {
  const auth = 'Basic ' + btoa(cred.username + ':' + cred.password);
  const headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('authorization', auth);
  const query = toRedmineQuery(cmd, params);
  console.log('Running query', query, params);
  return http.get<T>(cred.url + '/' + query, { headers })
    .do(obsLog('Query ' + query));
};

@Injectable()
export class RedmineService {

  runQuery: <T>(cmd: string, params?: any) => Observable<T>;

  constructor(private http: HttpClient) {
    const cred = localStorage.getItem('credentials');
    if (cred) {
      this.setConfig(JSON.parse(cred));
    }
  }

  public setConfig(config: RedmineConfig) {
    this.runQuery = makeQueryRunner(this.http, config);
  }

  getApi(config: RedmineConfig = null): RedmineApi {
    const runQuery = config ? makeQueryRunner(this.http, config) : this.runQuery;
    return {
      getIssues: (params: IssueParams) => runQuery<any>('issues', params).map(v => v.issues),
      test: (cmd: string, arg: any) => runQuery<any>(cmd, arg).map(v => JSON.stringify(v)).catch(e => Observable.of(JSON.stringify(e))),
      search: (params: SearchParams) => runQuery<any>('search', params).map(v => v.results)
    };
  }
}
