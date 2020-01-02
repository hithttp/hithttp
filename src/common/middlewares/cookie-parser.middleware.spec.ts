import { CookieParserMiddleware } from './cookie-parser.middleware';

describe('CookieParserMiddleware', () => {
  it('should be defined', () => {
    expect(new CookieParserMiddleware()).toBeDefined();
  });
});
