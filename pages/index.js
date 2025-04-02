import { useEffect, useState } from 'react';
import Head from 'next/head';
import snippetsData from '../data/snippets.json';

import hljs from 'highlight.js/lib/core';
import glsl from 'highlight.js/lib/languages/glsl';
import 'highlight.js/styles/github.css';

hljs.registerLanguage('glsl', glsl);
export default function Home() {
  const [snippets, setSnippets] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setSnippets(snippetsData);
  }, []);

  const filtered = snippets.filter(s =>
    (s.content || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.title || '').toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    hljs.highlightAll();
  }, [filtered]);

return (
  <>
    <Head>
      <title>ShaderBit Cookbook</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link
        href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap"
        rel="stylesheet"
      />
    </Head>



<div className="min-h-screen bg-gray-50 text-white font-sans flex justify-center px-4 py-12">
  <div className="w-full max-w-6xl bg-gray-200 bg-grid rounded-lg p-8 shadow-md">
    {/* CONTENEDOR INTERIOR CENTRADO */}
    <div className="w-full max-w-4xl mx-auto">
      
      {/* LOGO + BUSCADOR JUNTOS */}
      <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
        <img
          src="/logo-retro.png"
          alt="ShaderBit Cookbook"
       className="h-28 sm:h-32 object-contain"
        />
        
        <input
          className="w-full sm:w-auto flex-1 px-4 py-2 bg-white text-black placeholder-gray-400 border border-[#400755] rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#400755]"
          placeholder="Buscar snippet..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>


          <ul className="space-y-8">
            {filtered.map((snippet) => (
              <li
                key={snippet.id}
                className="bg-white shadow-md rounded-lg p-6 border border-gray-200 transition hover:shadow-lg"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">{snippet.title || '(Sin título)'}</h2>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono">
                    {snippet.type}
                  </span>
                </div>
                <pre className="bg-gray-100 p-4 rounded overflow-auto">
                  <code className="language-glsl font-mono">
                    {snippet.content}
                  </code>
                </pre>
                <button
                  onClick={() => navigator.clipboard.writeText(snippet.content)}
                  className="text-xs text-blue-600 mt-2 hover:underline"
                >
                  📋 Copiar código
                </button>
                <p className="text-xs text-right text-gray-400 mt-2">
                  {new Date(snippet.created_at).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </>
);

}
