"""中文像素字型子集腳本（開發工具，老師不需要執行）。
用法：在 repo 根目錄執行
  python scripts/build-font.py <Fusion Pixel 12px proportional zh_tw 的 ttf 路徑>
需要 pip install fonttools brotli。來源與授權見 CREDITS.md。
改了 content/ 或 game/ 裡的文字後要重跑一次，不然新字會退回系統字型。
輸出：assets/fonts/pixel-font.woff2 與 game/ui/pixel-font.css（base64 內嵌，純前端不連外）。
"""
import base64, glob, io, os, sys
from fontTools import subset
from fontTools.ttLib import TTFont

root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
src = sys.argv[1]
chars = set(chr(c) for c in range(0x20, 0x7f))
chars |= set('，。、；：？！「」『』（）《》〈〉…—～·‧　％＋－×÷＝＜＞／▼▲►◄■□●○★☆→←↑↓')
for pat in ['content/*.json', 'game/**/*.js', 'game/**/*.css', 'game/**/*.json']:
    for f in glob.glob(os.path.join(root, pat), recursive=True):
        chars |= set(open(f, encoding='utf-8').read())
chars = {c for c in chars if ord(c) >= 0x20 and c not in '\u007f'}
font = TTFont(src)
cmap = font.getBestCmap()
have = {c for c in chars if ord(c) in cmap}
missing = sorted(chars - have)
opts = subset.Options(); opts.flavor = 'woff2'; opts.layout_features = ['*']; opts.name_IDs = ['*']; opts.notdef_outline = True
sub = subset.Subsetter(opts); sub.populate(text=''.join(sorted(have))); sub.subset(font)
out = os.path.join(root, 'assets/fonts/pixel-font.woff2')
font.flavor = 'woff2'; font.save(out)
data = open(out, 'rb').read()
css = ('/* 由 scripts/build-font.py 產生，不要手改。Fusion Pixel Font 12px（OFL-1.1），來源見 CREDITS.md */\n'
       '@font-face { font-family: "Pixel Font"; src: url(data:font/woff2;base64,' + base64.b64encode(data).decode() + ') format("woff2"); font-weight: 400 700; font-style: normal; }\n')
open(os.path.join(root, 'game/ui/pixel-font.css'), 'w', encoding='utf-8').write(css)
print(f'{len(have)} 字收錄，{len(data)} bytes；字型沒有的字（走後備字型）：{"".join(missing)}')
