/* eslint-env mocha */
/* global clock:true */
var sinon = require('sinon');
var expect = require('chai').expect;

var apiaxleParser = require('../../parsers/apiaxleParser.js');

var examples = require('../fixtures/apiaxle.json');

describe('apiaxleParser', function () {
  before(function () {
    clock = sinon.useFakeTimers(0);
  });

  after(function () {
    clock.restore();
  });

  it('works with 200s', function () {
    expect(apiaxleParser(examples['200'])).to.deep.equal({
      api: 'acme',
      key: '1234',
      status: 200,
      ts: new Date(0),
      origin: 'apiaxle',
      cacheHit: null,
      pathname: '/index.html',
      search: 'api_key=1234'
    });
  });

  it('works with 404s', function () {
    expect(apiaxleParser(examples['404'])).to.deep.equal({
      api: 'acme',
      key: '1234',
      status: 404,
      ts: new Date(0),
      origin: 'apiaxle',
      cacheHit: null,
      pathname: '/users',
      search: 'api_key=1234'
    });
  });

  it('works with errors', function () {
    expect(apiaxleParser(examples.ConnectionError)).to.deep.equal({
      api: 'acme',
      key: '1234',
      status: 'ConnectionError',
      ts: new Date(0),
      origin: 'apiaxle',
      cacheHit: null,
      pathname: '/users',
      search: 'api_key=1234'
    });
  });

  it('renames pelias-search to search', function () {
    expect(apiaxleParser(examples['pelias-search'])).to.deep.equal({
      api: 'search',
      key: '1234',
      status: 200,
      ts: new Date(0),
      origin: 'apiaxle',
      cacheHit: null,
      pathname: '/index.html',
      search: 'api_key=1234'
    });
  });

  it('works with partial unicode searchstrings', function () {
    expect(function () { apiaxleParser(examples.badsearch); }).to.not.throw(Error);
  });
});
