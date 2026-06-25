from PIL import Image
from pathlib import Path

src = Path("public/images/homeplanet-live-pages-logo-green.png")
out = Path("public/images/homeplanet-live-pages-logo-green-transparent.png")

img = Image.open(src).convert("RGBA")
px = img.load()
w, h = img.size

# Remove black background while keeping white text, blue subtitle, green glow.
for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        brightness = max(r, g, b)

        # Kill pure/near black.
        if brightness < 10:
            px[x, y] = (r, g, b, 0)

        # Feather dark edge pixels so no hard box remains.
        elif brightness < 38:
            alpha = int((brightness - 10) / 28 * 130)
            px[x, y] = (r, g, b, alpha)

# Crop to visible content with padding.
alpha = img.getchannel("A")
bbox = alpha.getbbox()
if bbox:
    pad = 24
    left = max(0, bbox[0] - pad)
    top = max(0, bbox[1] - pad)
    right = min(w, bbox[2] + pad)
    bottom = min(h, bbox[3] + pad)
    img = img.crop((left, top, right, bottom))

img.save(out)
print(out)
