import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('lockfile includes native build packages for every supported platform',async()=>{
  const {packages}=JSON.parse(await readFile(new URL('../package-lock.json',import.meta.url),'utf8'));
  for(const name of ['lightningcss','@tailwindcss/oxide','rollup','esbuild']){
    const parent=packages[`node_modules/${name}`];
    assert.ok(parent,`Missing build dependency: ${name}`);
    for(const [binding,version] of Object.entries(parent.optionalDependencies)){
      const entry=packages[`node_modules/${binding}`];
      assert.ok(entry,`Missing platform package: ${binding}; repair the lockfile without an existing node_modules tree`);
      if(/^\d+\.\d+\.\d+$/.test(version))assert.equal(entry.version,version,`Mismatched platform package: ${binding}`);
    }
  }
  const linux=packages['node_modules/lightningcss-linux-x64-gnu'];
  assert.deepEqual(linux.os,['linux']);
  assert.deepEqual(linux.cpu,['x64']);
  assert.ok(linux.integrity,'Linux binary must have a registry integrity hash');
});
