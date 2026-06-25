from PIL import Image
from pathlib import Path

src = Path("public/images/homeplanet_live_pages_logo_no_border_LOCKED.png")
out = Path("public/images/homeplanet_live_pages_logo_REAL_TRANSPARENT.png")

img = Image.open(src).convert("RGBA")
px = img.load()
w, h = img.size

# Remove black/dark panel background while keeping bright logo/text/glow.
for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        brightness = max(r, g, b)

        # Fully remove near-black background.
        if brightness < 18:
            px[x, y] = (r, g, b, 0)

        # Feather very dark pixels so edges don't leave a hard box.
        elif brightness < 42:
            alpha = int((brightness - 18) / 24 * 115)
            px[x, y] = (r, g, b, alpha)

# Crop to visible content.
alpha = img.getchannel("A")
bbox = alpha.getbbox()
if bbox:
    pad = 26
    left = max(0, bbox[0] - pad)
    top = max(0, bbox[1] - pad)
    right = min(w, bbox[2] + pad)
    bottom = min(h, bbox[3] + pad)
    img = img.crop((left, top, right, bottom))

img.save(out)
print(out)
