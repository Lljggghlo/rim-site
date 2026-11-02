import os, re, json, html, glob, sys, collections
from html.parser import HTMLParser
D = '/home/claude/site/dist'; BASE = 'https://www.rimconciergerie.fr'
pages = sorted(glob.glob(D + '/**/*.html', recursive=True))
pages = [p for p in pages if '/admin/' not in p and 'google0995' not in p]
issues = collections.defaultdict(list)
def path_of(f):
    r = '/' + os.path.relpath(f, D)
    if r.endswith('/index.html'): r = r[:-10] or '/'
    if r != '/' and r.endswith('/'): r = r[:-1]
    return r
BANNED = [r'\bMarrakech\b', r'\bMaroc\b', r'[Aa]cademy', r'\bformation\b', r'\bmandat\b', r'\bgaranti', r'tout risque', r'À COMPLÉTER', r'TODO', r'lorem', r'undefined', r'\bNaN\b', r'\[object']
nap_phone = set(); nap_addr = set(); ids_all = {}
sitemap = open(D + '/sitemap.xml').read()
sm_urls = re.findall(r'<loc>([^<]+)</loc>', sitemap)
texts = {}
for f in pages:
    p = path_of(f); h = open(f).read()
    t = re.search(r'<title>(.*?)</title>', h, re.S); t = html.unescape(t.group(1)) if t else ''
    d = re.search(r'<meta name="description" content="([^"]*)"', h); d = html.unescape(d.group(1)) if d else ''
    noidx = 'noindex' in (re.search(r'<meta name="robots" content="([^"]*)"', h) or [None, ''])[1] if re.search(r'<meta name="robots"', h) else False
    if not t: issues[p].append('title manquant')
    elif len(t) > 60: issues[p].append(f'title {len(t)} car.')
    if not noidx:
        if not d: issues[p].append('description manquante')
        elif len(d) > 155: issues[p].append(f'description {len(d)} car.')
        elif len(d) < 70: issues[p].append(f'description courte {len(d)}')
    n1 = len(re.findall(r'<h1[\s>]', h))
    if n1 != 1: issues[p].append(f'{n1} H1')
    can = re.search(r'<link rel="canonical" href="([^"]+)"', h)
    if not noidx:
        if not can: issues[p].append('canonical manquante')
        elif can.group(1) != BASE + (p if p != '/' else '/') and can.group(1) != BASE + p: issues[p].append(f'canonical {can.group(1)}')
        url = can.group(1) if can else ''
        if url and url not in sm_urls: issues[p].append('absente du sitemap')
    else:
        if any(u.endswith(p) for u in sm_urls if p != '/'): issues[p].append('noindex mais dans sitemap')
    for og in ['og:title', 'og:description', 'og:image', 'og:url', 'og:locale']:
        if f'property="{og}"' not in h: issues[p].append(f'{og} manquant')
    for blk in re.findall(r'<script type="application/ld\+json">(.*?)</script>', h, re.S):
        try:
            j = json.loads(blk)
            s = json.dumps(j)
            if 'AggregateRating' in s: issues[p].append('AggregateRating présent')
            if '"FAQPage"' in s and 'class="faq' not in h: issues[p].append('FAQPage sans FAQ visible')
        except Exception as e: issues[p].append(f'JSON-LD invalide {e}')
    for img in re.findall(r'<img\b[^>]*>', h):
        if 'alt=' not in img: issues[p].append('img sans alt: ' + img[:80])
        if 'width=' not in img or 'height=' not in img: issues[p].append('img sans dimensions: ' + img[:80])
    body = re.sub(r'<script.*?</script>|<style.*?</style>', ' ', h, flags=re.S)
    vis = html.unescape(re.sub(r'<[^>]+>', ' ', body))
    texts[p] = re.sub(r'\s+', ' ', vis)
    for b in BANNED:
        for m in re.finditer(b, vis):
            ctx = vis[max(0, m.start()-50):m.end()+50].replace('\n', ' ')
            issues[p].append(f'mot «{m.group(0)}» : …{ctx.strip()}…')
    ids = re.findall(r'\bid="([^"]+)"', h)
    dup = [i for i, c in collections.Counter(ids).items() if c > 1]
    if dup: issues[p].append(f'id dupliqués {dup}')
    for a in re.findall(r'<a\b[^>]*href="([^"]*)"', h):
        if a in ('', '#'): issues[p].append('lien vide')
        if a.startswith('http://'): issues[p].append('lien http ' + a)
    for m in re.findall(r'(?:\+33|0)\s?[1-9](?:[\s.]?\d{2}){4}', vis): nap_phone.add(m.strip())
    for m in re.findall(r'\d+ clos de l.Oural[^,<]{0,40}', vis, re.I): nap_addr.add(re.sub(r'\s+', ' ', m.strip()))
    if 'target="_blank"' in h:
        for a in re.findall(r'<a\b[^>]*target="_blank"[^>]*>', h):
            if 'noopener' not in a: issues[p].append('target blank sans noopener')
# sitemap urls existent
for u in sm_urls:
    q = u.replace(BASE, '') or '/'
    f = D + (q if q.endswith('.html') else (q.rstrip('/') + '/index.html' if q != '/' else '/index.html'))
    if not os.path.exists(f) and not os.path.exists(D + q + '.html'): issues['sitemap'].append('URL inexistante ' + u)
# similarité entre pages villes (anti-clones)
villes = [p for p in texts if p.startswith('/conciergerie-airbnb-')]
def shingles(t, k=8):
    w = t.lower().split(); return set(' '.join(w[i:i+k]) for i in range(len(w)-k))
sh = {p: shingles(texts[p]) for p in villes}
pairs = []
for i, a in enumerate(villes):
    for b in villes[i+1:]:
        j = len(sh[a] & sh[b]) / max(1, len(sh[a] | sh[b])); pairs.append((round(j, 2), a, b))
pairs.sort(reverse=True)
print('PAGES', len(pages))
for p, l in sorted(issues.items()):
    for x in l: print(p, '|', x)
print('TÉLÉPHONES', nap_phone); print('ADRESSES', nap_addr)
print('SIMILARITÉ max villes', pairs[:5])
