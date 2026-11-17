#!/usr/bin/env python3
"""Reproducible Batch C R2 structural inspection; no physical gait/IK claim."""
from pathlib import Path
from PIL import Image
from collections import defaultdict
import hashlib, csv, json, numpy as np
R=Path(__file__).resolve().parent
data=list(csv.DictReader((R/'animation_manifest.csv').open(encoding='utf-8')))
assert data
man=json.loads((R/'atlas_manifest.json').read_text(encoding='utf-8'))
groups=defaultdict(list)
for row in data:
    p=R/row['frame_file'];im=Image.open(p)
    assert im.size==(256,384) and im.mode=='RGBA',p
    a=np.array(im.getchannel('A'))
    assert a.min()==0 and a.max()==255,p
    assert int(row['pivot_x'])==128 and int(row['pivot_y'])==347
    assert int(row['duration_ms'])>0
    y,x=np.where((a>180)&(np.indices(a.shape)[0]>=335))
    assert len(y) and y.max()==int(row['support_foot_y']),p
    assert 0<=int(row['support_foot_x'])<256,p
    assert row['anchor_validity']=='DRAFT_NOT_IK'
    groups[row['animation']].append(row)
for name, group in groups.items():
    spec=man['animations'][name]
    atlas=Image.open(R/spec['atlas']).convert('RGBA')
    assert spec['frame_count']==len(group) and atlas.size==(len(group)*256,384),name
    hashes=[]
    for row in group:
        frame=Image.open(R/row['frame_file']).convert('RGBA')
        x=int(row['atlas_x'])
        assert atlas.crop((x,0,x+256,384)).tobytes()==frame.tobytes(),row
        hashes.append(hashlib.sha256(frame.tobytes()).hexdigest())
    if spec['hold_type']=='STATIC_HOLD':assert len(group)==1,name
    if name in ('walk_left','walk_right','return','leave'):
        assert len(group)>=8 and len(set(hashes))==len(hashes),(name,'duplicate')
    assert spec['duration_ms']==sum(int(r['duration_ms']) for r in group),name
    print(f'{name}: {len(group)} frames, {len(set(hashes))} unique, {spec["duration_ms"]} ms')
# Extracted person-only seated sprite must be clear in reference wood-pedestal region.
s=np.array(Image.open(R/'frames/seated/00.png').convert('RGBA'))
assert s[280:330,:146,3].max()==0,'Wood/pedestal color region remains opaque'
assert Image.open(R/'frames/sit_down/06.png').convert('RGBA').tobytes()==Image.open(R/'frames/seated/00.png').convert('RGBA').tobytes()
assert Image.open(R/'frames/stand_up/00.png').convert('RGBA').tobytes()==Image.open(R/'frames/seated/00.png').convert('RGBA').tobytes()
count=0
for row in csv.DictReader((R/'manifest.csv').open(encoding='utf-8-sig')):
    p=R/row['relative_path']
    assert p.exists(),p
    assert hashlib.sha256(p.read_bytes()).hexdigest()==row['sha256'],p
    count+=1
print(f'STRUCTURAL PASS: frames={len(data)} animations={len(groups)} inventory={count}')
print('ART STILL HOLD: furniture semantics beyond sampled region; gait naturalness; physical foot lock; pose IK; runtime collision.')
