import React, { FC } from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import { ComponentInstance } from '../../stores/editorStore';

interface ComponentTreeViewProps {
  instances: ComponentInstance[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

const ComponentTreeView: FC<ComponentTreeViewProps> = ({ instances, selectedId, onSelect }) => (
  <List>
    {instances.map(inst => (
      <ListItem
        key={inst.id}
        button
        selected={inst.id === selectedId}
        onClick={() => onSelect(inst.id)}
      >
        <ListItemText primary={`${inst.component_type} (${inst.id})`} />
      </ListItem>
    ))}
  </List>
);

export default ComponentTreeView;
