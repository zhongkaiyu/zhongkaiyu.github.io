#!/usr/bin/env python3
"""Prepare "Us" photos for a fast-loading gallery.

Two things:
  1. Optimise oversized ORIGINALS in place (cap longest side at FULL_DIM, re-save as
     JPEG) so the "click to enlarge" full image is still sharp but not a 3 MB phone
     photo. Only genuinely heavy files are touched, and never made larger.
  2. Generate small THUMBNAILS under assets/img/moment_us_thumb/<trip>/<name> that the
     gallery actually displays. These are tiny (a few tens of KB), so the page loads
     fast; the full image is loaded only when a photo is clicked (data-zoom-src).

Re-run after adding/removing photos:
  python3 _scripts/optimize_moments_photos.py
"""
import io
import os
from PIL import Image, ImageOps

HERE = os.path.dirname(__file__)
ROOT = os.path.normpath(os.path.join(HERE, "..", "assets", "img", "moment_us"))
THUMB_ROOT = os.path.normpath(os.path.join(HERE, "..", "assets", "img", "moment_us_thumb"))

FULL_DIM = 1600              # cap longest side of the full (zoom) image
FULL_QUALITY = 85
SIZE_THRESHOLD = 500 * 1024  # only optimise originals heavier than this
MIN_SAVING = 0.9             # ...and only if the result is <90% of the original

THUMB_DIM = 720              # longest side of the displayed thumbnail
THUMB_QUALITY = 75

IMG_EXT = (".jpg", ".jpeg", ".png")


def optimise_full(p):
    sz = os.path.getsize(p)
    if sz <= SIZE_THRESHOLD:
        return sz, sz, False
    with Image.open(p) as im:
        im = ImageOps.exif_transpose(im)
        w, h = im.size
        if max(w, h) > FULL_DIM:
            s = FULL_DIM / max(w, h)
            im = im.resize((round(w * s), round(h * s)), Image.LANCZOS)
        buf = io.BytesIO()
        im.convert("RGB").save(buf, "JPEG", quality=FULL_QUALITY, optimize=True, progressive=True)
    if buf.tell() >= sz * MIN_SAVING:
        return sz, sz, False
    with open(p, "wb") as f:
        f.write(buf.getvalue())
    return sz, buf.tell(), True


def make_thumb(p, tp):
    os.makedirs(os.path.dirname(tp), exist_ok=True)
    with Image.open(p) as im:
        im = ImageOps.exif_transpose(im)
        w, h = im.size
        if max(w, h) > THUMB_DIM:
            s = THUMB_DIM / max(w, h)
            im = im.resize((round(w * s), round(h * s)), Image.LANCZOS)
        im.convert("RGB").save(tp, "JPEG", quality=THUMB_QUALITY, optimize=True, progressive=True)
    return os.path.getsize(tp)


def main():
    full_before = full_after = thumb_total = 0
    optimised = thumbs = 0
    for dirpath, _, files in os.walk(ROOT):
        for fn in sorted(files):
            if not fn.lower().endswith(IMG_EXT):
                continue
            p = os.path.join(dirpath, fn)
            b, a, changed = optimise_full(p)
            full_before += b
            full_after += a
            if changed:
                optimised += 1
                print(f"  optimise {fn:30} {b/1024:7.0f}KB -> {a/1024:6.0f}KB")
            rel = os.path.relpath(p, ROOT)
            tp = os.path.join(THUMB_ROOT, rel)
            thumb_total += make_thumb(p, tp)
            thumbs += 1
    print(f"\noriginals: {optimised} optimised, {full_before/1048576:.1f}MB -> {full_after/1048576:.1f}MB")
    print(f"thumbnails: {thumbs} generated, {thumb_total/1048576:.1f}MB total  (this is what the page loads)")


if __name__ == "__main__":
    main()
