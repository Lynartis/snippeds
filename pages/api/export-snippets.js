import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // ✅ Comprobar el token secreto antes de continuar
  const secret = req.query.secret;
  if (secret !== process.env.EXPORT_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // 1. Obtener snippets desde Supabase
  const { data, error } = await supabase
    .from('snippets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // 2. Convertir a JSON string
  const jsonContent = JSON.stringify(data, null, 2);

  // 3. Preparar parámetros de GitHub
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_REPO = process.env.GITHUB_REPO;
  const FILE_PATH = process.env.GITHUB_FILE_PATH || 'data/snippets.json';
  const BRANCH = process.env.GITHUB_BRANCH || 'main';

  const [owner, repo] = GITHUB_REPO.split('/');

  const commitMessage = `chore: update snippets.json (${new Date().toISOString()})`;

  // 4. Obtener SHA del archivo actual (si existe)
  const existing = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${FILE_PATH}?ref=${BRANCH}`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json'
      }
    }
  );

  const existingData = existing.ok ? await existing.json() : null;

  // 5. Subir el nuevo archivo con GitHub API
  const result = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${FILE_PATH}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        message: commitMessage,
        content: Buffer.from(jsonContent).toString('base64'),
        branch: BRANCH,
        sha: existingData?.sha || undefined
      })
    }
  );

  if (!result.ok) {
    const err = await result.json();
    return res.status(500).json({ error: 'GitHub upload failed', details: err });
  }

  return res.status(200).json({ success: true, updated: FILE_PATH });
}
