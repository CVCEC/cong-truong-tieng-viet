#!/usr/bin/env python3
"""Ghi luyen-noi/giong-elio.js từ các tệp giọng robot đã tạo (luyen-noi/audio/kore/<mã>.mp3).
Robot giọng đọc AI (tools/giong_ai.py) chạy tệp này sau mỗi lô. Mỗi câu là một tệp riêng: sprites[mã] = tệp, files[mã] = [mã, 0, độ dài].
Nếu sau này dùng gói của studio.html, đừng chạy tệp này nữa (nó sẽ ghi đè giong-elio.js)."""
import json, pathlib, subprocess
ROOT = pathlib.Path(__file__).resolve().parent.parent
THU = ROOT / 'luyen-noi/audio/kore'
sprites, files = {}, {}
for f in sorted(THU.glob('*.mp3')):
    dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(f)],
                               capture_output=True, text=True, check=True).stdout.strip())
    ma = f.stem
    sprites[ma] = 'audio/kore/' + f.name
    files[ma] = [ma, 0, round(dur + .12, 3)]
(ROOT / 'luyen-noi/giong-elio.js').write_text(
    '/* Gói giọng Trâu Con cho trang Luyện nói – do robot giọng đọc AI (tools/giong_ai.py, giọng Kore) tạo, tools/gan_giong.py ghi ra.\n'
    '   Không sửa tay. Câu nào chưa có ở đây thì trang chưa phát giọng mẫu. */\n'
    'window.LUYEN_NOI_GIONG = ' + json.dumps({'sprites': sprites, 'files': files}, ensure_ascii=False) + ';\n', encoding='utf-8')
print('giong-elio.js:', len(files), 'câu')
