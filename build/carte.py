# Génère data/carte-idf.json : tracés SVG de l'Île-de-France (8 départements) et d'une France miniature
import json, math, sys
from shapely.geometry import shape, Point
from shapely.ops import unary_union
full = json.load(open(sys.argv[1])); simp = json.load(open(sys.argv[2])); out = sys.argv[3]
IDF = ['75','77','78','91','92','93','94','95']
NOMS = {'75':'Paris','77':'Seine-et-Marne','78':'Yvelines','91':'Essonne','92':'Hauts-de-Seine','93':'Seine-Saint-Denis','94':'Val-de-Marne','95':"Val-d'Oise"}
k = math.cos(math.radians(48.75))
def proj(lon, lat): return (lon * k, -lat)
geoms = {f['properties']['code']: shape(f['geometry']) for f in full['features'] if f['properties']['code'] in IDF}
allg = unary_union(list(geoms.values()))
minx, miny, maxx, maxy = allg.bounds
X0, Y1 = proj(minx, maxy); X1, Y0 = proj(maxx, miny)
W = 1000; S = W / (X1 - X0); H = (Y0 - Y1) * S; PAD = 12
def P(lon, lat):
    x, y = proj(lon, lat); return ((x - X0) * S + PAD, (y - Y1) * S + PAD)
def path(g, tol):
    g = g.simplify(tol, preserve_topology=True)
    polys = [g] if g.geom_type == 'Polygon' else list(g.geoms)
    d = []
    for p in polys:
        for ring in [p.exterior] + list(p.interiors):
            pts = [P(*c) for c in ring.coords]
            d.append('M' + 'L'.join(f'{x:.1f},{y:.1f}' for x, y in pts) + 'Z')
    return ''.join(d)
deps = []
for c in IDF:
    g = geoms[c]
    rp = g.centroid if g.contains(g.centroid) else g.representative_point()
    lx, ly = P(rp.x, rp.y)
    deps.append({'code': c, 'nom': NOMS[c], 'd': path(g, 0.002), 'lx': round(lx, 1), 'ly': round(ly, 1)})
gx, gy = P(2.0739, 48.7733)
res = {'w': round(W + 2 * PAD), 'h': round(H + 2 * PAD), 'deps': deps, 'guyancourt': [round(gx, 1), round(gy, 1)]}
# France miniature
fr = [shape(f['geometry']) for f in simp['features']]
frall = unary_union(fr)
fminx, fminy, fmaxx, fmaxy = frall.bounds
fX0, fY1 = proj(fminx, fmaxy); fX1, fY0 = proj(fmaxx, fminy)
FW = 300; FS = FW / (fX1 - fX0); FH = (fY0 - fY1) * FS
def FP(lon, lat):
    x, y = proj(lon, lat); return ((x - fX0) * FS + 4, (y - fY1) * FS + 4)
def fpath(g, tol):
    g = g.simplify(tol, preserve_topology=True)
    polys = [g] if g.geom_type == 'Polygon' else list(g.geoms)
    return ''.join('M' + 'L'.join(f'{x:.1f},{y:.1f}' for x, y in (FP(*c) for c in p.exterior.coords)) + 'Z' for p in polys if p.area > 0.002)
res['france'] = {'w': round(FW + 8), 'h': round(FH + 8), 'd': fpath(frall, 0.03), 'idf': fpath(unary_union([shape(f['geometry']) for f in simp['features'] if f['properties']['code'] in IDF]), 0.005)}
json.dump(res, open(out, 'w'))
print(res['w'], res['h'], [(d['code'], d['lx'], d['ly'], len(d['d'])) for d in deps], res['guyancourt'], res['france']['w'], res['france']['h'], len(res['france']['d']))
