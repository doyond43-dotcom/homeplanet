from pathlib import Path
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas

ROOT = Path(".").resolve()
OUT = ROOT / "out"
OUT.mkdir(exist_ok=True)

COVERS_PACK = ROOT / "HomePlanet_Volume_Covers_and_Footers_Pack.pdf"

LINE1 = "Governed by HomePlanet Volume 0 — Planetary System Architecture"
LINE2 = "Inherits Presence-First Timestamping, Authority, and Truth Ledger"

def extract_cover(volume_number: int, out_path: Path):
    idx = volume_number - 1  # Vol 1 => page 0
    r = PdfReader(str(COVERS_PACK))
    w = PdfWriter()
    w.add_page(r.pages[idx])
    with out_path.open("wb") as f:
        w.write(f)

def concat_pdfs(inputs, out_path: Path):
    w = PdfWriter()
    for p in inputs:
        r = PdfReader(str(p))
        for page in r.pages:
            w.add_page(page)
    with out_path.open("wb") as f:
        w.write(f)

def prepend_cover(cover_pdf: Path, body_pdf: Path, out_pdf: Path):
    cr = PdfReader(str(cover_pdf))
    br = PdfReader(str(body_pdf))
    w = PdfWriter()
    w.add_page(cr.pages[0])
    for p in br.pages:
        w.add_page(p)
    with out_pdf.open("wb") as f:
        w.write(f)

def footer_overlay(page_w, page_h, resident=False):
    import tempfile, os
    fd, tmp_path = tempfile.mkstemp(suffix=".pdf")
    os.close(fd)

    c = canvas.Canvas(tmp_path, pagesize=(page_w, page_h))
    c.setFont("Helvetica", 9)
    y = 18
    c.drawCentredString(page_w/2, y, LINE1)
    if resident:
        c.setFont("Helvetica", 8)
        c.drawCentredString(page_w/2, y-10, LINE2)
    c.showPage()
    c.save()

    ov = PdfReader(tmp_path).pages[0]
    try:
        os.remove(tmp_path)
    except:
        pass
    return ov

def stamp_footer(in_pdf: Path, out_pdf: Path, resident=False):
    r = PdfReader(str(in_pdf))
    w = PdfWriter()
    for i, page in enumerate(r.pages):
        if i != 0:  # keep cover clean
            pw = float(page.mediabox.width)
            ph = float(page.mediabox.height)
            page.merge_page(footer_overlay(pw, ph, resident=resident))
        w.add_page(page)
    with out_pdf.open("wb") as f:
        w.write(f)

def require(path: Path):
    if not path.exists():
        raise SystemExit(f"Missing: {path.name}")

# Required inputs
require(COVERS_PACK)
require(ROOT / "HomePlanet_Career_Presence_System.pdf")
require(ROOT / "HomePlanet_Vehicles_Volume.pdf")
require(ROOT / "HomePlanet_Telemetry_and_Suggestions_LockIn.pdf")
require(ROOT / "HomePlanet_Live_Build_Telemetry_Mode_v2.pdf")
require(ROOT / "HomePlanet_Remix_Mode_Live_Reference_Capture_v2.pdf")

jobs = [
    # Volume 2 — Telemetry Systems (combined)
    {
        "vol": 2,
        "resident": False,
        "out": "HomePlanet_Volume_2_Telemetry_Systems.pdf",
        "inputs": [
            ROOT / "HomePlanet_Telemetry_and_Suggestions_LockIn.pdf",
            ROOT / "HomePlanet_Live_Build_Telemetry_Mode_v2.pdf",
        ],
    },
    # Volume 3 — Career Presence
    {
        "vol": 3,
        "resident": True,
        "out": "HomePlanet_Volume_3_Career_Presence.pdf",
        "inputs": [ROOT / "HomePlanet_Career_Presence_System.pdf"],
    },
    # Volume 5 — Vehicles
    {
        "vol": 5,
        "resident": True,
        "out": "HomePlanet_Volume_5_Vehicles.pdf",
        "inputs": [ROOT / "HomePlanet_Vehicles_Volume.pdf"],
    },
    # Volume 6 — Creator & Commerce (Remix Mode content)
    {
        "vol": 6,
        "resident": True,
        "out": "HomePlanet_Volume_6_Creator_Commerce.pdf",
        "inputs": [ROOT / "HomePlanet_Remix_Mode_Live_Reference_Capture_v2.pdf"],
    },
]

print("== HomePlanet Mechanical Merge ==")
print("Folder:", ROOT)

for j in jobs:
    vol = j["vol"]
    cover = OUT / f"Cover_Volume_{vol}.pdf"
    body  = OUT / f"Body_Volume_{vol}.pdf"
    merged = OUT / f"Merged_Volume_{vol}.pdf"
    final = OUT / j["out"]

    extract_cover(vol, cover)
    concat_pdfs(j["inputs"], body)
    prepend_cover(cover, body, merged)
    stamp_footer(merged, final, resident=j["resident"])

    print(f"✔ Volume {vol} -> {final.name}")

print("DONE. Final PDFs are in .\\out")
