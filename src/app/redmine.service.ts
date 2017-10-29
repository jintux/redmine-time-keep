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
//  test(cmd: string, arg: any): Observable<string>;
//  search(params: SearchParams): Observable<SearchResult[]>;
  run(query: Query): Observable<any>;
}


export interface RedmineConfig {
  url: string;
  username: string;
  password: string;
}

export const addFilter = (params: any, name: string, operation: string, value?: string) => {
  const ret = { ...params };
  let filter = ret['f[]'];
  if (!filter) {
    filter = name;
  } else if (filter instanceof Array) {
    filter = [...filter, name];
  } else {
    filter = [filter, name];
  }
  ret['f[]'] = filter;
  ret[`op[${name}]`] = operation;
  if (value) {
    ret[`v[${name}][]`] = value;
  }
  return ret;
};

export class Query {
  constructor(public cmd: string, public params = {}) {
  }

  public addFilter(name: string, operation: string, value?: string) {
    this.params = addFilter(this.params, name, operation, value);
    return this;
  }
}

export const makeQuery = (cmd: string, params?: any) => new Query(cmd, params);

const makeUriComponent = (key, value) => encodeURIComponent(key) + '=' + encodeURIComponent(value);

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
      const value = params[key];
      if (value instanceof Array) {
        str += value.reduce((acc, v) => (acc ? acc + '&' : '') + makeUriComponent(key, v), null);
      } else {
        str += makeUriComponent(key, value);
      }
    }
  return `${cmd}.json${str}`;
};

const makeQueryRunner = (http: HttpClient, cred: RedmineConfig) => <T>(query: Query): Observable<T> => {
  const auth = 'Basic ' + btoa(cred.username + ':' + cred.password);
  const headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('authorization', auth);
  const queryUrl = toRedmineQuery(query.cmd, query.params);
  console.log('Running query', queryUrl, query);
  return http.get<T>(cred.url + '/' + queryUrl, { headers })
    .do(obsLog('Query ' + queryUrl));
};

@Injectable()
export class RedmineService {

  runQuery: <T>(query: Query) => Observable<T>;

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
      getIssues: (params: IssueParams) => runQuery<any>(makeQuery('issues', params)).map(v => v.issues),
//      test: (cmd: string, arg: any) => runQuery<any>(cmd, arg).map(v => JSON.stringify(v)).catch(e => Observable.of(JSON.stringify(e))),
//      search: (params: SearchParams) => runQuery<any>('search', params).map(v => v.results)
      run: (query: Query) => runQuery<any>(query)
    };
  }
}
