from PIL import Image
from pathlib import Path

file = Path("public/images/homeplanet-live-pages-logo-green-transparent.png")
img = Image.open(file).convert("RGBA")
alpha = img.getchannel("A")

print("FILE:", file)
print("SIZE:", img.size)
print("HAS_TRANSPARENCY:", alpha.getextrema()[0] < 255)
print("ALPHA_RANGE:", alpha.getextrema())
