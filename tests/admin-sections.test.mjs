import test from 'node:test';
import assert from 'node:assert/strict';
import {categoriesForSection,collectionsForSection} from '../shared/admin-sections.mjs';

test('admin sections separate Hardware, Software, and Notes including legacy collections and empty groups',()=>{
  const catalog={categories:[{id:'notes',kind:'learn',title:'Notes',order:0},{id:'legacy',kind:'build',title:'Legacy hardware',order:1},{id:'shared',kind:'build',title:'Shared',order:2},{id:'new-hardware',kind:'build',buildType:'hardware',title:'New hardware group',order:3},{id:'new-software',kind:'build',buildType:'software',title:'New software group',order:4}],collections:[{id:'note',kind:'learn',categoryId:'notes'},{id:'legacy-board',kind:'build',categoryId:'legacy'},{id:'board',kind:'build',buildType:'hardware',categoryId:'shared'},{id:'app',kind:'build',buildType:'software',categoryId:'shared'}]};
  assert.deepEqual(collectionsForSection(catalog,'build','hardware').map(menu=>menu.id),['legacy-board','board']);
  assert.deepEqual(collectionsForSection(catalog,'build','software').map(menu=>menu.id),['app']);
  assert.deepEqual(collectionsForSection(catalog,'learn').map(menu=>menu.id),['note']);
  assert.deepEqual(categoriesForSection(catalog,'build','software').map(group=>group.id),['shared','new-software']);
  assert.deepEqual(categoriesForSection(catalog,'build','hardware').map(group=>group.id),['legacy','shared','new-hardware']);
  assert.deepEqual(categoriesForSection(catalog,'learn').map(group=>group.id),['notes']);
});
