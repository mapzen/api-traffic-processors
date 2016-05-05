/* eslint-env mocha */
var expect = require('chai').expect;

describe('index', function () {
  it('exports 3 entry points', function () {
    var index = require('../index.js');
    expect(Object.keys(index).length).to.eq(3);
  });
});
