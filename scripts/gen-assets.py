import os

street = os.path.join(os.path.dirname(__file__), "..", "public", "assets", "street")
files = sorted(os.listdir(street))

def pick(prefix, exclude=None):
    for f in files:
        if not f.startswith(prefix):
            continue
        if exclude and any(x in f for x in exclude):
            continue
        return f
    return files[0]

m = {
    "bg": pick("3.1"),
    "mountain": pick("S2"),
    "fgCloud": pick("G1"),
    "fgWillow": pick("G2"),
    "teahouse": pick("A5"),
    "inn": pick("A1", exclude=["wzt"]),
    "pharmacy": pick("A3"),
    "sancaiStall": pick("B3"),
    "hubing": pick("B1"),
    "bookstall": pick("B8"),
    "waiter": pick("C1"),
    "waner": pick("C2"),
    "lady": pick("C4"),
    "monk": pick("C9"),
    "storyteller": pick("C10"),
    "merchant": pick("C11"),
    "stonemason": pick("C6"),
    "child": pick("C8"),
    "bookman": pick("C3"),
    "hall": pick("3.3"),
    "steleBg": pick("7.2"),
    "stele": pick("7.3"),
}

lines = [
    "const BASE = import.meta.env.BASE_URL;",
    "",
    "export function asset(path) {",
    '  return `${BASE}${path.replace(/^\\//, "")}`;',
    "}",
    "",
    "export const ASSETS = {",
    "  intro: { source: asset('assets/intro/scroll-brush-source.png') },",
    "  street: {",
    f"    bg: asset('assets/street/{m['bg']}'),",
    f"    mountain: asset('assets/street/{m['mountain']}'),",
    f"    fgCloud: asset('assets/street/{m['fgCloud']}'),",
    f"    fgWillow: asset('assets/street/{m['fgWillow']}'),",
    "  },",
    "  buildings: {",
    f"    teahouse: asset('assets/street/{m['teahouse']}'),",
    f"    inn: asset('assets/street/{m['inn']}'),",
    f"    pharmacy: asset('assets/street/{m['pharmacy']}'),",
    f"    sancaiStall: asset('assets/street/{m['sancaiStall']}'),",
    f"    hubing: asset('assets/street/{m['hubing']}'),",
    f"    bookstall: asset('assets/street/{m['bookstall']}'),",
    "  },",
    "  npc: {",
    f"    waiter: asset('assets/street/{m['waiter']}'),",
    f"    waner: asset('assets/street/{m['waner']}'),",
    f"    lady: asset('assets/street/{m['lady']}'),",
    f"    monk: asset('assets/street/{m['monk']}'),",
    f"    storyteller: asset('assets/street/{m['storyteller']}'),",
    f"    merchant: asset('assets/street/{m['merchant']}'),",
    f"    stonemason: asset('assets/street/{m['stonemason']}'),",
    f"    child: asset('assets/street/{m['child']}'),",
    f"    bookman: asset('assets/street/{m['bookman']}'),",
    "  },",
    "  palace: {",
    f"    hall: asset('assets/street/{m['hall']}'),",
    f"    steleBg: asset('assets/street/{m['steleBg']}'),",
    f"    stele: asset('assets/street/{m['stele']}'),",
    "  },",
    "};",
    "",
]

out = os.path.join(os.path.dirname(__file__), "..", "src", "data", "assets.js")
with open(out, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))
print("wrote", out)
for k, v in m.items():
    print(k, v)
