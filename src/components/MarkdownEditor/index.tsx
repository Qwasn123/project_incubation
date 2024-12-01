'use client';

import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { useState, useCallback } from 'react';
import { Card } from '@nextui-org/react';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

interface MarkdownEditorProps {
  initialValue?: string;
  onChange?: (value: string) => void;
  preview?: 'live' | 'edit' | 'preview';
  height?: number;
}

export default function MarkdownEditor({
  initialValue = '',
  onChange,
  preview = 'live',
  height = 400
}: MarkdownEditorProps) {
  const [value, setValue] = useState(initialValue);

  const handleChange = useCallback((newValue: string | undefined) => {
    const val = newValue || '';
    setValue(val);
    onChange?.(val);
  }, [onChange]);

  return (
    <Card className="w-full overflow-hidden">
      <div data-color-mode="light" className="w-full">
        <MDEditor
          value={value}
          onChange={handleChange}
          preview={preview}
          height={height}
          hideToolbar={false}
          enableScroll={true}
        />
      </div>
    </Card>
  );
}
