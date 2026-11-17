#!/usr/bin/env python3
from pathlib import Path
from PIL import Image
import csv, hashlib, json
ROOT=Path(__file__).resolve().parent
rows=list(csv.DictReader((ROOT/'animation_manifest.csv').open(encoding='utf-8')))
assert rows
for row in rows:
    p=ROOT/row['frame_file']; im=Image.open(p)
    assert im.size==(256,384) and im.mode=='RGBA',p
    lo,hi=im.getchannel('A').getextrema()
    assert lo==0 and hi==255,(p,(lo,hi))
    assert int(row['pivot_x'])==128 and int(row['pivot_y'])==347
    assert int(row['duration_ms'])>0
    import numpy as np
    alpha=np.array(im.getchannel('A'))
    assert np.where(alpha>180)[0].max()==347,(p,'contact baseline is not y=347')
for name in sorted(set(r['animation'] for r in rows)):
    group=[r for r in rows if r['animation']==name]
    atlas=Image.open(ROOT/group[0]['atlas_file']).convert('RGBA')
    assert atlas.size==(256*len(group),384)
    for row in group:
        box=tuple(map(int,(row['atlas_x'],row['atlas_y'],row['atlas_w'],row['atlas_h'])))
        tile=atlas.crop((box[0],box[1],box[0]+box[2],box[1]+box[3]))
        assert tile.tobytes()==Image.open(ROOT/row['frame_file']).convert('RGBA').tobytes(),row
for row in csv.DictReader((ROOT/'manifest.csv').open(encoding='utf-8-sig')):
    p=ROOT/row['relative_path']
    assert p.exists(),p
    assert hashlib.sha256(p.read_bytes()).hexdigest()==row['sha256'],p
print('PASS |',len(rows),'frames |',len(set(r['animation'] for r in rows)),'animations | atlas pixel-equality | SHA256 inventory | native 256x384 RGBA')
