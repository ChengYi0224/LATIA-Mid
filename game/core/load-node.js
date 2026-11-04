// Node 用的資料載入（測試與檢查腳本）。
import { readFileSync } from 'node:fs';
import { CONTENT_FILES, buildContent } from './content.js';

export function loadContentSync(dirUrl = new URL('../../content/', import.meta.url)) {
  const raw = {};
  for (const name of CONTENT_FILES) {
    raw[name] = JSON.parse(readFileSync(new URL(`${name}.json`, dirUrl), 'utf8'));
  }
  return buildContent(raw);
}
