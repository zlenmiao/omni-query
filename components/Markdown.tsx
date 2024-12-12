'use client'

import { useEffect, useRef } from 'react';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

interface MarkdownProps {
  content: string;
  className?: string;
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (__) { }
    }
    return ''; // use external default escaping
  }
});

export default function Markdown({ content, className = '' }: MarkdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Apply syntax highlighting to code blocks
    if (containerRef.current) {
      const codeBlocks = containerRef.current.querySelectorAll('pre code');
      codeBlocks.forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
    }
  }, [content]);

  return (
    <div
      ref={containerRef}
      className={`markdown-body prose prose-blue max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: md.render(content) }}
    />
  );
}
