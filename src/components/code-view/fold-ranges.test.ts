import { expect } from '@open-wc/testing';
import { computeFoldRanges, maxColumns, splitLines } from './fold-ranges.js';

const ranges = (code: string) => Object.fromEntries(computeFoldRanges(splitLines(code)));

describe('Code View text helpers', () => {
  describe('splitLines', () => {
    it('splits on every newline style and drops one trailing newline', () => {
      expect(splitLines('a\nb\r\nc\rd')).to.deep.equal(['a', 'b', 'c', 'd']);
      expect(splitLines('a\nb\n')).to.deep.equal(['a', 'b']);
      expect(splitLines('a\n\n')).to.deep.equal(['a', '']);
      expect(splitLines('')).to.deep.equal([]);
      expect(splitLines('\n')).to.deep.equal(['']);
    });
  });

  describe('computeFoldRanges', () => {
    it('folds JSON blocks by indentation, leaving the closing bracket outside', () => {
      const json = JSON.stringify({ a: 1, b: { c: [1, 2] } }, null, 2);
      // {            0
      //   "a": 1,    1
      //   "b": {     2
      //     "c": [   3
      //       1,     4
      //       2      5
      //     ]        6
      //   }          7
      // }            8
      expect(ranges(json)).to.deep.equal({ 0: 7, 2: 6, 3: 5 });
      expect([...computeFoldRanges(splitLines(json)).keys()], 'sorted by start').to.deep.equal([
        0, 2, 3,
      ]);
    });

    it('works for indentation-only formats such as YAML and Python', () => {
      const yaml = ['a:', '  b: 1', '  c:', '    - x', 'd: 2'].join('\n');
      expect(ranges(yaml)).to.deep.equal({ 0: 3, 2: 3 });
    });

    it('ignores blank lines inside a block and excludes trailing blank lines', () => {
      const code = ['def f():', '    a = 1', '', '    return a', '', '', 'f()'].join('\n');
      expect(ranges(code)).to.deep.equal({ 0: 3 });
    });

    it('treats a tab as indentation to the next multiple of 4', () => {
      const code = ['if x:', '\ty', '    z', 'w'].join('\n');
      expect(ranges(code)).to.deep.equal({ 0: 2 });
    });

    it('has no ranges for flat text', () => {
      expect(ranges('a\nb\nc')).to.deep.equal({});
      expect(ranges('')).to.deep.equal({});
    });

    it('computes ten thousand lines quickly', () => {
      const lines = splitLines(
        JSON.stringify(
          Array.from({ length: 2000 }, (_, i) => ({ id: i, tags: ['a'] })),
          null,
          2,
        ),
      );
      expect(lines.length).to.be.above(10000);
      const start = performance.now();
      const result = computeFoldRanges(lines);
      // 寬鬆的上限：實測約數毫秒，只防止退化成 O(n²)
      expect(performance.now() - start).to.be.below(200);
      expect(result.get(0)).to.equal(lines.length - 2);
    });
  });

  describe('maxColumns', () => {
    it('counts characters, tabs to the next stop, and wide characters as two columns', () => {
      expect(maxColumns(['abc', 'abcdef'])).to.equal(6);
      expect(maxColumns(['a\tb'])).to.equal(5);
      expect(maxColumns(['中文'])).to.equal(4);
      expect(maxColumns(['😀x'])).to.equal(3);
      expect(maxColumns(['✅⭐'])).to.equal(4);
      expect(maxColumns([])).to.equal(0);
    });
  });
});
