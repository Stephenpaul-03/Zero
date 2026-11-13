import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';
import {documentRoute} from './routes.mjs';
export {documentRoute} from './routes.mjs';
import Prism from 'prismjs';
import 'prismjs/components/prism-css.js';
import 'prismjs/components/prism-javascript.js';
import 'prismjs/components/prism-typescript.js';
import 'prismjs/components/prism-json.js';
import 'prismjs/components/prism-bash.js';

export const escapeHtml = (value = '') => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const slugify = value => String(value).normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'untitled';
export const normalizePath = value => {
  const parts = [];
  for (const part of value.replace(/\\/g, '/').split('/')) {
    if (part === '..') parts.pop(); else if (part && part !== '.') parts.push(part);
  }
  return parts.join('/');
};
export function parseSource(raw) {
  const meta = {};
  let body = raw.replace(/^\uFEFF/, '');
  const fm = body.match(/^---\s*\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (fm) {
    for (const line of fm[1].split(/\r?\n/)) {
      const match = line.match(/^([\w-]+):\s*(.*)$/);
      if (match) meta[match[1]] = match[2].replace(/^(["'])(.*)\1$/, '$2');
    }
    body = body.slice(fm[0].length);
  }
  const quizzes = [];
  body = body.replace(/:::quiz([\s\S]*?):::/g, (_, block) => {
    const quiz = { question: '', options: [], correctIndex: 0, explanation: '' };
    let field = '';
    for (const line of block.split(/\r?\n/)) {
      const text = line.trim();
      const match = text.match(/^(question|options|explanation):\s*(.*)$/);
      if (match) { field = match[1]; if (field !== 'options') quiz[field] = match[2]; }
      else if (field === 'options' && text.startsWith('-')) {
        if (text.includes('(correct)')) quiz.correctIndex = quiz.options.length;
        quiz.options.push(text.replace(/^-\s*/, '').replace('(correct)', '').trim());
      } else if (text && field && field !== 'options') quiz[field] += ` ${text}`;
    }
    if (quiz.question && quiz.options.length) quizzes.push(quiz);
    return '';
  });
  return { meta, body, quizzes };
}
export function renderMarkdown(raw, context = {}) {
  const { meta, body, quizzes } = parseSource(raw);
  const headings = [];
  const usedIds = new Map();
  const catalog = context.catalog || { collections: [], documents: [], assets: [] };
  const base = (context.base || '/').replace(/\/$/, '');
  const folder = (context.file || '').split('/').slice(0, -1).join('/');
  const resolveAsset = href => {
    if (/^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(href)) return href;
    let decoded = href;
    try { decoded = decodeURIComponent(href); } catch { /* Keep source. */ }
    const direct = normalizePath(`${folder}/${decoded}`);
    const alternate = normalizePath(`${folder}/Images/${decoded}`);
    if (context.assetUrls?.[direct]) return context.assetUrls[direct];
    const basename=decoded.split('/').at(-1);
    const candidates=[direct,alternate,normalizePath(`${folder}/Images/${basename}`)];
    const alias=catalog.assetAliases?.[direct];
    const exact=candidates.find(candidate=>catalog.assets?.includes(candidate));
    const insensitive=candidates.map(candidate=>catalog.assets?.find(asset=>asset.toLowerCase()===candidate.toLowerCase())).find(Boolean);
    const file=alias||exact||insensitive||direct;
    return `${base}/zero-content/${file.split('/').map(encodeURIComponent).join('/')}`;
  };
  const resolveLink = original => {
    let href=original;
    if(href.startsWith('/')&&!href.startsWith('//')){
      const route=href.split(/[?#]/)[0],suffix=href.slice(route.length);
      const legacy=catalog.documents.find(doc=>doc.legacy&&`/${doc.legacy}`===route);
      if(legacy)return `${base}${documentRoute(legacy,catalog)}${suffix}`;
      const canonical=route.replace(/^\/learn(?=\/|$)/,'/notes');
      if(/^\/(?:notes|build|pages)(?:\/|$)/.test(canonical))return `${base}${canonical}${suffix}`;
    }
    if (!/^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(href)) {
      let decoded=href.split('#')[0];try{decoded=decodeURIComponent(decoded)}catch{/* Keep source. */}
      const target=normalizePath(`${folder}/${decoded}`);
      const doc=catalog.documents.find(doc=>doc.file===target||doc.file===`${target}.md`||normalizePath(`${doc.file.split('/').slice(0,-1).join('/')}/${doc.originalName||doc.file.split('/').at(-1).replace(/^\d+-/,'')}`)===target);
      href=doc?`${base}${documentRoute(doc,catalog)}${original.includes('#')?`#${original.split('#')[1]}`:''}`:resolveAsset(href);
    }
    return href;
  };
  const renderer = new marked.Renderer();
  renderer.heading = function(token) {
    const text = token.text.replace(/<[^>]*>/g, '').replace(/[*_`]/g, '');
    const root = (context.legacyHeadings ? text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') : slugify(text)) || slugify(text);
    const count = usedIds.get(root) || 0;
    usedIds.set(root, count + 1);
    const id = count ? `${root}-${count}` : root;
    if (token.depth >= 2 && token.depth <= 3) headings.push({ id, text, depth: token.depth });
    return `<h${token.depth} id="${id}">${this.parser.parseInline(token.tokens)}</h${token.depth}>`;
  };
  renderer.code = ({ text, lang = '' }) => {
    const language = lang.split(/\s+/)[0];
    const highlighted = Prism.languages[language] ? Prism.highlight(text, Prism.languages[language], language) : escapeHtml(text);
    return `<pre><code class="language-${escapeHtml(language)}">${highlighted}</code></pre>`;
  };
  renderer.image = ({ href, text, title }) => `<img src="${escapeHtml(resolveAsset(href))}" alt="${escapeHtml(text)}"${title ? ` title="${escapeHtml(title)}"` : ''} loading="lazy" />`;
  renderer.link = function(token) {
    const href=resolveLink(token.href);
    return `<a href="${escapeHtml(href)}"${/^https?:\/\//i.test(href) ? ' target="_blank" rel="noopener noreferrer"' : ''}>${this.parser.parseInline(token.tokens)}</a>`;
  };
  const html = sanitizeHtml(marked.parse(body, { renderer, async: false, gfm: true }), {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img', 'details', 'summary', 'input'],
    allowedAttributes: {
      '*': ['id', 'class', 'title', 'aria-label'],
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      input: ['type', 'checked', 'disabled'],
      td: ['align', 'colspan', 'rowspan'], th: ['align', 'colspan', 'rowspan'],
      details: ['open'], ol: ['start'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: {img: ['http', 'https', 'data']},
    parseStyleAttributes: false,
    transformTags: {
      a: (tagName, attribs) => ({tagName, attribs: {...attribs, ...(attribs.href ? {href:resolveLink(attribs.href)} : {}), ...(attribs.target === '_blank' ? {rel: 'noopener noreferrer'} : {})}}),
      img: (tagName, attribs) => ({tagName, attribs: {...attribs, ...(attribs.src ? {src:resolveAsset(attribs.src)} : {})}}),
      input: (tagName, attribs) => ({tagName, attribs: {type: 'checkbox', disabled: '', ...(Object.hasOwn(attribs, 'checked') ? {checked: ''} : {})}}),
    },
  });
  return { html, meta, quizzes, headings };
}
