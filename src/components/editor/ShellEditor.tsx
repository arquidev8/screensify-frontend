import React, { FC } from 'react';
import { Box } from '@mui/material';
import { ReactNode } from 'react';
import './ShellEditor.css';

interface ShellEditorProps {
  palette: ReactNode;
  canvas: ReactNode;
  inspector: ReactNode;
  codePanel: ReactNode;
  mcpPanel: ReactNode;
}

const ShellEditor: FC<ShellEditorProps> = ({ palette, canvas, inspector, codePanel, mcpPanel }) => {
  return (
    <Box className="shell-editor">
      <Box className="palette">{palette}</Box>
      <Box className="canvas">{canvas}</Box>
      <Box className="inspector">{inspector}</Box>
      <Box className="code-panel">{codePanel}</Box>
      <Box className="mcp-panel">{mcpPanel}</Box>
    </Box>
  );
};

export default ShellEditor;
