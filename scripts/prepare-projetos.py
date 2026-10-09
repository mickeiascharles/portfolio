import argparse
from pathlib import Path

from PIL import Image

root = Path(__file__).resolve().parents[1]
projetos = root / "public/assets/projetos"
output = projetos / "web"
output.mkdir(exist_ok=True)

parser = argparse.ArgumentParser(description="Gera logos WebP leves a partir dos originais dos projetos.")
parser.add_argument("arquivos", nargs="*", help="Nomes dos originais a processar")
args = parser.parse_args()

sources = [projetos / name for name in args.arquivos] if args.arquivos else [
    source for source in projetos.iterdir() if source.is_file()
]
for source in sources:
    if source.resolve().parent != projetos or not source.is_file():
        parser.error(f"Arquivo fora da pasta de originais ou inexistente: {source}")

for source in sorted(sources):
    if source.suffix.lower() not in {".png", ".jpg", ".jpeg", ".webp"}:
        continue
    with Image.open(source) as original:
        logo = original.convert("RGBA")
        logo = logo.crop(logo.getchannel("A").getbbox())
        logo.thumbnail((1320, 312), Image.Resampling.LANCZOS)
        logo.save(output / f"{source.stem}.webp", quality=90, alpha_quality=100, method=6)
        print(f"{source.stem}: {logo.width}x{logo.height}")
