const assert = require('node:assert/strict');
const { createModel, childrenOf, canMove, applyMove, serializeOperations } = require('./designer-dom-model.js');

const model = createModel([
  {id:'root', parent:null, tag:'body', children:['a','b']},
  {id:'a', parent:'root', tag:'section', children:['button']},
  {id:'b', parent:'root', tag:'section', children:[]},
  {id:'button', parent:'a', tag:'button', children:[]}
]);

assert.deepEqual(childrenOf(model, 'a').map(n => n.id), ['button']);
assert.equal(canMove(model, 'button', 'b'), true);
applyMove(model, 'button', 'b', 'inside');
assert.deepEqual(childrenOf(model, 'a').map(n => n.id), []);
assert.deepEqual(childrenOf(model, 'b').map(n => n.id), ['button']);
assert.equal(canMove(model, 'a', 'button'), true);
assert.equal(canMove(model, 'a', 'a'), false);
applyMove(model, 'button', 'a', 'inside');
applyMove(model, 'button', 'b', 'before');
assert.deepEqual(childrenOf(model, 'root').map(n => n.id), ['button','a','b']);
assert.equal(serializeOperations(model).find(op => op.element === 'button').index, 0);
console.log('designer-dom-model: PASS');