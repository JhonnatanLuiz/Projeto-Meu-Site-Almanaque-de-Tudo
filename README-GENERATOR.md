Gerador de RSS e Sitemap - Almanaque de Tudo

Este script varre os arquivos HTML no diretório do projeto e gera `feed.xml` e `sitemap.xml`.

Pré-requisitos
- Node.js 14+ e npm

Instalação e uso (PowerShell)

```powershell
npm install
npm run generate
```

O script extrai: título (`<title>` ou primeiro `<h1>`), descrição (`<meta name="description">` ou primeiro parágrafo) e usa a data de modificação do arquivo como `pubDate`/`lastmod`.

Personalizações
- Você pode ajustar prioridades no `scripts/generate_feed.js` ou adicionar front-matter se preferir metadados explícitos por artigo.
