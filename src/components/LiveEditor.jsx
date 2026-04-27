import { useState, useCallback } from 'react'
import Editor from '@monaco-editor/react'
import styles from './LiveEditor.module.css'

// ─── Preview builders ─────────────────────────────────────────────────────────

const buildCssHtmlPreview = (html, css) => `<!DOCTYPE html>
<html><head><style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:#0d0d0f;color:#e8e8f0;font-family:'Segoe UI',sans-serif;
       min-height:100vh;padding:1.5rem;}
  ${css}
</style></head><body>${html}</body></html>`

const buildCssPreview = (css) => `<!DOCTYPE html>
<html><head><style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:#0d0d0f;color:#e8e8f0;font-family:'Segoe UI',sans-serif;
       display:flex;align-items:center;justify-content:center;
       min-height:100vh;padding:2rem;gap:1rem;flex-wrap:wrap;}
  .box{width:80px;height:80px;background:#333;display:flex;align-items:center;
       justify-content:center;font-size:12px;}
  ${css}
</style></head><body>
  <div class="box">Box A</div><div class="box">Box B</div><div class="box">Box C</div>
</body></html>`

const buildHtmlPreview = (html) => `<!DOCTYPE html>
<html><head><style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:#0d0d0f;color:#e8e8f0;font-family:'Segoe UI',sans-serif;
       padding:1.5rem;font-size:15px;line-height:1.6;}
  a{color:#7c6af7;}
  button{background:#7c6af7;color:#fff;border:none;padding:8px 16px;
         border-radius:6px;cursor:pointer;font-size:14px;margin:4px;}
  input,select,textarea{background:#1a1a1f;color:#e8e8f0;
    border:1px solid rgba(255,255,255,0.12);padding:8px 12px;
    border-radius:6px;font-size:14px;margin:4px;}
</style></head><body>${html}</body></html>`

const buildJsPreview = (code) => `<!DOCTYPE html>
<html><head><style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:#0d0d0f;color:#e8e8f0;font-family:'JetBrains Mono',monospace;
       padding:1.5rem;font-size:13px;line-height:1.7;}
  #out{background:#141417;border:1px solid rgba(255,255,255,0.07);
       border-radius:8px;padding:1rem;min-height:60px;white-space:pre-wrap;}
  .l{color:#2dd4bf;margin:2px 0;} .l::before{content:'> ';color:#6b6b7e;}
  .e{color:#f472b6;}             .e::before{content:'✕ ';}
</style></head><body>
<div id="out"></div>
<script>
  const o=document.getElementById('out');
  console.log=(...a)=>{const d=document.createElement('div');d.className='l';
    d.textContent=a.map(x=>typeof x==='object'?JSON.stringify(x,null,2):String(x)).join(' ');o.appendChild(d);}
  console.error=(...a)=>{const d=document.createElement('div');d.className='e';
    d.textContent=a.join(' ');o.appendChild(d);}
  window.onerror=(m,s,l)=>{const d=document.createElement('div');d.className='e';
    d.textContent=m+' (line '+l+')';o.appendChild(d);}
  try{${code}}catch(e){console.error(e.message)}
<\/script></body></html>`

function buildPreview(lang, code, html, css) {
  const l = lang?.toLowerCase()
  if (l === 'csshtml')                   return buildCssHtmlPreview(html, css)
  if (l === 'css')                        return buildCssPreview(code)
  if (l === 'js' || l === 'javascript')   return buildJsPreview(code)
  if (l === 'html')                       return buildHtmlPreview(code)
  return buildHtmlPreview(code)
}

// ─── Config ───────────────────────────────────────────────────────────────────

const RUNNABLE  = ['css', 'js', 'javascript', 'html', 'csshtml']
const MONO_LANG = {
  js:'javascript', javascript:'javascript', css:'css', html:'html',
  ts:'typescript', typescript:'typescript', jsx:'javascript', tsx:'typescript',
  json:'json', bash:'shell', sh:'shell', csshtml:'css',
}
const THEME = 'consoleBlog'

function defineTheme(monaco) {
  monaco.editor.defineTheme(THEME, {
    base: 'vs-dark', inherit: true,
    rules: [
      { token:'comment',         foreground:'4a4a5e', fontStyle:'italic' },
      { token:'keyword',         foreground:'7c6af7' },
      { token:'string',          foreground:'f97316' },
      { token:'number',          foreground:'f472b6' },
      { token:'type',            foreground:'2dd4bf' },
      { token:'tag',             foreground:'7c6af7' },
      { token:'attribute.name',  foreground:'2dd4bf' },
      { token:'attribute.value', foreground:'f97316' },
      { token:'property',        foreground:'2dd4bf' },
    ],
    colors: {
      'editor.background':                '#0d0d0f',
      'editor.foreground':                '#c9d1d9',
      'editorLineNumber.foreground':       '#3a3a50',
      'editorLineNumber.activeForeground': '#6b6b7e',
      'editor.lineHighlightBackground':    '#141417',
      'editor.selectionBackground':        '#7c6af740',
      'editorCursor.foreground':           '#2dd4bf',
      'editorWidget.background':           '#141417',
      'editorSuggestWidget.background':    '#141417',
      'editorSuggestWidget.border':        '#1a1a1f',
      'editorSuggestWidget.selectedBackground': '#252530',
    },
  })
}

const monacoOptions = {
  fontSize: 13,
  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
  fontLigatures: true,
  lineHeight: 21,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  wordWrap: 'on',
  tabSize: 2,
  renderLineHighlight: 'line',
  scrollbar: { verticalScrollbarSize: 4, horizontalScrollbarSize: 4 },
  overviewRulerLanes: 0,
  padding: { top: 12, bottom: 12 },
  quickSuggestions: { strings: true, comments: false, other: true },
  bracketPairColorization: { enabled: true },
  renderWhitespace: 'none',
  contextmenu: true,
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LiveEditor({ lang, initialCode = '', initialHtml = '', initialCss = '' }) {
  const isCssHtml  = lang?.toLowerCase() === 'csshtml'
  const isRunnable = RUNNABLE.includes(lang?.toLowerCase())

  // State
  const [code, setCode]       = useState(initialCode.trim())
  const [html, setHtml]       = useState(initialHtml.trim())
  const [css,  setCss]        = useState(initialCss.trim())
  const [preview, setPreview] = useState(null)
  const [isOpen, setIsOpen]   = useState(false)
  const [tab, setTab]         = useState(isCssHtml ? 'css' : 'code')
  const [copied, setCopied]   = useState(false)

  const editorValue   = isCssHtml ? (tab === 'html' ? html : css) : code
  const editorLang    = isCssHtml ? (tab === 'html' ? 'html' : 'css') : (MONO_LANG[lang?.toLowerCase()] ?? 'plaintext')
  const lineCount     = editorValue.split('\n').length
  const editorHeight  = Math.min(Math.max(lineCount * 21 + 24, 100), 400)

  const handleChange = useCallback((val = '') => {
    if (isCssHtml) { tab === 'html' ? setHtml(val) : setCss(val) }
    else setCode(val)
  }, [isCssHtml, tab])

  const runCode = useCallback(() => {
    setPreview(buildPreview(lang, code, html, css))
    setTab('result')
  }, [lang, code, html, css])

  const handleCopy = () => {
    navigator.clipboard.writeText(isCssHtml ? `HTML:\n${html}\n\nCSS:\n${css}` : code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    setCode(initialCode.trim())
    setHtml(initialHtml.trim())
    setCss(initialCss.trim())
    setPreview(null)
    setTab(isCssHtml ? 'css' : 'code')
  }

  const handleMount = (editor, monaco) => {
    defineTheme(monaco)
    monaco.editor.setTheme(THEME)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, runCode)
  }

  // ── Collapsed ──────────────────────────────────────────────────────────────
  if (!isOpen) {
    const displayCode = isCssHtml
      ? `/* HTML */\n${html}\n\n/* CSS */\n${css}`
      : code
    return (
      <div className={styles.collapsed}>
        <div className={styles.bar}>
          <span className={styles.langBadge}>{isCssHtml ? 'html + css' : (lang || 'code')}</span>
          <div className={styles.barActions}>
            <button className={styles.iconBtn} onClick={handleCopy}>{copied ? '✓ copied' : '⎘ copy'}</button>
            {isRunnable && (
              <button className={styles.runBtn} onClick={() => {
                setIsOpen(true)
                setPreview(buildPreview(lang, code, html, css))
                setTab('result')
              }}>▶ run</button>
            )}
            <button className={styles.iconBtn} onClick={() => setIsOpen(true)}>✎ edit</button>
          </div>
        </div>
        <pre className={styles.staticCode}><code>{displayCode}</code></pre>
      </div>
    )
  }

  // ── Expanded ───────────────────────────────────────────────────────────────
  return (
    <div className={styles.editor}>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.tabs}>
          {isCssHtml ? (
            <>
              <button className={`${styles.tab} ${tab === 'css'  ? styles.tabActive : ''}`} onClick={() => setTab('css')}>CSS</button>
              <button className={`${styles.tab} ${tab === 'html' ? styles.tabActive : ''}`} onClick={() => setTab('html')}>HTML</button>
            </>
          ) : (
            <button className={`${styles.tab} ${tab === 'code' ? styles.tabActive : ''}`} onClick={() => setTab('code')}>✎ code</button>
          )}
          {isRunnable && (
            <button
              className={`${styles.tab} ${tab === 'result' ? styles.tabActive : ''}`}
              onClick={() => { setPreview(buildPreview(lang, code, html, css)); setTab('result') }}
            >◉ result</button>
          )}
        </div>
        <div className={styles.toolbarRight}>
          <span className={styles.langBadge}>{isCssHtml ? 'html + css' : (lang || 'code')}</span>
          <button className={styles.iconBtn} onClick={handleCopy}>{copied ? '✓ copied' : '⎘ copy'}</button>
          <button className={styles.iconBtn} onClick={handleReset}>↺ reset</button>
          {isRunnable && (
            <button className={styles.runBtn} onClick={runCode}>
              ▶ run <span className={styles.shortcut}>⌘↵</span>
            </button>
          )}
          <button className={styles.iconBtn} onClick={() => setIsOpen(false)}>✕ close</button>
        </div>
      </div>

      {/* Monaco pane - shown for code / css / html tabs */}
      {tab !== 'result' && (
        <div className={styles.monacoWrap}>
          <Editor
            key={`${lang}-${tab}`}
            height={editorHeight}
            language={editorLang}
            value={editorValue}
            onChange={handleChange}
            onMount={handleMount}
            theme={THEME}
            options={monacoOptions}
            loading={<div className={styles.loading}>// loading editor...</div>}
          />
        </div>
      )}

      {/* Result pane */}
      {tab === 'result' && (
        <div className={styles.resultPane}>
          {preview
            ? <iframe key={preview} srcDoc={preview} title="preview" sandbox="allow-scripts" className={styles.iframe} />
            : <div className={styles.emptyResult}>// hit ▶ run to see the result</div>
          }
        </div>
      )}

      {isRunnable && tab !== 'result' && (
        <div className={styles.hint}>// ⌘↵ to run · changes don't affect the article · ↺ reset to restore original</div>
      )}
    </div>
  )
}
