import { useState } from 'react';
import {
  Box,
  TextField,
  Tabs,
  Tab,
  Paper,
  Typography,
  IconButton,
  Stack,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Bold,
  Italic,
  Code,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Eye,
  Edit,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export const RichTextEditor = ({ value, onChange, placeholder, minHeight = 300 }) => {
  const [mode, setMode] = useState('edit'); // 'edit' or 'preview'

  const handleInsert = (before, after = '') => {
    const textarea = document.querySelector(`textarea[name="markdown-editor"]`);
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText =
      value.substring(0, start) + before + selectedText + after + value.substring(end);

    onChange(newText);

    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const toolbar = [
    { icon: <Bold size={18} />, label: 'Tučně', before: '**', after: '**' },
    { icon: <Italic size={18} />, label: 'Kurzíva', before: '*', after: '*' },
    { icon: <Code size={18} />, label: 'Kód', before: '`', after: '`' },
    { icon: <List size={18} />, label: 'Seznam', before: '\n- ', after: '' },
    { icon: <ListOrdered size={18} />, label: 'Číslovaný seznam', before: '\n1. ', after: '' },
    { icon: <LinkIcon size={18} />, label: 'Odkaz', before: '[', after: '](url)' },
    { icon: <ImageIcon size={18} />, label: 'Obrázek', before: '![alt](', after: ')' },
  ];

  return (
    <Paper sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
      {/* Toolbar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 1,
          bgcolor: 'background.default',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack direction="row" spacing={0.5}>
          {toolbar.map((item, index) => (
            <Tooltip key={index} title={item.label}>
              <IconButton
                size="small"
                onClick={() => handleInsert(item.before, item.after)}
                disabled={mode === 'preview'}
              >
                {item.icon}
              </IconButton>
            </Tooltip>
          ))}
        </Stack>

        <Tabs value={mode} onChange={(e, v) => setMode(v)} size="small">
          <Tab
            value="edit"
            icon={<Edit size={16} />}
            iconPosition="start"
            label="Editovat"
            sx={{ minHeight: 36, py: 0.5 }}
          />
          <Tab
            value="preview"
            icon={<Eye size={16} />}
            iconPosition="start"
            label="Náhled"
            sx={{ minHeight: 36, py: 0.5 }}
          />
        </Tabs>
      </Box>

      {/* Editor/Preview */}
      <Box sx={{ position: 'relative' }}>
        {mode === 'edit' ? (
          <TextField
            fullWidth
            multiline
            name="markdown-editor"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || 'Začni psát... Podporuje Markdown!'}
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: {
                p: 2,
                fontFamily: 'Monaco, Courier, monospace',
                fontSize: 14,
                minHeight,
              },
            }}
          />
        ) : (
          <Box
            sx={{
              p: 2,
              minHeight,
              maxHeight: 600,
              overflow: 'auto',
            }}
          >
            {value ? (
              <MarkdownPreview content={value} />
            ) : (
              <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                Žádný obsah k zobrazení
              </Typography>
            )}
          </Box>
        )}
      </Box>

      {/* Help */}
      <Box
        sx={{
          px: 2,
          py: 1,
          bgcolor: 'background.default',
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexWrap: 'wrap',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Markdown:
        </Typography>
        <Chip label="**tučně**" size="small" />
        <Chip label="*kurzíva*" size="small" />
        <Chip label="`kód`" size="small" />
        <Chip label="[odkaz](url)" size="small" />
        <Chip label="# Nadpis" size="small" />
      </Box>
    </Paper>
  );
};

/**
 * Markdown Preview Component
 */
export const MarkdownPreview = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code
              className={className}
              style={{
                backgroundColor: 'rgba(110, 118, 129, 0.1)',
                padding: '2px 6px',
                borderRadius: 4,
                fontFamily: 'Monaco, Courier, monospace',
                fontSize: '0.9em',
              }}
              {...props}
            >
              {children}
            </code>
          );
        },
        h1: ({ children }) => (
          <Typography variant="h4" sx={{ mt: 3, mb: 2, fontWeight: 700 }}>
            {children}
          </Typography>
        ),
        h2: ({ children }) => (
          <Typography variant="h5" sx={{ mt: 2.5, mb: 1.5, fontWeight: 600 }}>
            {children}
          </Typography>
        ),
        h3: ({ children }) => (
          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
            {children}
          </Typography>
        ),
        p: ({ children }) => (
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
            {children}
          </Typography>
        ),
        a: ({ children, href }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#6366f1', textDecoration: 'underline' }}
          >
            {children}
          </a>
        ),
        ul: ({ children }) => (
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            {children}
          </Box>
        ),
        ol: ({ children }) => (
          <Box component="ol" sx={{ pl: 3, mb: 2 }}>
            {children}
          </Box>
        ),
        li: ({ children }) => (
          <Typography component="li" variant="body1" sx={{ mb: 0.5 }}>
            {children}
          </Typography>
        ),
        blockquote: ({ children }) => (
          <Box
            component="blockquote"
            sx={{
              borderLeft: '4px solid',
              borderColor: 'primary.main',
              pl: 2,
              py: 1,
              my: 2,
              bgcolor: 'action.hover',
              fontStyle: 'italic',
            }}
          >
            {children}
          </Box>
        ),
        table: ({ children }) => (
          <Box sx={{ overflowX: 'auto', mb: 2 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>{children}</table>
          </Box>
        ),
        th: ({ children }) => (
          <th
            style={{
              border: '1px solid #ddd',
              padding: '8px 12px',
              backgroundColor: '#f5f5f5',
              fontWeight: 600,
            }}
          >
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td style={{ border: '1px solid #ddd', padding: '8px 12px' }}>{children}</td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};
