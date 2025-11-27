import { ParsedNode } from '../types';
import React from 'react';

/**
 * A lightweight markdown parser for the specific needs of WeChat formatting.
 * Handles: Headers, Lists, Blockquotes, Images, Paragraphs, Bold, Links.
 */
export const parseMarkdown = (text: string): ParsedNode[] => {
  const lines = text.split('\n');
  const nodes: ParsedNode[] = [];
  let currentList: ParsedNode | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines, but ensure lists are closed
    if (line === '') {
      if (currentList) {
        nodes.push(currentList);
        currentList = null;
      }
      continue;
    }

    // H1
    if (line.startsWith('# ')) {
      nodes.push({ type: 'h1', content: line.substring(2) });
      continue;
    }

    // H2
    if (line.startsWith('## ')) {
      nodes.push({ type: 'h2', content: line.substring(3) });
      continue;
    }

    // H3
    if (line.startsWith('### ')) {
      nodes.push({ type: 'h3', content: line.substring(4) });
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      nodes.push({ type: 'blockquote', content: line.substring(2) });
      continue;
    }

    // Image
    const imgMatch = line.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imgMatch) {
      nodes.push({ type: 'image', src: imgMatch[2], alt: imgMatch[1], content: '' });
      continue;
    }

    // Horizontal Rule
    if (line === '---' || line === '***') {
      nodes.push({ type: 'hr', content: '' });
      continue;
    }

    // Lists (Unordered)
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const itemContent = line.substring(2);
      if (!currentList || currentList.type !== 'ul') {
        if (currentList) nodes.push(currentList);
        currentList = { type: 'ul', content: [], items: [itemContent] };
      } else {
        currentList.items?.push(itemContent);
      }
      continue;
    }

    // Lists (Ordered) - simplified detection
    if (/^\d+\.\s/.test(line)) {
      const itemContent = line.replace(/^\d+\.\s/, '');
      if (!currentList || currentList.type !== 'ol') {
        if (currentList) nodes.push(currentList);
        currentList = { type: 'ol', content: [], items: [itemContent] };
      } else {
        currentList.items?.push(itemContent);
      }
      continue;
    }

    // Close list if we hit a non-list item
    if (currentList) {
      nodes.push(currentList);
      currentList = null;
    }

    // Paragraph (default)
    nodes.push({ type: 'p', content: line });
  }

  if (currentList) {
    nodes.push(currentList);
  }

  return nodes;
};

// Helper to replace inline styles (Bold, Link) within a string content
// Returns React nodes array
export const parseInlineStyles = (text: string, styles: any) => {
  const parts = text.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
  return parts.map((part, index) => {
    // Bold
    if (part.startsWith('**') && part.endsWith('**')) {
      return React.createElement('span', { key: index, style: styles.strong }, part.slice(2, -2));
    }
    // Link
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      return React.createElement('a', {
        key: index,
        href: linkMatch[2],
        style: styles.link,
        target: "_blank",
        rel: "noopener noreferrer"
      }, linkMatch[1]);
    }
    return part;
  });
};