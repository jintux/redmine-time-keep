import { RedmineTimeKeepPage } from './app.po';

describe('redmine-time-keep App', () => {
  let page: RedmineTimeKeepPage;

  beforeEach(() => {
    page = new RedmineTimeKeepPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
