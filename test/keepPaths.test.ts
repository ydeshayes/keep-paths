import { performance } from 'perf_hooks';

import keep from '../src';

function getMock() {
  return {
    foo: {
      bar: {
        key: "val",
        key2: "val2"
      },
      bar2: {
        key3: "val3"
      }
    },
    other: {
      list: [{
        foo: {
          bar: 'listvar'
        }
      }, {
        foo: {
          bar: 'listvar2'
        }
      },
      {
        foo: {
          bar: 'listvar3'
        }
      }],
      props: {
        key: "here"
      },
      here: {
        ok: "value"
      }
    }
  };
}

describe('Keep only the path selected', () => {
  it('Simple case', async () => {
    const fullObject = getMock();

    expect(keep(fullObject, ['foo.bar.key'])).toEqual({ foo: { bar: { key: "val" } }});
    // Check that the origin object is not mutated
    expect(fullObject).toEqual(getMock());
  });

  it('Object case', async () => {
    const fullObject = getMock();
    expect(keep(fullObject, ['foo.bar'])).toEqual({ foo: { bar: { key: "val", key2: "val2" } }});
    // Check that the origin object is not mutated
    expect(fullObject).toEqual(getMock());
  });

  it('Array case single value', async () => {
    const fullObject = getMock();

    expect(keep(fullObject, ['other.list.0.foo'])).toEqual({ other: {
      list: [{
        foo: {
          bar: 'listvar'
        }
      }]
    }});
    // Check that the origin object is not mutated
    expect(fullObject).toEqual(getMock());
  });

  it('Multiple value array case', async () => {
    const fullObject = getMock();
    expect(keep(fullObject, ['other.list.1.foo'])).toEqual({ other: {
      list: [undefined, {
        foo: {
          bar: 'listvar2'
        }
      }]
    }});
    // Check that the origin object is not mutated
    expect(fullObject).toEqual(getMock());
  });

  it('Big depth object, single path', async () => {
    const fullObject = await require('./mock.json');

    expect(keep(fullObject, ['structure.longer.joy.right.luck.horse.ball.tip.about.hour'])).toEqual({"structure":{"longer":{"joy":{"right":{"luck":{"horse":{"ball":{"tip":{"about":{"hour":-463864505.3372302}}}}}}}}}});
    // Check that the origin object is not mutated
    expect(fullObject).toEqual(require('./mock.json'));
  });

  it('Big depth object, multiple path', async () => {
    const fullObject = require('./mock.json');

    const start = performance.now();
    const result = keep(fullObject, ['structure.longer.joy.right.luck.horse.ball.tip.about.hour', 'structure.longer.joy.right.luck.horse.ball.tip.about.pig']);
    const end = performance.now();
    expect(end - start).toBeLessThanOrEqual(0.06);
    console.log(`Execution time: ${end - start} ms`);

    expect(result).toEqual({"structure":{"longer":{"joy":{"right":{"luck":{"horse":{"ball":{"tip":{"about":{"hour":-463864505.3372302, "pig": 987743024.1886263}}}}}}}}}});
    // Check that the origin object is not mutated
    expect(fullObject).toEqual(require('./mock.json'));
  });
});

describe('Keep only the paths selected', () => {
  it('Simple case', async () => {
    const fullObject = getMock();
    
    expect(keep(fullObject, ['foo.bar.key', 'foo.bar.key2'])).toEqual({ foo: { bar: { key: "val", key2: "val2" } }});
    // Check that the origin object is not mutated
    expect(fullObject).toEqual(getMock());
  });

  it('Object case', async () => {
    const fullObject = getMock();
    expect(keep(fullObject, ['foo.bar', 'foo.bar2'])).toEqual({ foo: { bar: { key: "val", key2: "val2" }, bar2: { key3: "val3"} }});
    // Check that the origin object is not mutated
    expect(fullObject).toEqual(getMock());
  });

  it('Multiple value array case', async () => {
    const fullObject = getMock();
    expect(keep(fullObject, ['other.list.0.foo', 'other.list.1.foo'])).toEqual({ other: {
      list: [{
        foo: {
          bar: 'listvar'
        }
      }, {
        foo: {
          bar: 'listvar2'
        }
      }]
    }});
    // Check that the origin object is not mutated
    expect(fullObject).toEqual(getMock());
  });
});

describe('Error handling', () => {
  it('Bad path at the end', async () => {
    const fullObject = getMock();

    //@ts-expect-error
    expect(keep(fullObject, ['foo.bar.notExist'])).toEqual({"foo": {"bar": {"notExist": undefined}}});
    // Check that the origin object is not mutated
    expect(fullObject).toEqual(getMock());
  });
  
  it('Bad path in the middle', async () => {
    const fullObject = getMock();
    
    //@ts-expect-error
    expect(keep(fullObject, ['foo.notExist.bar'])).toEqual({"foo": {"notExist": {"bar": undefined}}});
    // Check that the origin object is not mutated
    expect(fullObject).toEqual(getMock());
  });

  it('Bad path at the begining', async () => {
    const fullObject = getMock();
    
    //@ts-expect-error
    expect(keep(fullObject, ['notExist.foo.bar'])).toEqual({"notExist": {"foo": {"bar": undefined}}});
    // Check that the origin object is not mutated
    expect(fullObject).toEqual(getMock());
  });
});