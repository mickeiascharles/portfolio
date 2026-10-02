"""Gera imagens WebP a partir dos originais locais do álbum.

Coloque os originais em public/assets/album e versione apenas a pasta web gerada.
Arquivos HEIC exigem pillow-heif; os demais formatos precisam apenas de Pillow.
"""

import argparse
from pathlib import Path

from PIL import Image, ImageOps

root = Path(__file__).resolve().parents[1]
album = root / "public/assets/album"
output = album / "web"
output.mkdir(exist_ok=True)

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("arquivos", nargs="*", help="Nomes dos originais a processar")
args = parser.parse_args()

sources = [album / name for name in args.arquivos] if args.arquivos else [
    source for source in album.iterdir() if source.is_file()
]
for source in sources:
    if source.resolve().parent != album or not source.is_file():
        parser.error(f"Arquivo fora da pasta de originais ou inexistente: {source}")

if any(source.suffix.lower() == ".heic" for source in sources):
    from pillow_heif import register_heif_opener

    register_heif_opener()

for source in sorted(sources):
    if source.suffix.lower() not in {".jpg", ".jpeg", ".png", ".heic"}:
        continue
    with Image.open(source) as original:
        photo = ImageOps.exif_transpose(original).convert("RGB")
        photo.thumbnail((1920, 1920), Image.Resampling.LANCZOS)
        photo.save(output / f"{source.stem}.webp", quality=86, method=6)
        width, height = photo.size
        photo.thumbnail((720, 720), Image.Resampling.LANCZOS)
        photo.save(output / f"{source.stem}-thumb.webp", quality=80, method=6)
        print(f"{source.stem}: {width}x{height}")
