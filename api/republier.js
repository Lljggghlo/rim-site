// Republication quotidienne du site (appelée chaque jour par la tâche planifiée Vercel).
// Elle relance une construction : les articles du blog dont la date est arrivée sont publiés.
// Variables d'environnement à créer dans Vercel : CRON_SECRET et DEPLOY_HOOK_URL.
export default async function handler(req, res) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ ok: false });
  }
  const hook = process.env.DEPLOY_HOOK_URL;
  if (!hook) return res.status(500).json({ ok: false, erreur: 'DEPLOY_HOOK_URL manquante' });
  const r = await fetch(hook, { method: 'POST' });
  return res.status(r.ok ? 200 : 502).json({ ok: r.ok, statut: r.status });
}
