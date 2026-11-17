#!/usr/bin/env python3
"""Recompose Batch A with Pillow alpha-over; SHA256 checks apply to actual file bytes.
Run from any cwd: python qa_composite.py
"""
from pathlib import Path
from PIL import Image
import numpy as np, hashlib, csv, sys
root=Path(__file__).resolve().parent
layers=sorted((root/'layers').glob('*.png'))
assert len(layers)==9, f"expected 9 layers, got {len(layers)}"
W,H=1080,1920
out=Image.new('RGBA',(W,H),(0,0,0,0))
for f in layers:
 im=Image.open(f)
 assert im.mode=='RGBA' and im.size==(W,H), f"bad format/size {f}"
 a=np.asarray(im.getchannel('A'))
 print(f.name,'alpha',int(a.min()),int(a.max()),'zero',round(float((a==0).mean()*100),4),'opaque',round(float((a==255).mean()*100),4))
 out.alpha_composite(im)
png=root/'composite_preview.png'
expected=Image.open(png).convert('RGB')
assert np.array_equal(np.asarray(out.convert('RGB')),np.asarray(expected)), 'recomposition RGB differs'
with (root/'manifest.csv').open('r',encoding='utf-8-sig',newline='') as f: rows=list(csv.DictReader(f))
for row in rows:
 p=root/row['relative_path'];assert p.exists(),p
 sha=hashlib.sha256(p.read_bytes()).hexdigest()
 assert row['sha256']==sha,(p,sha,row['sha256'])
 for ext in ['.webp']:
  if p.suffix==ext and ('_review' in p.stem):assert p.stat().st_size<=1_000_000,p
# Candidate 2D image-space centerline check only; not full navigation/camera QA.
import cv2
route=np.array([(545,1702),(540,1500),(535,1360),(540,1270),(620,1236),(748,1204),(855,1205),(943,1203)],dtype=np.int32)
path=np.zeros((H,W),dtype=np.uint8)
cv2.polylines(path,[route],False,255,25)
for name in ['06_sanctuary_protected.png','07_pews_left_occluder.png','08_pews_right_occluder.png']:
 a=np.asarray(Image.open(root/'layers'/name).getchannel('A'))
 overlap=int(((path>0)&(a>25)).sum())
 print('CANDIDATE_STATIC_OVERLAP',name,overlap)
 assert overlap==0, name
print('PASS: 9 layers 1080x1920 RGBA, composite exact, manifest SHA256, WebP <= 1MB, candidate static 2D cutout overlap 0')
print('composite_sha256:',hashlib.sha256(png.read_bytes()).hexdigest())
