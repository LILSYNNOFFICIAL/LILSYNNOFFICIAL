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

assert.equal(JSON.stringify(sandbox.window.LSDesignerTestHooks.requiredIds), JSON.stringify(['stage','pageFrame','layers','inspector','status','viewportSelect','zoom']));
assert.equal(sandbox.window.LSDesignerTestHooks.historyRoundTrip(), true);
assert.equal(sandbox.window.LSDesignerTestHooks.patchRoundTrip(), true);
assert.equal(sandbox.window.LSDesignerTestHooks.draftRoundTrip(), true);
assert.equal(sandbox.window.LSDesignerTestHooks.toolRegistryValid(), true);

const plusSource = fs.readFileSync('command/designer-plus.js', 'utf8');
vm.runInContext(plusSource, sandbox);
assert.equal(sandbox.window.LSDesignerPlus.version, 1, 'advanced designer should expose a versioned API');
assert.equal(typeof sandbox.window.LSDesignerPlus.addElement, 'function', 'advanced designer should support element insertion');
assert.equal(typeof sandbox.window.LSDesignerPlus.move, 'function', 'advanced designer should support nudging');
assert.equal(typeof sandbox.window.LSDesignerPlus.align, 'function', 'advanced designer should support alignment');

const assetSource = fs.readFileSync('command/designer-assets.js', 'utf8');
vm.runInContext(assetSource, sandbox);
assert.equal(sandbox.window.LSDesignerAssets.version, 1, 'asset tools should expose a versioned API');
assert.equal(typeof sandbox.window.LSDesignerAssets.insertAsset, 'function');
assert.equal(typeof sandbox.window.LSDesignerAssets.duplicateDom, 'function');
assert.equal(typeof sandbox.window.LSDesignerAssets.deleteDom, 'function');

const html = fs.readFileSync('command/designer.html', 'utf8');
assert.match(html, /designer-plus\.js/, 'designer page should load advanced tools');
assert.match(html, /designer-assets\.js/, 'designer page should load asset tools');
assert.match(html, /designer-assets\.css/, 'designer page should load asset styles');
assert.match(html, /LIL SYNN \/ DESIGNER/, 'designer branding should remain present');
console.log('designer contracts: PASS');
