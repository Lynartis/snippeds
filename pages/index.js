import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [snippets, setSnippets] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchSnippets();
  }, []);

  async function fetchSnippets() {
    const { data } = await supabase
      .from('snippets')
      .select('*')
      .order('created_at', { ascending: false });
    setSnippets(data || []);
  }

  const filtered = snippets.filter(s =>
    (s.content || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.title || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📘 Mis Snippets</h1>
      <input
        className="w-full p-2 border rounded mb-4"
        placeholder="Buscar..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <ul className="space-y-4">
        {filtered.map(snippet => (
          <li key={snippet.id} className="bg-gray-100 p-4 rounded shadow">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold">{snippet.title || '(Sin título)'}</h2>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                {snippet.type}
              </span>
            </div>
            <pre className="whitespace-pre-wrap text-sm">{snippet.content}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
}
