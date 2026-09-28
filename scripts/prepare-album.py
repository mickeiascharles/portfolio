"""Generate public WebP images from local album originals. Requires Pillow and pillow-heif.

Put originals in public/assets/album and commit only the generated web directory.
"""

from pathlib import Path

from PIL import Image, ImageOps
from pillow_heif import register_heif_opener

register_heif_opener()
root = Path(__file__).resolve().parents[1]
album = root / "public/assets/album"
output = album / "web"
output.mkdir(exist_ok=True)

for source in sorted(album.iterdir()):
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
