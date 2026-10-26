"""Rebuild published derivatives from preserved master assets. Requires Pillow with AVIF support."""
from pathlib import Path
import json,hashlib
from PIL import Image
root=Path(__file__).resolve().parents[1]
manifest_path=root/'docs/asset-manifest.json'
manifest=json.loads(manifest_path.read_text())
for item in manifest:
    image=Image.open(root/'source-materials/assets'/item['source']).convert('RGB')
    if item['crop']: image=image.crop(item['crop'])
    variants=[]
    for width in (480,960,1440):
        if width>image.width and variants: continue
        variant=image.copy()
        variant.thumbnail((width,round(width*image.height/image.width)))
        for fmt in ('webp','avif'):
            path=root/'public/images'/f"{item['id']}-{width}.{fmt}"
            variant.save(path,quality=83 if fmt=='webp' else 66)
            variants.append({'path':str(path.relative_to(root/'public')),'width':variant.width,'height':variant.height,'bytes':path.stat().st_size})
    path=root/'public'/item['publicMaster'].lstrip('/')
    image.save(path,quality=88)
    item['variants']=variants
    item['sha256']=hashlib.sha256(path.read_bytes()).hexdigest()
manifest_path.write_text(json.dumps(manifest,indent=2)+'\n')
