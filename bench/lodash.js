const performance = require('perf_hooks').performance;
const _ = require('lodash');
const keep = require('../lib/keep-paths.min').default;

console.log('Deep picking with lodash...');
const fullObject = require('../test/mock.json');
let start = performance.now();
_.reduce(['structure.longer.joy.right.luck.horse.ball.tip.about.hour', 'structure.longer.joy.right.luck.horse.ball.tip.about.pig'], (o, p) => _.set(o, p, _.get(fullObject, p, null)), {})
let end = performance.now();
console.log(`Execution time: ${end - start} ms`);

console.log('Deep picking with keep...');
start = performance.now();
keep(fullObject, ['structure.longer.joy.right.luck.horse.ball.tip.about.hour', 'structure.longer.joy.right.luck.horse.ball.tip.about.pig']);
end = performance.now();
console.log(`Execution time: ${end - start} ms`);