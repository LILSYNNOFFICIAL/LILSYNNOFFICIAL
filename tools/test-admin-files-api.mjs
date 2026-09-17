import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../api/admin-files.js', import.meta.url), 'utf8');

assert.match(source, /ADMIN_SESSION_SECRET/);
assert.match(source, /ls_admin_session/);
assert.match(source, /function isAllowedPath/);
assert.match(source, /action === 'list'/);
assert.match(source, /action === 'read'/);
assert.match(source, /action === 'save'/);
assert.match(source, /\.html|\.css|\.js|\.json/);
assert.match(source, /\.\./);

console.log('admin-files API contract checks passed');
