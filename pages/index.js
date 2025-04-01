import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Head from 'next/head';

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
    <>
      <Head>
        <title>ShaderBit Cookbook</title>
        <meta name="description" content="Colección de snippets y técnicas de shaders" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>

     <div className="min-h-screen bg-gray-50 text-gray-800 font-lato flex items-center justify-center px-4">
  <div className="max-w-3xl mx-auto">
    <h1 className="text-4xl font-bold mb-8 text-center">ShaderBit Cookbook</h1>
          <input
            className="w-full mb-8 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Buscar snippet..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <ul className="space-y-8">
            {filtered.map(snippet => (
              <li key={snippet.id} className="bg-white shadow rounded p-6">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{snippet.title || '(Sin título)'}</h2>
                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                    {snippet.type}
                  </span>
                </div>
                <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {snippet.content}
                </pre>
                <p className="text-xs text-right text-gray-500 mt-2">
                  {new Date(snippet.created_at).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
