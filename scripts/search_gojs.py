import re
data = open('node_modules/gojs/release/go.js', 'r', encoding='utf-8').read()

# Search for arrowhead rendering code
for pattern in ['_renderArrow', 'arrowheadGeometry', 'toArrow']:
    matches = [m.start() for m in re.finditer(pattern, data)]
    print(f"Pattern '{pattern}': {len(matches)} matches")
    for p in matches[:5]:
        snippet = data[max(0, p-50):p+150]
        print(f"  pos {p}: ...{snippet}...")
        print()
