import { test } from 'node:test';
import assert from 'node:assert/strict';
import { content } from '../../core/test/helpers.js';
import { MAPS } from '../maps.js';
import { normalizeSrc, resolveAsset, createImageCache } from '../assets-logic.js';
import { ASSETS } from '../assets.js';
import { SFX_NAMES, sfxNotes, sfxDuration, sfxForEvent, parseMuted, serializeMuted } from '../audio-logic.js';

test('src 空、空白、非字串都當作沒有，有值會去掉空白', () => {
  for (const v of [null, undefined, '', '   ', 5, {}]) assert.equal(normalizeSrc(v), null);
  assert.equal(normalizeSrc(' assets/a.png '), 'assets/a.png');
});

test('resolveAsset：有填 src 就帶出來，空的退回色塊，未知 key 給灰色後備', () => {
  const t = { a: { color: '#123456', label: '甲', src: 'assets/a.png' }, b: { color: '#abcdef', label: '乙', src: null }, c: { label: '丙', src: '' } };
  assert.equal(resolveAsset(t, 'a').src, 'assets/a.png');
  assert.equal(resolveAsset(t, 'b').src, null);
  assert.equal(resolveAsset(t, 'c').color, '#888');
  const u = resolveAsset(t, 'zzz');
  assert.deepEqual([u.known, u.src, u.color, u.label], [false, null, '#888', 'zzz']);
});

test('圖片快取：載好才回傳圖，失敗回傳 null 而且不重試，空 src 不載入', () => {
  const calls = [];
  const cache = createImageCache((src, ok, fail) => { calls.push(src); if (src.includes('bad')) fail(); else ok({ src }); });
  assert.equal(cache.get(null), null);
  assert.equal(cache.get(''), null);
  assert.equal(calls.length, 0);
  // 第一次呼叫時圖還沒回來（這個假的載入是同步，所以第二次拿得到）
  cache.get('assets/good.png');
  assert.deepEqual(cache.get('assets/good.png'), { src: 'assets/good.png' });
  assert.equal(cache.get('assets/bad.png'), null);
  assert.equal(cache.get('assets/bad.png'), null);
  assert.equal(cache.status('assets/bad.png'), 'fail');
  assert.equal(calls.filter((s) => s === 'assets/bad.png').length, 1);
});

test('whenReady：非同步載入完才通知，失敗通知 null，同一個 src 只載一次', () => {
  const pending = [];
  const cache = createImageCache((src, ok, fail) => pending.push({ src, ok, fail }));
  const got = [];
  cache.whenReady('assets/x.png', (i) => got.push(['a', i]));
  cache.whenReady('assets/x.png', (i) => got.push(['b', i]));
  cache.whenReady('assets/y.png', (i) => got.push(['c', i]));
  cache.whenReady('', () => got.push(['never']));
  assert.equal(pending.length, 2);
  assert.equal(cache.get('assets/x.png'), null); // 還沒載好
  pending[0].ok({ src: 'x' });
  pending[1].fail();
  assert.deepEqual(got, [['a', { src: 'x' }], ['b', { src: 'x' }], ['c', null]]);
  cache.whenReady('assets/x.png', (i) => got.push(['d', i])); // 已載好，立刻通知
  assert.deepEqual(got.at(-1), ['d', { src: 'x' }]);
  assert.equal(cache.get('assets/x.png').src, 'x');
  assert.equal(pending.length, 2);
});

test('素材表涵蓋所有地圖物件、死因卡圖、結局圖和主角，預設 src 都是空的', () => {
  const need = new Set(['player']);
  for (const r of Object.values(MAPS)) for (const o of r.objects) need.add(o.id);
  for (const d of content.deaths) need.add(d.art);
  for (const e of content.endings) need.add(e.art);
  for (const k of need) assert.ok(ASSETS[k], `素材表缺 ${k}`);
  for (const [k, a] of Object.entries(ASSETS)) {
    assert.equal(a.src, null, `${k} 預設 src 應為空`);
    assert.match(a.color, /^#[0-9a-f]{3,6}$/i);
    assert.ok(a.label);
  }
});

test('音效都有合法的音符，事件對得到音效', () => {
  assert.deepEqual(SFX_NAMES, ['interact', 'solve', 'death', 'ending', 'step', 'bump', 'pickup', 'door', 'buzz', 'chain']);
  for (const n of SFX_NAMES) {
    const notes = sfxNotes(n);
    assert.ok(notes.length > 0 && sfxDuration(n) > 0 && sfxDuration(n) < 2, n);
    for (const x of notes) {
      assert.ok(x.f > 0 && x.d > 0 && x.t >= 0 && x.v > 0 && x.v <= 1);
      assert.ok(['square', 'triangle', 'sawtooth', 'sine'].includes(x.w));
    }
  }
  assert.deepEqual(sfxNotes('nope'), []);
  assert.equal(sfxForEvent('solved'), 'solve');
  assert.equal(sfxForEvent('death'), 'death');
  assert.equal(sfxForEvent('ending'), 'ending');
  assert.equal(sfxForEvent('ui_interact'), 'interact');
  assert.equal(sfxForEvent('moved'), 'door');
  assert.equal(sfxForEvent('item'), 'pickup');
  assert.equal(sfxForEvent('cutscene'), 'chain');
  assert.equal(sfxForEvent('wrong'), null);
});

test('靜音設定的存取', () => {
  assert.equal(parseMuted(null), false);
  assert.equal(parseMuted('0'), false);
  assert.equal(parseMuted('1'), true);
  assert.equal(parseMuted(serializeMuted(true)), true);
  assert.equal(parseMuted(serializeMuted(false)), false);
});
