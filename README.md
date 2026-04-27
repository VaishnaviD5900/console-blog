# console.blog

> Where CSS breaks and bugs get explained.

A frontend dev blog built with React + Vite. Covers debugging horror stories, CSS deep dives, best practices, and epic fails — all with interactive live code editors powered by Monaco.

## ✨ Features

- **Live code editors** — every code snippet is editable and runnable in the browser (powered by Monaco Editor — the same editor as VS Code)
- **CSS + HTML split pane** — `csshtml` blocks let you edit markup and styles separately and preview them live
- **Dark theme** with colorful accents — purple, teal, orange, pink
- **Smooth dual cursor** — subtle trailing dot follows your mouse
- **Filter by topic** — debugging, CSS, best practices, epic fails
- **Fully responsive** — works on all screen sizes

## 🛠 Tech Stack

- [React 18](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [React Router v6](https://reactrouter.com/)
- [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react)
- CSS Modules

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/console-blog.git
cd console-blog

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📦 Build for Production

```bash
npm run build
```

Output goes to `dist/`.

## 📝 Adding a New Post

All posts live in `src/data/posts.js`. Add a new object to the `posts` array:

```js
{
  id: 'your-post-slug',
  title: 'Your Post Title',
  excerpt: 'Short description shown on the card.',
  tag: 'css', // css | debug | bestpractice | epicfail
  date: 'May 1, 2025',
  readTime: '4 min read',
  featured: false,
  content: `
Your markdown-like content here.

## Heading

Paragraph text with \`inline code\`.

\`\`\`js
// Runnable JS snippet
console.log('hello')
\`\`\`

\`\`\`csshtml
HTML:
<div class="box">Hello</div>
CSS:
.box { color: red; }
\`\`\`
  `,
}
```

### Supported code block types

| Fence | Behaviour |
|-------|-----------|
| ` ```js ` | Runnable JS — output shown via `console.log` |
| ` ```css ` | Editable CSS — previewed on generic boxes |
| ` ```html ` | Rendered HTML preview |
| ` ```csshtml ` | Split HTML + CSS editor with live preview |
| ` ```ts `, ` ```bash `, etc. | Syntax highlighted, read-only |

## 🌐 Deploying to Vercel

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo at [vercel.com](https://vercel.com) for auto-deploys on every push.

## 📄 License

MIT
