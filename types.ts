import React from 'react';

export interface ThemeStyle {
  container: React.CSSProperties;
  h1: React.CSSProperties;
  h2: React.CSSProperties;
  h3: React.CSSProperties;
  p: React.CSSProperties;
  blockquote: React.CSSProperties;
  list: React.CSSProperties;
  listItem: React.CSSProperties;
  strong: React.CSSProperties;
  link: React.CSSProperties;
  image: React.CSSProperties;
}

export interface Theme {
  id: string;
  name: string;
  styles: ThemeStyle;
  previewColor: string;
}

export interface ParsedNode {
  type: 'h1' | 'h2' | 'h3' | 'p' | 'blockquote' | 'ul' | 'ol' | 'image' | 'hr';
  content: string | ParsedNode[];
  items?: string[]; // For lists
  src?: string; // For images
  alt?: string; // For images
}

export type AIAction = 'smart_format' | 'polish' | 'summarize' | 'title' | 'emoji';

export type CoverStyle = 'business' | 'illustration' | 'tech' | 'warm' | 'abstract';

export interface CoverOptions {
  style: CoverStyle;
  title: string;
  overlayOpacity: number;
  textColor: string;
}