"""Draws the app icon and the static splash from the design's SVG geometry.

Run from the project root (needs Pillow):  python3 scripts/generate-assets.py
"""

from PIL import Image, ImageDraw, ImageFont

TERRACOTA = '#B4532F'
PAPER = '#FBF3E8'
DARK_BG = '#1A1512'
DARK_ACCENT = '#D9774F'
DARK_INK = '#F2E8DA'

SERIF = 'node_modules/@expo-google-fonts/fraunces/600SemiBold/Fraunces_600SemiBold.ttf'
SANS = 'node_modules/@expo-google-fonts/dm-sans/500Medium/DMSans_500Medium.ttf'

# Everything is drawn this many times larger, then scaled down for smooth edges.
SS = 4


def draw_icon(draw, ox, oy, size, color, stroke):
    """The 120×120 'box of letters with a lock' icon, at (ox, oy) with the given size."""
    k = size / 120
    w = max(1, round(stroke * k))
    r = w / 2

    def p(x, y):
        return (ox + x * k, oy + y * k)

    def line(points):
        pts = [p(*pt) for pt in points]
        draw.line(pts, fill=color, width=w)
        for x, y in pts:  # round caps and joins
            draw.ellipse((x - r, y - r, x + r, y + r), fill=color)

    def arc(cx, cy, radius, start, end):
        x0, y0 = p(cx - radius, cy - radius)
        x1, y1 = p(cx + radius, cy + radius)
        draw.arc((x0 - r, y0 - r, x1 + r, y1 + r), start, end, fill=color, width=w)

    def rounded(x, y, rw, rh, rx):
        x0, y0 = p(x, y)
        x1, y1 = p(x + rw, y + rh)
        draw.rounded_rectangle((x0 - r, y0 - r, x1 + r, y1 + r), radius=rx * k + r, outline=color, width=w)

    # Letter sticking out of the box: M34 50V30a4 4 0 0 1 4-4h44a4 4 0 0 1 4 4v20
    line([(34, 50), (34, 30)])
    arc(38, 30, 4, 180, 270)
    line([(38, 26), (82, 26)])
    arc(82, 30, 4, 270, 360)
    line([(86, 30), (86, 50)])
    # Lines of text on the letter.
    line([(46, 36), (74, 36)])
    line([(46, 43), (64, 43)])
    # Box, lid line and the lock.
    rounded(20, 50, 80, 50, 10)
    line([(20, 62), (100, 62)])
    rounded(50, 74, 20, 16, 3)
    # Shackle: M54 74v-4a6 6 0 0 1 12 0v4
    line([(54, 74), (54, 70)])
    arc(60, 70, 6, 180, 360)
    line([(66, 70), (66, 74)])


def save(img, path, size):
    img.resize(size, Image.LANCZOS).save(path)
    print('wrote', path)


def app_icon(path, px, bg, fg, icon_ratio, stroke):
    big = px * SS
    img = Image.new('RGBA', (big, big), bg)
    icon = big * icon_ratio
    draw_icon(ImageDraw.Draw(img), (big - icon) / 2, (big - icon) / 2, icon, fg, stroke)
    # The App Store rejects icons with an alpha channel; transparent ones stay RGBA.
    if bg != (0, 0, 0, 0):
        img = img.convert('RGB')
    save(img, path, (px, px))


def splash(path, fg, icon_color):
    # Same layout as the animated splash in components/AnimatedSplash.tsx:
    # 132px icon, 22px gap, 34px title, 8px gap, 15px tagline. 1 logical px = 4 image px.
    scale = 4 * SS
    width = 300 * scale
    title_font = ImageFont.truetype(SERIF, 34 * scale)
    tag_font = ImageFont.truetype(SANS, 15 * scale)
    title, tagline = 'Cápsula do Tempo', 'Escreva hoje. Leia depois.'

    title_h = round(34 * 1.25 * scale)
    tag_h = round(15 * 1.4 * scale)
    height = 132 * scale + 22 * scale + title_h + 8 * scale + tag_h
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    draw_icon(draw, (width - 132 * scale) / 2, 0, 132 * scale, icon_color, 4)
    y = 132 * scale + 22 * scale
    draw.text((width / 2, y + title_h / 2), title, font=title_font, fill=fg, anchor='mm')
    y += title_h + 8 * scale
    draw.text((width / 2, y + tag_h / 2), tagline, font=tag_font, fill=fg, anchor='mm')
    save(img, path, (width // SS, height // SS))


if __name__ == '__main__':
    app_icon('assets/icon.png', 1024, TERRACOTA, PAPER, 0.72, 5)
    app_icon('assets/favicon.png', 48, TERRACOTA, PAPER, 0.8, 7)
    # Android adaptive icon: the launcher crops to the center ~66%, so keep the icon smaller.
    app_icon('assets/android-icon-foreground.png', 512, (0, 0, 0, 0), PAPER, 0.5, 5)
    app_icon('assets/android-icon-background.png', 512, TERRACOTA, TERRACOTA, 0, 5)
    app_icon('assets/android-icon-monochrome.png', 432, (0, 0, 0, 0), '#FFFFFF', 0.5, 5)
    splash('assets/splash-icon.png', PAPER, PAPER)
    splash('assets/splash-icon-dark.png', DARK_INK, DARK_ACCENT)
