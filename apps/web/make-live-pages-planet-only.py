from PIL import Image
from pathlib import Path

src = Path("public/images/homeplanet_live_pages_logo_no_border_LOCKED.png")
out = Path("public/images/homeplanet_live_pages_planet_mark_TRANSPARENT.png")

img = Image.open(src).convert("RGBA")
w, h = img.size

# Crop the left side where the planet/ring lives
crop = img.crop((0, 0, int(w * 0.34), h))

px = crop.load()
cw, ch = crop.size

# Remove dark background while keeping ring glow and planet glow
for y in range(ch):
    for x in range(cw):
        r, g, b, a = px[x, y]
        brightness = max(r, g, b)

        if brightness < 16:
            px[x, y] = (r, g, b, 0)
        elif brightness < 52:
            alpha = int((brightness - 16) / 36 * 140)
            px[x, y] = (r, g, b, alpha)

# Tight crop to visible content with padding
alpha = crop.getchannel("A")
bbox = alpha.getbbox()
if bbox:
    pad = 20
    left = max(0, bbox[0] - pad)
    top = max(0, bbox[1] - pad)
    right = min(cw, bbox[2] + pad)
    bottom = min(ch, bbox[3] + pad)
    crop = crop.crop((left, top, right, bottom))

crop.save(out)
print(out)
