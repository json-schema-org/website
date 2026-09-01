// Common type definitions for the JSON Schema website
import React from 'react';

// Author type for blog posts and content
export interface Author {
  name: string;
  photo: string;
  twitter?: string;
  link?: string;
}

// Frontmatter type for markdown files
export interface Frontmatter {
  title: string;
  date?: string;
  excerpt?: string;
  cover?: string;
  authors?: Author[];
  type?: string | string[];
  section?: SectionType;
  prev?: NavLink;
  next?: NavLink;
  [key: string]: unknown;
}

// Return type for markdown page props
export interface MarkdownPageProps {
  frontmatter: Frontmatter;
  content: string;
}

// Props for pages with blocks
export interface PageWithBlocksProps extends MarkdownPageProps {
  blocks: string[];
}

// Calendar event type
export interface CalendarEvent {
  title: string;
  time: string;
  day: string;
  timezone: string;
  parsedStartDate: string;
}

// iCal event data structure
export interface ICalEventData {
  [key: string]: {
    type: string;
    summary?: string;
    start?: {
      tz: string;
      [key: string]: unknown;
    };
    rrule?: {
      between: (start: Date, end: Date, inclusive: boolean) => Date[];
    };
    [key: string]: unknown;
  };
}

// Blog post structure
export interface BlogPost {
  slug: string;
  frontmatter: Frontmatter;
  content: string;
}

// Slate editor types for JsonEditor
export interface SlateRenderProps {
  attributes: {
    'data-slate-node'?: string;
    'data-slate-inline'?: boolean;
    'data-slate-void'?: boolean;
    dir?: 'rtl';
    ref: React.RefObject<HTMLElement>;
    [key: string]: unknown;
  };
  children: React.ReactNode;
  element?: unknown;
  leaf?: unknown;
  text?: {
    text: string;
    [key: string]: unknown;
  };
}

// Section context type
export type SectionType =
  | 'learn'
  | 'docs'
  | 'implementers'
  | 'tools'
  | 'implementations'
  | 'blog'
  | 'community'
  | 'specification'
  | 'overview'
  | 'getting-started'
  | 'reference'
  | 'roadmap'
  | 'ambassador'
  | 'pro-help'
  | null;

// Navigation link type
export interface NavLink {
  label: string;
  url: string;
}

// Blocks data structure for pages with multiple markdown sections
export interface BlocksData {
  index: string;
  body?: string;
}

// JSON Schema specific types
export interface JsonKeywordValue {
  [key: string]: unknown;
}
