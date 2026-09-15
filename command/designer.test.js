const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const sourcePath = 'command/designer.js';
assert.equal(fs.existsSync(sourcePath), true, 'designer.js should exist before running the editor contract tests');
const source = fs.readFileSync(sourcePath, 'utf8');
const sandbox = {
  console,
  localStorage: {setItem(){},getItem(){return null}},
  window: {},
  document: {readyState:'loading',addEventListener(){}}
};
vm.createContext(sandbox);
vm.runInContext(source, sandbox);

assert.deepEqual(sandbox.window.LSDesignerTestHooks.requiredIds, ['stage','pageFrame','layers','inspector','status','viewportSelect','zoom']);
assert.equal(sandbox.window.LSDesignerTestHooks.historyRoundTrip(), true);
assert.equal(sandbox.window.LSDesignerTestHooks.patchRoundTrip(), true);
assert.equal(sandbox.window.LSDesignerTestHooks.draftRoundTrip(), true);
assert.equal(sandbox.window.LSDesignerTestHooks.toolRegistryValid(), true);
console.log('designer contracts: PASS');
