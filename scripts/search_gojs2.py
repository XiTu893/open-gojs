import re
data = open('node_modules/gojs/release/go.js', 'r', encoding='utf-8').read()

# Search for arrowhead geometry or arrow rendering
for pattern in ['arrowhead', 'Arrowhead', 'arrowGeometry', 'Standard.*Triangle', 'chevron', 'Chevron']:
    matches = [m.start() for m in re.finditer(pattern, data)]
    print(f"Pattern '{pattern}': {len(matches)} matches")
    for p in matches[:3]:
        snippet = data[max(0, p-30):p+200]
        print(f"  pos {p}: ...{snippet}...")
        print()

# Also search for how arrowheads are drawn (rotate, translate, canvas)
for pattern in ['rotate.*arrow', 'arrow.*rotate', 'canvas.*arrow', 'arrow.*canvas', 'translate.*arrow']:
    matches = [m.start() for m in re.finditer(pattern, data, re.IGNORECASE)]
    print(f"Pattern '{pattern}': {len(matches)} matches")
