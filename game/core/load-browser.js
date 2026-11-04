// 瀏覽器用的資料載入：用 fetch 讀 content/*.json。需要用本機伺服器或 GitHub Pages 開，file:// 不行。
import { CONTENT_FILES, buildContent } from './content.js';

export async function loadContent(baseUrl = new URL('../../content/', import.meta.url)) {
  const entries = await Promise.all(
    CONTENT_FILES.map(async (name) => {
      const res = await fetch(new URL(`${name}.json`, baseUrl));
      if (!res.ok) throw new Error(`讀不到 ${name}.json（${res.status}）`);
      return [name, await res.json()];
    }),
  );
  return buildContent(Object.fromEntries(entries));
}
