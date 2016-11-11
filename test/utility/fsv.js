/* eslint-env mocha */
var expect = require('chai').expect;
var jsc = require('jsverify');

var fsv = require('../../utility/fsv.js');

describe('fsv', function () {
  describe('escapeField', function () {
    it('limits size', function () {
      jsc.assert(jsc.forall(jsc.string, function (s) {
        var escaped = fsv.escapeField(s, 5);
        return new Buffer(escaped).length <= 5;
      }), { tests: 10000 });
    });

    it("doesn't end with an odd number of backslashes", function () {
      jsc.assert(jsc.forall(jsc.string, function (s) {
        var match = fsv.escapeField(s, 4).match(/\\{1,}$/);
        return match === null || match[0].length % 2 === 0;
      }), { tests: 10000 });
    });

    it('escapes spaces', function () {
      jsc.assert(jsc.forall(jsc.string, function (s) {
        var spaces = fsv.escapeField(s, 4).match(/\\* /g);
        if (!spaces) return true;
        for (var i = 0; i < spaces.length; i++) {
          if (spaces[i].match(/^\\*/)[0].length % 2 === 0) {
            return false;
          }
        }
        return true;
      }), { tests: 10000 });
    });

    it('uses \\N for empty', function () {
      expect(fsv.escapeField('', 10)).to.eq('\\N');
    });

    it('uses \\N for null', function () {
      expect(fsv.escapeField(null, 10)).to.eq('\\N');
    });

    it('uses \\N for undefined', function () {
      expect(fsv.escapeField(undefined, 10)).to.eq('\\N');
    });

    it('uses \\N for 0 length', function () {
      expect(fsv.escapeField('aaa', 0)).to.eq('\\N');
    });

    it('works when passed non-string type', function () {
      expect(fsv.escapeField(12, 10)).to.eq('12');
    });
  });

  describe('cleanInt', function () {
    it('uses \\N for NaN', function () {
      expect(fsv.cleanInt('a', 4)).to.eq('\\N');
    });

    it('ignores decimals', function () {
      expect(fsv.cleanInt('123.45', 4)).to.eq(123);
    });

    it('works with negatives', function () {
      expect(fsv.cleanInt('-10', 4)).to.eq(-10);
    });

    it('works with positive overflow', function () {
      expect(fsv.cleanInt('32767', 2)).to.eq(32767);
      expect(fsv.cleanInt('32768', 2)).to.eq('\\N');
    });

    it('works with negative overflow', function () {
      expect(fsv.cleanInt('-32768', 2)).to.eq(-32768);
      expect(fsv.cleanInt('-32769', 2)).to.eq('\\N');
    });
  });
});
