import { Theme } from './types';

// Standard WeChat-friendly styles with improved readability
const baseStyles = {
  container: {
    fontFamily: '-apple-system-font, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei UI", "Microsoft YaHei", Arial, sans-serif',
    fontSize: '16px',
    lineHeight: '1.75', // Relaxed line height for better readability on mobile
    letterSpacing: '0.05em',
    color: '#333333', // WCAG AA compliant contrast
    textAlign: 'justify' as const,
    padding: '15px'
  },
  image: {
    maxWidth: '100%',
    borderRadius: '8px',
    margin: '15px 0',
    display: 'block',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  }
};

export const THEMES: Theme[] = [
  {
    id: 'classic',
    name: '经典蓝 (商务)',
    previewColor: '#3b82f6',
    styles: {
      ...baseStyles,
      container: { ...baseStyles.container },
      h1: {
        fontSize: '22px',
        fontWeight: 'bold',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '15px',
        marginBottom: '24px',
        marginTop: '10px',
        color: '#1e293b',
        lineHeight: '1.4'
      },
      h2: {
        fontSize: '17px',
        fontWeight: 'bold',
        borderLeft: '4px solid #3b82f6',
        color: '#1e40af',
        backgroundColor: '#eff6ff', // Card header style
        padding: '8px 12px',
        margin: '32px 0 16px 0',
        borderRadius: '0 6px 6px 0'
      },
      h3: {
        fontSize: '16px',
        fontWeight: 'bold',
        margin: '24px 0 12px 0',
        color: '#3b82f6',
        paddingLeft: '8px'
      },
      p: {
        margin: '0 0 16px 0',
        lineHeight: '1.75',
        color: '#334155'
      },
      blockquote: {
        borderLeft: '4px solid #cbd5e1',
        padding: '16px',
        color: '#475569',
        backgroundColor: '#f8fafc', // Card container style
        margin: '20px 0',
        borderRadius: '8px', // Rounded corners
        fontSize: '15px'
      },
      list: {
        paddingLeft: '0', // Reset and use list-style-position usually, but here we manually handle via nodes
        margin: '16px 0'
      },
      listItem: {
        marginBottom: '8px',
        color: '#334155',
        position: 'relative',
        paddingLeft: '4px'
      },
      strong: {
        color: '#2563eb',
        fontWeight: 'bold'
      },
      link: {
        color: '#2563eb',
        textDecoration: 'underline',
        textUnderlineOffset: '2px'
      },
      image: { ...baseStyles.image }
    }
  },
  {
    id: 'ink_black',
    name: '极致黑 (墨客)',
    previewColor: '#171717',
    styles: {
      ...baseStyles,
      container: { ...baseStyles.container, color: '#171717' },
      h1: {
        fontSize: '24px',
        fontWeight: '900',
        textAlign: 'center' as const,
        marginBottom: '40px',
        marginTop: '20px',
        color: '#000000',
        letterSpacing: '0.05em',
        borderBottom: '4px solid #000',
        paddingBottom: '20px'
      },
      h2: {
        fontSize: '18px',
        fontWeight: 'bold',
        textAlign: 'center' as const,
        color: '#ffffff',
        backgroundColor: '#000000', // Solid Black block
        padding: '10px 20px',
        margin: '40px auto 24px auto',
        display: 'table',
        borderRadius: '2px'
      },
      h3: {
        fontSize: '16px',
        fontWeight: 'bold',
        margin: '24px 0 12px 0',
        color: '#000000',
        borderLeft: '4px solid #000000',
        paddingLeft: '12px'
      },
      p: {
        margin: '0 0 20px 0',
        lineHeight: '1.8',
        color: '#262626'
      },
      blockquote: {
        borderLeft: '4px solid #000000',
        padding: '20px 20px',
        color: '#404040',
        fontStyle: 'normal',
        margin: '30px 0',
        backgroundColor: '#f5f5f5',
        fontSize: '15px'
      },
      list: {
        margin: '20px 0',
        paddingLeft: '10px'
      },
      listItem: {
        marginBottom: '12px',
        color: '#262626',
        fontWeight: '500'
      },
      strong: {
        color: '#000000',
        fontWeight: '900',
        textDecoration: 'underline',
        textUnderlineOffset: '4px',
        textDecorationThickness: '2px'
      },
      link: {
        color: '#000000',
        textDecoration: 'underline',
        fontWeight: 'bold'
      },
      image: { ...baseStyles.image, borderRadius: '0', border: '1px solid #000' }
    }
  },
  {
    id: 'elegant',
    name: '优雅红 (杂志)',
    previewColor: '#be123c',
    styles: {
      ...baseStyles,
      container: { ...baseStyles.container },
      h1: {
        fontSize: '24px',
        fontWeight: 'bold',
        textAlign: 'center' as const,
        marginBottom: '40px',
        marginTop: '20px',
        color: '#be123c',
        letterSpacing: '0.1em'
      },
      h2: {
        fontSize: '18px',
        fontWeight: 'bold',
        display: 'table', // Allows auto width centered
        borderBottom: '2px solid #be123c',
        paddingBottom: '8px',
        margin: '40px auto 24px auto', // Center block
        color: '#be123c',
        textAlign: 'center' as const
      },
      h3: {
        fontSize: '16px',
        fontWeight: 'bold',
        margin: '24px 0 12px 0',
        color: '#9f1239',
        textAlign: 'center' as const
      },
      p: {
        margin: '0 0 20px 0',
        lineHeight: '1.8',
        color: '#4a4a4a'
      },
      blockquote: {
        borderTop: '1px solid #e2e8f0',
        borderBottom: '1px solid #e2e8f0',
        padding: '24px',
        color: '#71717a',
        fontStyle: 'italic',
        margin: '32px 0',
        textAlign: 'center' as const,
        backgroundColor: '#fff1f2'
      },
      list: {
        margin: '20px 0',
        paddingLeft: '20px'
      },
      listItem: {
        marginBottom: '10px',
        color: '#4a4a4a'
      },
      strong: {
        color: '#be123c',
        fontWeight: 'bold'
      },
      link: {
        color: '#be123c',
        textDecoration: 'none',
        borderBottom: '1px solid #be123c'
      },
      image: { ...baseStyles.image }
    }
  },
  {
    id: 'minimal',
    name: '禅意绿 (胶囊)',
    previewColor: '#059669',
    styles: {
      ...baseStyles,
      container: { ...baseStyles.container },
      h1: {
        fontSize: '22px',
        fontWeight: 'normal',
        marginBottom: '32px',
        marginTop: '20px',
        color: '#064e3b',
        textAlign: 'center' as const,
        borderBottom: '1px solid #d1fae5',
        paddingBottom: '20px'
      },
      h2: {
        fontSize: '16px',
        fontWeight: 'bold',
        padding: '6px 16px',
        marginBottom: '24px',
        marginTop: '32px',
        color: '#ffffff',
        backgroundColor: '#059669', // Solid capsule
        borderRadius: '999px',
        display: 'inline-block',
        boxShadow: '0 2px 4px rgba(5, 150, 105, 0.2)'
      },
      h3: {
        fontSize: '16px',
        fontWeight: 'bold',
        margin: '24px 0 12px 0',
        color: '#059669',
        borderLeft: '4px solid #34d399',
        paddingLeft: '10px'
      },
      p: {
        margin: '0 0 18px 0',
        lineHeight: '1.8',
        color: '#374151'
      },
      blockquote: {
        backgroundColor: '#f0fdf4',
        padding: '20px',
        color: '#065f46',
        margin: '24px 0',
        borderRadius: '12px',
        fontSize: '15px',
        border: '1px solid #d1fae5'
      },
      list: {
        margin: '16px 0',
        paddingLeft: '10px'
      },
      listItem: {
        marginBottom: '10px',
        color: '#374151',
        display: 'flex',
        alignItems: 'baseline'
      },
      strong: {
        color: '#047857',
        fontWeight: 'bold',
        backgroundColor: '#d1fae5',
        padding: '2px 4px',
        borderRadius: '4px',
        margin: '0 2px'
      },
      link: {
        color: '#059669',
        textDecoration: 'underline',
        textDecorationStyle: 'dotted'
      },
      image: { ...baseStyles.image }
    }
  }
];

export const DEFAULT_CONTENT = ``; // Keep empty for user input