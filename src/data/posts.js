export const posts = [
  {
    id: 'z-index-stacking-contexts',
    title: "Why Your z-index Isn't Working (And Why 999999 Won't Save You)",
    excerpt:
      "You've typed z-index: 99999. It still doesn't work. There's a reason - and the number is never the problem. Let's talk about stacking contexts.",
    tag: 'css',
    date: 'Apr 26, 2026',
    readTime: '5 min read',
    featured: true,
    codePreview: [
      { type: 'comment', text: '/* why tho */' },
      { type: 'selector', text: '.modal {' },
      { type: 'bad',  prop: 'z-index', val: '99999' },
      { type: 'good', prop: 'z-index', val: '2' },
      { type: 'good', prop: 'position', val: 'relative' },
      { type: 'close', text: '}' },
    ],
    content: `
We've all done it.

Something's overlapping wrong. You crack your knuckles and type \`z-index: 999\`. Still broken. You think, okay, not enough - \`z-index: 999999\`. Still broken. At this point you're questioning your career choices.

Here's the thing: the problem is almost never the number. It's that you're misunderstanding how z-index actually works. Let's fix that.

## First things first - z-index needs a positioned element

Z-index only works when the element has a \`position\` value that isn't \`static\` (which is the default). So if you haven't set \`position: relative\`, \`absolute\`, \`fixed\`, or \`sticky\` - your z-index is basically a comment. The browser ignores it entirely.

\`\`\`csshtml
HTML:
<p class="label">👆 Box A (purple) should be on top - it has z-index: 2</p>
<div class="box box-a">Box A<br/><span>z-index: 2</span></div>
<div class="box box-b">Box B<br/><span>z-index: 1</span></div>
<p class="hint">Remove <code>position: relative</code> from <code>.box-a</code> in the CSS tab and hit ▶ run.<br/>Box B will jump on top - z-index only works on positioned elements.</p>
<p class="hint">Try it: remove <code>position: relative</code> from <code>.box-a</code> and hit ▶ run</p>
CSS:
body {
  background: #0d0d0f;
  color: #e8e8f0;
  font-family: sans-serif;
  padding: 1.5rem;
}

.label {
  font-size: 13px;
  margin-bottom: 1.5rem;
  color: #2dd4bf;
}

.hint {
  font-size: 12px;
  margin-top: 1.5rem;
  color: #6b6b7e;
  line-height: 1.6;
}

.hint code {
  background: rgba(124,106,247,0.15);
  color: #7c6af7;
  padding: 1px 5px;
  border-radius: 3px;
}

/* No position on the base class - each box sets its own */
.box {
  width: 130px;
  height: 130px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 13px;
  font-weight: bold;
  border-radius: 10px;
  line-height: 1.6;
}

.box span {
  font-size: 11px;
  font-weight: normal;
  opacity: 0.8;
  margin-top: 4px;
}

/* Box A is first in the DOM - without positioning, DOM order means Box B paints over it */
.box-a {
  background: #7c6af7;
  color: #fff;
  position: relative; /* ← remove this and hit Run - Box B covers Box A */
  z-index: 2;
  margin-bottom: -60px; /* overlap with Box B below */
  margin-left: 20px;
}

/* Box B is second in DOM - later = paints on top when z-index is disabled */
.box-b {
  background: #f97316;
  color: #fff;
  position: relative;
  z-index: 1;
  margin-left: 60px;
}
\`\`\`

That alone fixes a surprising number of cases. But if you're still stuck, there's a deeper concept at play.

## The real culprit: Stacking Contexts

This is where most people's mental model breaks down.

A **stacking context** is essentially a self-contained layer in the page. Elements inside a stacking context are stacked and compared *only within that context* - they can't "escape" it to compete with elements outside.

Think of it like floors in a building. You can be the tallest person on Floor 2, but you're still below everyone on Floor 3. Your height (z-index) only matters within your own floor.

## What creates a stacking context?

This is the sneaky part. A new stacking context is created whenever an element has:

- \`opacity\` less than 1
- Any \`transform\` value (even \`transform: translateZ(0)\`)
- Any \`filter\` value
- \`isolation: isolate\`
- \`position: fixed\` or \`position: sticky\`
- \`will-change\` set to certain properties

So here's a classic trap: a parent element has \`transform: translateX(0)\` on it (maybe for a subtle animation). That silently creates a new stacking context. Now all your z-index values inside that parent are trapped.

\`\`\`csshtml
HTML:
<div class="outside">Outside element<br/><span>z-index: 10</span></div>
<div class="parent">
  .parent has transform ⚠️
  <div class="child">Child<br/><span>z-index: 9999</span></div>
</div>
<p class="hint">Even though .child has z-index: 9999, it can't escape its parent's stacking context.<br/>Try removing <code>transform: translateX(0)</code> from <code>.parent</code> - child breaks free!</p>
CSS:
body {
  background: #0d0d0f;
  color: #e8e8f0;
  font-family: sans-serif;
  padding: 1.5rem;
  position: relative;
}

.hint {
  font-size: 12px;
  margin-top: 1.5rem;
  color: #6b6b7e;
  line-height: 1.7;
}
.hint code {
  background: rgba(124,106,247,0.15);
  color: #7c6af7;
  padding: 1px 5px;
  border-radius: 3px;
}

/* This sits outside .parent with z-index: 10 */
.outside {
  position: relative;
  z-index: 10;
  background: #f97316;
  color: #fff;
  width: 140px;
  height: 140px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 13px;
  font-weight: bold;
  margin-bottom: -60px;
  margin-left: 80px;
}

.outside span { font-size: 11px; font-weight: normal; opacity: 0.8; margin-top: 4px; }

/* transform creates a stacking context - traps child's z-index inside */
.parent {
  transform: translateX(0); /* ← remove this - child escapes! */
  background: rgba(124,106,247,0.15);
  border: 1px dashed #7c6af7;
  border-radius: 10px;
  padding: 1rem;
  width: 220px;
  font-size: 12px;
  color: #7c6af7;
  position: relative;
}

.child {
  position: relative;
  z-index: 9999; /* trapped - can't beat .outside's z-index: 10 */
  background: #7c6af7;
  color: #fff;
  width: 120px;
  height: 120px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 13px;
  font-weight: bold;
  margin-top: 0.75rem;
}

.child span { font-size: 11px; font-weight: normal; opacity: 0.8; margin-top: 4px; }
\`\`\`

## How to actually debug this

1. **Is the element positioned?** Add \`position: relative\` if not
2. **Check the parents** - open DevTools, walk up the DOM tree and look for \`transform\`, \`opacity\`, \`filter\` on any ancestor
3. **Use \`isolation: isolate\`** on a parent to intentionally create a stacking context
4. **Stop escalating the number** - if \`9999\` doesn't work, \`999999\` won't either

## The clean solution: isolation

\`\`\`csshtml
HTML:
<div class="scene">
  <!-- This sits OUTSIDE the component with z-index: 5 -->
  <div class="tooltip">🟠 Tooltip (outside)<br/><span>z-index: 5</span></div>

  <!-- Component with isolation: isolate -->
  <div class="component">
    <p class="label">Component (isolation: isolate)</p>
    <!-- High z-index but trapped inside component's stacking context -->
    <div class="dropdown">🟣 Dropdown (inside)<br/><span>z-index: 9999</span></div>
  </div>
</div>
<p class="hint">
  With <code>isolation: isolate</code>: orange tooltip (z:5) sits on top of purple dropdown (z:9999) ✅<br/>
  Remove <code>isolation: isolate</code> from <code>.component</code> and hit ▶ run - purple wins because 9999 &gt; 5 ❌
</p>
CSS:
body {
  background: #0d0d0f;
  color: #e8e8f0;
  font-family: sans-serif;
  padding: 1.5rem;
}

.hint {
  font-size: 12px;
  margin-top: 1rem;
  color: #6b6b7e;
  line-height: 1.8;
}
.hint code {
  background: rgba(45,212,191,0.15);
  color: #2dd4bf;
  padding: 1px 5px;
  border-radius: 3px;
}

.scene {
  position: relative;
  height: 180px;
  width: 300px;
}

/* Tooltip: outside the component, modest z-index */
.tooltip {
  position: absolute;
  z-index: 5;
  top: 30px;
  left: 120px;
  background: #f97316;
  color: #fff;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: bold;
  line-height: 1.5;
  width: 150px;
  text-align: center;
}
.tooltip span { font-size: 10px; font-weight: normal; opacity: 0.85; }

/* Component: isolation contains its children's z-index */
.component {
  isolation: isolate; /* ← remove this - dropdown (z:9999) will cover the tooltip */
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(124,106,247,0.1);
  border: 1px dashed #7c6af7;
  border-radius: 10px;
  padding: 0.75rem;
  width: 200px;
}

.label {
  font-size: 11px;
  color: #7c6af7;
  margin-bottom: 0.5rem;
}

/* Dropdown: very high z-index but isolated inside .component */
.dropdown {
  position: relative;
  z-index: 9999;
  background: #7c6af7;
  color: #fff;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: bold;
  line-height: 1.5;
  text-align: center;
}
.dropdown span { font-size: 10px; font-weight: normal; opacity: 0.85; }
\`\`\`

This is especially useful in design systems or component libraries where you don't want stacking contexts leaking out.

## TL;DR

- Z-index needs \`position\` set - without it, nothing works
- Stacking contexts are invisible layers that trap z-index values
- Common triggers: \`transform\`, \`opacity < 1\`, \`filter\`, \`position: fixed\`
- Debug by inspecting parent elements in DevTools
- Use \`isolation: isolate\` to take intentional control

Next time you're tempted to type \`z-index: 99999\`, pause. Open DevTools. Check the parents. The answer is almost always there.
    `,
  },
  {
    id: 'stop-using-px',
    title: "Stop Using px for Everything. Here's What to Use Instead.",
    excerpt:
      'rem, em, vh, vw, clamp() - when to use what and why your font sizes are probably wrong.',
    tag: 'bestpractice',
    date: 'Apr 15, 2026',
    readTime: '6 min read',
    featured: false,
    content: `If every unit in your CSS is \`px\`, you're making your own life harder. Not because px is bad - it has its place - but because you're using a fixed hammer for problems that need flexible tools.

Let's break down what to actually use and when.

## The problem with px everywhere

Pixels are absolute. They don't scale with user preferences. If someone has bumped their browser font size up to 20px because they find small text hard to read, your \`font-size: 14px\` says: "I don't care. It's 14px."

That's a bad user experience. It also makes responsive design harder than it needs to be.

## rem - your new best friend for typography

\`rem\` is relative to the root font size (the \`<html>\` element). By default, that's 16px in most browsers.

\`\`\`csshtml
HTML:
<div class="demo">
  <h1>Heading (2.5rem)</h1>
  <p>Paragraph text (1rem) - the base reading size</p>
  <small>Small text (0.875rem) - captions, labels</small>
  <p class="hint">👆 Try changing <code>html { font-size }</code> to <code>20px</code> in CSS - everything scales together!</p>
</div>
CSS:
/* Change this one value - everything below scales with it */
html { font-size: 16px; }

body {
  background: #0d0d0f;
  color: #e8e8f0;
  font-family: sans-serif;
  padding: 2rem;
}

.demo {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

h1 { font-size: 2.5rem; font-weight: 800; color: #7c6af7; letter-spacing: -0.02em; }
p  { font-size: 1rem;   line-height: 1.6; }
small { font-size: 0.875rem; color: #6b6b7e; }

.hint {
  font-size: 0.8rem;
  color: #2dd4bf;
  background: rgba(45,212,191,0.08);
  border: 1px solid rgba(45,212,191,0.2);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-top: 0.5rem;
}
.hint code {
  background: rgba(45,212,191,0.15);
  padding: 1px 5px;
  border-radius: 3px;
}
\`\`\`

The magic: if a user changes their browser font size, everything scales with it. And if you want to scale your whole type system, you just change one value on \`html\`.

**Use rem for:** font sizes, and spacing that should scale with type (padding on text-heavy components).

## em - relative to the parent

\`em\` is relative to the *current element's* font size, or its parent's if it doesn't have one set.

\`\`\`csshtml
HTML:
<div class="card small-card">
  <h3>Small Card</h3>
  <p>The padding scales with the font-size of this card. Change <code>.small-card { font-size }</code> and the spacing adapts too.</p>
</div>
<div class="card large-card">
  <h3>Large Card</h3>
  <p>Same CSS, different font-size - the <code>1em</code> padding makes it proportionally bigger automatically.</p>
</div>
CSS:
body {
  background: #0d0d0f;
  color: #e8e8f0;
  font-family: sans-serif;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.card {
  padding: 1em; /* scales with the card's own font-size */
  background: #141417;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  max-width: 380px;
}

.card h3 {
  font-size: 1.2em;
  font-weight: 700;
  margin-bottom: 0.5em;
  color: #7c6af7;
}

.card p {
  line-height: 1.6;
  color: #a0a0b8;
}

.card code {
  background: rgba(124,106,247,0.15);
  color: #7c6af7;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 0.9em;
}

/* Try changing these font-sizes and watch padding adapt */
.small-card { font-size: 0.9rem; }
.large-card { font-size: 1.25rem; }
\`\`\`

This is powerful for components that need internal spacing to scale with their own text size. But it can get confusing when nested - \`em\` compounds, so a child inside a child can end up with unexpected sizes.

**Use em for:** internal component spacing, icon sizes relative to their surrounding text.

## clamp() - fluid everything

This is the one that changes how you think about responsive design.

\`\`\`csshtml
HTML:
<div class="demo">
  <h1>Fluid Heading with clamp()</h1>
  <p class="sub">This heading uses <code>clamp(1.8rem, 5vw, 3.5rem)</code> - it never gets smaller than 1.8rem or bigger than 3.5rem, but scales smoothly in between.</p>
  <div class="compare">
    <div class="box fixed">
      <span class="box-label">px (fixed)</span>
      <p class="fixed-text">Fixed 32px - never changes</p>
    </div>
    <div class="box fluid">
      <span class="box-label">clamp() (fluid)</span>
      <p class="fluid-text">Scales with viewport</p>
    </div>
  </div>
  <p class="hint">👆 Try changing the clamp values - e.g. <code>clamp(1rem, 8vw, 5rem)</code> for a more dramatic effect</p>
</div>
CSS:
body {
  background: #0d0d0f;
  color: #e8e8f0;
  font-family: sans-serif;
  padding: 2rem;
}

h1 {
  font-size: clamp(1.8rem, 5vw, 3.5rem); /* ← the magic */
  font-weight: 800;
  color: #7c6af7;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin-bottom: 1rem;
}

.sub {
  font-size: 0.9rem;
  color: #6b6b7e;
  line-height: 1.7;
  margin-bottom: 1.5rem;
}
.sub code {
  background: rgba(124,106,247,0.15);
  color: #7c6af7;
  padding: 1px 5px;
  border-radius: 3px;
}

.compare {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.box {
  flex: 1;
  min-width: 140px;
  background: #141417;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  padding: 1.25rem;
}

.box-label {
  display: block;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #6b6b7e;
  margin-bottom: 0.75rem;
}

.fixed-text  { font-size: 32px;                    color: #f97316; font-weight: 700; }
.fluid-text  { font-size: clamp(1rem, 4vw, 2rem);  color: #2dd4bf; font-weight: 700; }

.hint {
  font-size: 0.8rem;
  color: #2dd4bf;
  background: rgba(45,212,191,0.08);
  border: 1px solid rgba(45,212,191,0.2);
  padding: 0.75rem 1rem;
  border-radius: 8px;
}
.hint code {
  background: rgba(45,212,191,0.15);
  padding: 1px 5px;
  border-radius: 3px;
}
\`\`\`

Translation: "Be at least 1.8rem, grow fluidly with the viewport, but never exceed 3.5rem."

No media queries needed. The heading just... works at every screen size.

**Use clamp() for:** headings, hero text, any size that should smoothly scale across breakpoints.

## Quick reference

| Unit | Relative to | Best for |
|------|-------------|----------|
| px | Nothing | Borders, shadows, fixed elements |
| rem | Root font size | Font sizes, global spacing |
| em | Parent font size | Component-internal spacing |
| % | Parent dimension | Layout widths, heights |
| vw/vh | Viewport | Full-screen sections, fluid sizes |
| clamp() | Viewport + limits | Fluid typography, responsive spacing |

## The rule of thumb

- **Layout widths** → \`%\` or \`fr\` (CSS Grid)
- **Font sizes** → \`rem\` or \`clamp()\`
- **Component spacing** → \`rem\` (safe) or \`em\` (if you want it to scale with text)
- **Borders, shadows, fine details** → \`px\` is fine here
- **Viewport-filling sections** → \`vh\`/\`vw\`

Start with this, and you'll write CSS that's more flexible, more accessible, and honestly less work to maintain.`,
  },
  {
    id: 'css-has-selector',
    title: "CSS :has() Is the Parent Selector We Waited 10 Years For",
    excerpt:
      'No JavaScript. No wrapper divs. Just a CSS selector that finally lets you style a parent based on its children.',
    tag: 'css',
    date: 'Apr 5, 2026',
    readTime: '5 min read',
    featured: false,
    content: `For years, CSS could only go one direction: from parent to child. You could style a child based on its parent's class, but you could never style a parent based on what was inside it. That forced us into JavaScript workarounds, extra wrapper elements, and a lot of frustrated sighing.

Then \`:has()\` landed. And it's genuinely a superpower.

## What it does

\`:has()\` lets you select an element *based on its descendants*. It's the relational selector CSS always needed.

\`\`\`csshtml
HTML:
<p class="hint">👆 Click inside the input to see <code>:has(input:focus)</code> in action</p>

<div class="field">
  <label>Email address</label>
  <input type="text" placeholder="click me..." />
</div>

<div class="cards">
  <div class="card">
    <img src="https://picsum.photos/seed/a/300/120" alt="demo"/>
    <div class="card-body">Card with image - padding: 0 on the card, padding on body only</div>
  </div>
  <div class="card">
    <div class="card-body">Card without image - full padding on the card itself</div>
  </div>
</div>
CSS:
body {
  background: #0d0d0f;
  color: #e8e8f0;
  font-family: sans-serif;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.hint {
  font-size: 12px;
  color: #2dd4bf;
  background: rgba(45,212,191,0.08);
  border: 1px solid rgba(45,212,191,0.2);
  padding: 0.6rem 1rem;
  border-radius: 8px;
}
.hint code { background: rgba(45,212,191,0.2); padding: 1px 5px; border-radius: 3px; }

/* :has(input:focus) - styles the PARENT when child input is focused */
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 1rem;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  transition: border-color 0.2s, background 0.2s;
}
.field:has(input:focus) {
  border-color: #7c6af7;
  background: rgba(124, 106, 247, 0.06);
}
.field label { font-size: 13px; color: #6b6b7e; }
.field input {
  background: transparent;
  border: none;
  outline: none;
  color: #e8e8f0;
  font-size: 15px;
  font-family: sans-serif;
}

/* :has(img) - card with image gets no top padding, image goes edge to edge */
.cards { display: flex; flex-direction: column; gap: 1rem; }

.card {
  background: #141417;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  overflow: hidden;
  padding: 1rem; /* default padding */
}

/* Override: card containing an image removes its own padding */
.card:has(img) { padding: 0; }

.card img { width: 100%; height: 100px; object-fit: cover; display: block; }

.card-body { padding: 0.875rem 1rem; font-size: 13px; color: #a0a0b8; line-height: 1.6; }
\`\`\`

That second example is the one that used to require JavaScript. Now it's one line of CSS.

## Real-world use cases

**Navigation with active items** - nav background changes when any child has \`.active\`:

\`\`\`csshtml
HTML:
<p class="hint">👆 Click a nav item to make it active - watch the nav bar change</p>
<nav>
  <a href="#" onclick="toggle(this)">Home</a>
  <a href="#" onclick="toggle(this)" class="active">Blog</a>
  <a href="#" onclick="toggle(this)">About</a>
</nav>
<script>
function toggle(el) {
  event.preventDefault()
  document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'))
  el.classList.add('active')
}
</script>
CSS:
body { background: #0d0d0f; font-family: sans-serif; padding: 1.5rem; }

.hint {
  font-size: 12px; color: #2dd4bf;
  background: rgba(45,212,191,0.08);
  border: 1px solid rgba(45,212,191,0.2);
  padding: 0.6rem 1rem; border-radius: 8px; margin-bottom: 1rem;
}

nav {
  display: flex;
  gap: 0;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  background: #141417;
  border: 1px solid rgba(255,255,255,0.08);
  transition: background 0.3s, border-color 0.3s;
}

/* :has(.active) - styles the nav itself when any child is active */
nav:has(.active) {
  background: rgba(124,106,247,0.12);
  border-color: rgba(124,106,247,0.3);
}

nav a {
  padding: 0.5rem 1.25rem;
  color: #6b6b7e;
  text-decoration: none;
  font-size: 14px;
  border-radius: 6px;
  transition: color 0.2s;
}

nav a.active { color: #e8e8f0; background: rgba(124,106,247,0.2); }
nav a:hover  { color: #e8e8f0; }
\`\`\`

**Forms - field group highlights when input is valid:**

\`\`\`csshtml
HTML:
<p class="hint">👆 Type a valid email to see <code>:has(input:valid)</code> turn the label green</p>
<div class="field-group">
  <span class="label">Email</span>
  <input type="email" placeholder="you@example.com" required />
  <span class="status"></span>
</div>
CSS:
body { background: #0d0d0f; color: #e8e8f0; font-family: sans-serif; padding: 1.5rem; }

.hint {
  font-size: 12px; color: #2dd4bf;
  background: rgba(45,212,191,0.08);
  border: 1px solid rgba(45,212,191,0.2);
  padding: 0.6rem 1rem; border-radius: 8px; margin-bottom: 1.5rem;
}
.hint code { background: rgba(45,212,191,0.2); padding: 1px 5px; border-radius: 3px; }

.field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 1rem;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  transition: border-color 0.3s;
  max-width: 320px;
}

/* :has(input:valid) - styles parent AND sibling label when input is valid */
.field-group:has(input:valid) {
  border-color: #2dd4bf;
  background: rgba(45,212,191,0.04);
}

.field-group:has(input:valid) .label {
  color: #2dd4bf; /* label turns green - no JS needed */
}

.field-group:has(input:valid) .status::after {
  content: '✓ looks good!';
  color: #2dd4bf;
  font-size: 12px;
}

.label { font-size: 13px; color: #6b6b7e; transition: color 0.3s; font-weight: 500; }

input {
  background: transparent; border: none; outline: none;
  color: #e8e8f0; font-size: 15px; font-family: sans-serif;
}
\`\`\`

## The "quantity query" use case

One of the most powerful uses is styling based on *how many* children exist:

\`\`\`csshtml
HTML:
<p class="hint">👆 Click "Add item" to add cards - layout switches to 3 columns automatically at 3+ items</p>
<button onclick="addItem()">+ Add item</button>
<button onclick="removeItem()" style="margin-left:8px">− Remove item</button>
<div class="grid" id="grid">
  <div class="item">Item 1</div>
  <div class="item">Item 2</div>
</div>
<script>
let count = 2
function addItem() {
  count++
  const el = document.createElement('div')
  el.className = 'item'
  el.textContent = 'Item ' + count
  document.getElementById('grid').appendChild(el)
}
function removeItem() {
  const grid = document.getElementById('grid')
  if (grid.children.length > 1) grid.removeChild(grid.lastChild)
}
</script>
CSS:
body { background: #0d0d0f; color: #e8e8f0; font-family: sans-serif; padding: 1.5rem; }

.hint {
  font-size: 12px; color: #2dd4bf;
  background: rgba(45,212,191,0.08);
  border: 1px solid rgba(45,212,191,0.2);
  padding: 0.6rem 1rem; border-radius: 8px; margin-bottom: 1rem;
}

button {
  background: #7c6af7; color: #fff; border: none;
  padding: 8px 16px; border-radius: 6px; cursor: pointer;
  font-size: 13px; margin-bottom: 1rem;
}

/* Default: 2 columns */
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  transition: all 0.3s;
}

/* :has(:nth-child(3)) - switches to 3 cols when 3+ items exist */
.grid:has(:nth-child(3)) {
  grid-template-columns: repeat(3, 1fr);
}

/* :has(:nth-child(5)) - switches to 4 cols when 5+ items */
.grid:has(:nth-child(5)) {
  grid-template-columns: repeat(4, 1fr);
}

.item {
  background: #141417;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  padding: 1rem;
  font-size: 13px;
  color: #a0a0b8;
  text-align: center;
  transition: all 0.3s;
}
\`\`\`

No JavaScript for the layout. No class toggling. The grid adapts automatically to content.

## Browser support

As of 2024, \`:has()\` is supported in all major browsers - Chrome, Firefox, Safari, Edge. You're good to use it in production.

## What this replaces

- JS class toggling to style parents based on children ✅
- Redundant wrapper elements just for CSS targeting ✅
- Complex sibling selector gymnastics ✅

\`:has()\` is one of those features that, once you start using it, makes you wonder how you ever managed without it. Go add it to something today.`,
  },
  {
    id: 'prod-css-delete',
    title: 'How I Accidentally Deleted the Entire Layout on Prod',
    excerpt:
      'One wrong CSS override. One missing class name. One very long Friday afternoon.',
    tag: 'epicfail',
    date: 'Apr 10, 2026',
    readTime: '4 min read',
    featured: false,
    content: `I'm going to tell you something embarrassing. Not because I enjoy reliving it, but because if it saves even one of you from the same fate, it'll have been worth it.

It was a routine CSS refactor. Or so I thought.

## The setup

We were cleaning up the stylesheet. Years of accumulated overrides, specificity wars, !important declarations that nobody remembered adding. The plan was simple: remove the dead styles, rename a few classes to be more semantic, ship it.

I did the refactor. I checked it locally. Everything looked fine. I pushed. I deployed.

## What actually happened

Turns out, one of the class names I renamed - \`.container\` to \`.page-container\` - wasn't just used in the component I was looking at. It was used in **eleven other places** across the codebase. A global utility class that had been quietly holding the layout together for two years.

When I renamed it in the CSS without updating every usage in the HTML and JSX, those eleven pages just... collapsed. No container. No max-width. No padding. Content stretching wall to wall at full browser width.

On production.

On a Friday.

## The response

Fortunately, I caught it within 4 minutes because I happened to open the site on my phone immediately after deploying (to check something unrelated, not even the refactor). The revert took 2 minutes. Total damage: maybe 6 minutes of broken layout for real users.

It could have been so much worse.

## What I should have done

**1. Used a find-all search before renaming any class**
Modern editors have "find all references" for a reason. A global search for \`.container\` would have shown me every usage instantly.

**2. Used CSS Modules or a component-scoped approach**
If the CSS had been scoped to the component, a global \`.container\` class wouldn't have existed in the first place.

**3. Tested more than one page before deploying**
I checked the component I was working on. I should have checked 5-10 pages, especially the high-traffic ones.

**4. Deployed on a Monday morning, not a Friday afternoon**
This one is just life advice.

## The lesson

Global CSS classes are landmines. Treat every rename like you're defusing one - slowly, with full visibility of everything it touches. One ctrl+shift+F before you delete anything. That's all it takes.`,
  },
  {
    id: 'flexbox-vs-grid',
    title: 'Flexbox vs Grid — When to Use Which (and When You\'re Using the Wrong One)',
    excerpt:
      'Both are great. But they solve different problems — and using the wrong one makes your CSS harder to read, harder to maintain, and occasionally broken in ways you can\'t explain.',
    tag: 'css',
    date: 'Apr 30, 2026',
    readTime: '6 min read',
    featured: false,
    content: `You've been there. You need a layout, you pick one, it works, you move on. But deep down you're not sure if you chose the right tool. Are you using Flexbox when you should be using Grid? Or Grid when Flexbox would've been 3 lines?

Here's the honest answer: both are great. But they solve *different* problems — and using the wrong one makes your CSS harder to read, harder to maintain, and occasionally broken in ways you can't explain.

Let's settle this once and for all.

## The Core Difference — One Sentence Each

**Flexbox** thinks in one dimension — a row *or* a column.
**Grid** thinks in two dimensions — rows *and* columns simultaneously.

That's it. That's the whole decision tree. Everything else follows from this.

## When to Use Flexbox

Flexbox is perfect when you're aligning things *along a single axis* — navigation bars, button groups, centering a single item, stacking cards vertically.

\`\`\`csshtml
HTML:
<p class="hint">👆 Flexbox: items flow along one axis. This is the sweet spot for navbars and button rows.</p>
<nav class="nav">
  <a href="#">Home</a>
  <a href="#">Blog</a>
  <a href="#">About</a>
  <a href="#">Contact</a>
</nav>
<p class="hint" style="margin-top:1.5rem">Centering with Flexbox — the classic use case:</p>
<div class="center-demo">
  <div class="box">I am centered</div>
</div>
CSS:
body { background: #0d0d0f; color: #e8e8f0; font-family: sans-serif; padding: 1.5rem; }
.hint { font-size: 12px; color: #2dd4bf; margin-bottom: 0.75rem; }

.nav {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  background: #141417;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.08);
}
.nav a {
  color: #e8e8f0;
  text-decoration: none;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 14px;
  background: rgba(124,106,247,0.12);
  transition: background 0.2s;
}
.nav a:hover { background: rgba(124,106,247,0.25); }

.center-demo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  background: #141417;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
}
.box {
  background: #7c6af7;
  color: #fff;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
}
\`\`\`

**Use Flexbox when:**
- Building navigation bars
- Centering a single element
- Aligning items in a row with spacing between them
- Stacking things vertically with consistent gaps
- You only care about one axis

## When to Use Grid

Grid is for two-dimensional layouts — when you need control over both rows *and* columns at the same time. Page layouts, card grids, dashboards, anything that has a defined structure in both directions.

\`\`\`csshtml
HTML:
<p class="hint">👆 Grid: control rows AND columns simultaneously. Try editing grid-template-columns.</p>
<div class="grid">
  <div class="card header-card">Header</div>
  <div class="card sidebar-card">Sidebar</div>
  <div class="card main-card">Main Content</div>
  <div class="card footer-card">Footer</div>
</div>
CSS:
body { background: #0d0d0f; color: #e8e8f0; font-family: sans-serif; padding: 1.5rem; }
.hint { font-size: 12px; color: #2dd4bf; margin-bottom: 0.75rem; }

.grid {
  display: grid;
  grid-template-columns: 180px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header  header"
    "sidebar main"
    "footer  footer";
  gap: 0.75rem;
  height: 260px;
}
.card {
  background: #141417;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  padding: 1rem;
  font-size: 13px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}
.header-card  { grid-area: header;  background: rgba(124,106,247,0.15); color: #7c6af7; }
.sidebar-card { grid-area: sidebar; background: rgba(45,212,191,0.1);  color: #2dd4bf; }
.main-card    { grid-area: main;    background: rgba(249,115,22,0.1);  color: #f97316; }
.footer-card  { grid-area: footer;  background: rgba(244,114,182,0.1); color: #f472b6; }
\`\`\`

**Use Grid when:**
- Building page layouts (header, sidebar, main, footer)
- Creating card grids where rows and columns need to align
- You need items to span multiple rows or columns
- You're thinking about the layout from the outside in

## The Classic Mistake

Using Grid for a simple horizontal list of items:

\`\`\`csshtml
HTML:
<p class="hint" style="color:#f472b6">❌ Wrong: using Grid for a simple nav — overkill</p>
<nav class="nav-grid">
  <a href="#">Home</a>
  <a href="#">Blog</a>
  <a href="#">About</a>
</nav>
<p class="hint" style="color:#2dd4bf;margin-top:1.5rem">✅ Right: Flexbox is perfect here</p>
<nav class="nav-flex">
  <a href="#">Home</a>
  <a href="#">Blog</a>
  <a href="#">About</a>
</nav>
CSS:
body { background: #0d0d0f; color: #e8e8f0; font-family: sans-serif; padding: 1.5rem; }
.hint { font-size: 12px; margin-bottom: 0.75rem; }

.nav-grid {
  display: grid;
  grid-template-columns: repeat(3, auto);
  justify-content: start;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #141417;
  border-radius: 8px;
  border: 1px solid rgba(244,114,182,0.3);
}
.nav-flex {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #141417;
  border-radius: 8px;
  border: 1px solid rgba(45,212,191,0.3);
  margin-top: 0.5rem;
}
.nav-grid a, .nav-flex a {
  color: #e8e8f0;
  text-decoration: none;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 14px;
  background: rgba(255,255,255,0.06);
}
\`\`\`

## Can You Use Both Together?

Absolutely — and you often should. Grid for the macro layout, Flexbox for the micro alignment inside each cell.

\`\`\`csshtml
HTML:
<p class="hint">Grid for the overall layout, Flexbox inside each card for alignment</p>
<div class="page-grid">
  <div class="card">
    <div class="card-inner">
      <span class="icon">🚀</span>
      <div>
        <div class="card-title">Fast</div>
        <div class="card-sub">Optimised builds</div>
      </div>
    </div>
  </div>
  <div class="card">
    <div class="card-inner">
      <span class="icon">🎨</span>
      <div>
        <div class="card-title">Beautiful</div>
        <div class="card-sub">Clean by default</div>
      </div>
    </div>
  </div>
  <div class="card">
    <div class="card-inner">
      <span class="icon">🔒</span>
      <div>
        <div class="card-title">Secure</div>
        <div class="card-sub">Sandboxed execution</div>
      </div>
    </div>
  </div>
</div>
CSS:
body { background: #0d0d0f; color: #e8e8f0; font-family: sans-serif; padding: 1.5rem; }
.hint { font-size: 12px; color: #2dd4bf; margin-bottom: 0.75rem; }

/* Grid — macro layout */
.page-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
/* Flexbox — micro alignment inside each card */
.card {
  background: #141417;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  padding: 1.25rem;
}
.card-inner {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.icon { font-size: 1.75rem; }
.card-title { font-weight: bold; font-size: 14px; margin-bottom: 2px; }
.card-sub { font-size: 12px; color: #6b6b7e; }
\`\`\`

## The Decision Cheat Sheet

| Situation | Use |
|-----------|-----|
| Navbar, button row, horizontal list | Flexbox |
| Centering one element | Flexbox |
| Page layout (header/sidebar/main) | Grid |
| Card grid that needs row alignment | Grid |
| Items inside a grid cell | Flexbox |
| Unknown number of items that wrap | Flexbox |
| Precise column + row placement | Grid |

## TL;DR

- **Flexbox** = one axis, items flow, great for alignment and spacing
- **Grid** = two axes, defined structure, great for layouts
- When in doubt: if you're thinking about rows *and* columns at the same time → Grid. If you're just arranging things in a line → Flexbox
- They're not competitors. Use both. Grid for the layout, Flexbox for the components inside.`,
  },
  {
    id: 'console-log-lies',
    title: 'Why console.log Lies to You (and What to Use Instead)',
    excerpt:
      'console.log is every developer\'s first debugging tool. It\'s also one of the most misleading ones — not because it\'s broken, but because it doesn\'t always show you what you think it\'s showing you.',
    tag: 'debug',
    date: 'Apr 30, 2026',
    readTime: '5 min read',
    featured: false,
    content: `\`console.log\` is every developer's first debugging tool. It's also one of the most misleading ones.

Not because it's broken — but because it doesn't always show you what you *think* it's showing you. Objects get mutated after you log them. Async timing makes logs appear out of order. And you're probably missing half the console API that would make your debugging life significantly easier.

Let's fix that.

## The Big Lie: Logging Objects

This is the one that catches everyone. You log an object, expand it in DevTools, and the values look wrong — or different from what you expected at that moment in time.

\`\`\`js
// Run this — then expand the logged object in the Result panel
// The values might surprise you

const user = { name: 'Alice', score: 0 }
console.log('Logged user:', user)   // looks fine right now...

user.score = 100
user.name = 'Bob'

// Now look at the logged object above — it shows score: 100, name: 'Bob'
// Not what it was when you logged it!
console.log('After mutation — name:', user.name, 'score:', user.score)
\`\`\`

**Why this happens:** \`console.log\` logs a *reference* to the object, not a snapshot. When you expand it in DevTools, you're seeing the object's *current* state — not its state at the moment you called \`console.log\`.

**The fix:** Serialize it first.

\`\`\`js
const user = { name: 'Alice', score: 0 }

console.log('BAD  (reference):', user)
console.log('GOOD (snapshot) :', JSON.parse(JSON.stringify(user)))
console.log('ALSO GOOD       :', { ...user })   // shallow spread works for flat objects

user.score = 100
user.name = 'Bob'

console.log('---')
console.log('After mutation — the first log above now shows Bob/100')
console.log('The second and third still show Alice/0 — always accurate')
\`\`\`

## console.table — Stop Logging Arrays Like This

\`\`\`js
const users = [
  { id: 1, name: 'Alice', role: 'admin',  score: 95 },
  { id: 2, name: 'Bob',   role: 'member', score: 72 },
  { id: 3, name: 'Carol', role: 'member', score: 88 },
]

// The way most people do it — hard to scan
console.log('Array:', users)

// The way you should do it — renders a proper table
console.table(users)

// Filter to specific columns only
console.table(users, ['name', 'score'])
\`\`\`

\`console.table\` renders a proper sortable table in DevTools. For any array of objects this is miles better than \`console.log\`.

## console.group — Stop Scrolling Through a Wall of Logs

\`\`\`js
function processOrder(order) {
  console.group(\`Order #\${order.id}\`)
  console.log('Customer:', order.customer)
  console.log('Items:', order.items)

  console.group('Payment')
  console.log('Method:', order.payment.method)
  console.log('Amount:', order.payment.amount)
  console.groupEnd()

  console.log('Status:', order.status)
  console.groupEnd()
}

processOrder({
  id: 1042,
  customer: 'Alice',
  items: ['CSS book', 'Mechanical keyboard'],
  payment: { method: 'card', amount: 149.99 },
  status: 'confirmed'
})

processOrder({
  id: 1043,
  customer: 'Bob',
  items: ['Standing desk'],
  payment: { method: 'paypal', amount: 299.00 },
  status: 'pending'
})
\`\`\`

Collapsible, nested, labelled. When you're logging inside a loop or across multiple function calls, this keeps the console readable.

## console.time — Measure Performance Properly

\`\`\`js
// No more Date.now() subtraction — console.time does it for you

console.time('loop')
let sum = 0
for (let i = 0; i < 1000000; i++) {
  sum += i
}
console.timeEnd('loop')

// Compare two approaches
const nums = Array.from({ length: 10000 }, (_, i) => i)

console.time('reduce')
const total1 = nums.reduce((acc, n) => acc + n, 0)
console.timeEnd('reduce')

console.time('for-loop')
let total2 = 0
for (let i = 0; i < nums.length; i++) total2 += nums[i]
console.timeEnd('for-loop')

console.log('Results match:', total1 === total2)
\`\`\`

## console.warn and console.error — Use Them Intentionally

\`\`\`js
// Notice how each level looks different in the output

function divide(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    console.error('divide() expects numbers, got:', typeof a, typeof b)
    return null
  }
  if (b === 0) {
    console.warn('divide() called with b=0, returning Infinity')
    return Infinity
  }
  return a / b
}

console.log(divide(10, 2))     // normal log
console.log(divide(10, 0))     // warn — yellow in DevTools
console.log(divide('10', 2))   // error — red in DevTools
\`\`\`

\`console.warn\` = something works but probably shouldn't.
\`console.error\` = something is broken.

Using these intentionally means when you scan your console, red things are *actually* problems — not just debug noise.

## console.assert — Catch Bugs Inline

\`\`\`js
// console.assert only fires when the condition is FALSE — silent otherwise

function getDiscount(price, userType) {
  const discount = userType === 'premium' ? 0.2 : 0
  const finalPrice = price * (1 - discount)

  console.assert(finalPrice >= 0, 'Negative price detected!', { price, discount, finalPrice })

  return finalPrice
}

console.log(getDiscount(100, 'premium'))  // 80 — no assertion
console.log(getDiscount(100, 'basic'))    // 100 — no assertion
console.log(getDiscount(-50, 'premium'))  // assertion fires!
\`\`\`

Great for sanity checks during development — zero noise when things are working, instant signal when they're not.

## The Full Cheat Sheet

| Method | Use it for |
|--------|-----------|
| \`console.log\` | General output — spread objects for accurate snapshots |
| \`console.table\` | Arrays of objects — way more readable |
| \`console.group\` | Grouping related logs — collapsible in DevTools |
| \`console.time\` | Measuring how long something takes |
| \`console.warn\` | Something works but is suspicious |
| \`console.error\` | Something is broken |
| \`console.assert\` | Inline sanity checks — only fires when false |
| \`console.count\` | Count how many times a line runs |
| \`console.clear\` | Clean the console before a fresh test run |

## TL;DR

- \`console.log\` on objects shows *current* state, not state-at-log-time — use \`{ ...obj }\` or \`JSON.parse(JSON.stringify(obj))\` for snapshots
- \`console.table\` for arrays — dramatically more readable
- \`console.group\` for anything that logs in loops or across multiple steps
- \`console.time\` instead of manual \`Date.now()\` subtraction
- Use \`warn\` and \`error\` intentionally — so red actually means broken
- \`console.assert\` for inline sanity checks — silent when fine, loud when not`,
  },
]

export const tagMeta = {
  css:          { label: 'css',           color: '#7c6af7', bg: 'rgba(124,106,247,0.1)',  border: 'rgba(124,106,247,0.25)' },
  debug:        { label: 'debugging',     color: '#f97316', bg: 'rgba(249,115,22,0.1)',   border: 'rgba(249,115,22,0.25)' },
  bestpractice: { label: 'best practice', color: '#2dd4bf', bg: 'rgba(45,212,191,0.1)',   border: 'rgba(45,212,191,0.25)' },
  epicfail:     { label: 'epic fail',     color: '#f472b6', bg: 'rgba(244,114,182,0.1)',  border: 'rgba(244,114,182,0.25)' },
}
