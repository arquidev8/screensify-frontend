import React, { useEffect, useState, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import ShellEditor from '../../components/editor/ShellEditor';
import ComponentTreeView from '../../components/editor/ComponentTreeView';
import { useEditorStore } from '../../stores/editorStore';
import { Box, Snackbar, Alert, TextField, Typography, Button } from '@mui/material';

const paletteComponents = ['Box', 'Text'];

const EditorPage: React.FC = () => {
  const { screenId } = useParams<{ screenId: string }>();
  const id = Number(screenId);
  const {
    instances,
    fetchInstances,
    createInstance,
    deleteInstance,
    selectInstance,
    selectedId,
    isLoading,
    error,
    updateInstance,
  } = useEditorStore();

  useEffect(() => {
    if (id) {
      console.log('Fetching instances for screen', id);
      fetchInstances(id).then(() => console.log('Fetched instances:', useEditorStore.getState().instances));
    }
  }, [id, fetchInstances]);

  const handleAdd = async (type: string) => {
    console.log('Adding instance of', type);
    await createInstance({ screen_id: id, component_type: type, props: {}, parent_id: null, order: instances.length, is_active: true });
    console.log('Created, refetching instances');
    await fetchInstances(id);
  };

  const [propsJson, setPropsJson] = useState('');
  const [isJsonValid, setIsJsonValid] = useState(true);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success'|'error' }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (selectedId) {
      const inst = instances.find(i => i.id === selectedId);
      setPropsJson(inst ? JSON.stringify(inst.props, null, 2) : '');
    }
  }, [selectedId, instances]);

  const handleSaveProps = () => {
    if (selectedId) {
      try {
        const parsed = JSON.parse(propsJson);
        updateInstance(selectedId, { props: parsed });
        setSnackbar({ open: true, message: 'Props guardados', severity: 'success' });
      } catch (e) {
        setSnackbar({ open: true, message: 'JSON inválido', severity: 'error' });
      }
    }
  };

  // Auto-save on propsJson change (debounced)
  useEffect(() => {
    if (!selectedId) return;
    const timer = setTimeout(() => {
      try {
        const parsed = JSON.parse(propsJson);
        updateInstance(selectedId, { props: parsed })
          .then(() => setSnackbar({ open: true, message: 'Auto‑guardado', severity: 'success' }))
          .catch(() => setSnackbar({ open: true, message: 'Error al auto‑guardar', severity: 'error' }));
      } catch {
        // invalid JSON: skip auto-save
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [propsJson, selectedId, updateInstance]);

  return id ? (
    <>
      <ShellEditor
        palette={
          <div>
            <h3>Palette</h3>
            {paletteComponents.map(type => (
              <button key={type} onClick={() => handleAdd(type)}>
                {type}
              </button>
            ))}
          </div>
        }
        canvas={
          <Box>
            <h3>Canvas</h3>
            {isLoading ? (
              'Loading...'
            ) : instances.length === 0 ? (
              'No components'
            ) : (
              instances.map(inst => {
                const common = {
                  key: inst.id,
                  onClick: () => selectInstance(inst.id),
                  sx: { p: 1, m: 1, border: inst.id === selectedId ? '2px solid blue' : '1px solid gray', ...inst.props }
                };
                return inst.component_type === 'Text'
                  ? <Typography {...common}>{inst.props.text || `Text #${inst.id}`}</Typography>
                  : <Box {...common}>{inst.component_type} #{inst.id}</Box>;
              })
            )}
          </Box>
        }
        inspector={
          <Box>
            <h3>Inspector</h3>
            {selectedId ? (
              <>
                <TextField
                  label="Props JSON"
                  multiline fullWidth minRows={6}
                  value={propsJson}
                  error={!isJsonValid}
                  helperText={!isJsonValid ? 'JSON inválido' : ''}
                  onChange={e => {
                    const val = e.target.value;
                    setPropsJson(val);
                    try { JSON.parse(val); setIsJsonValid(true); }
                    catch { setIsJsonValid(false); }
                  }}
                />
                <Button
                  variant="contained" color="primary"
                  onClick={handleSaveProps}
                  disabled={!isJsonValid}
                  sx={{ mt: 1 }}
                >Save Props</Button>
              </>
            ) : 'Select instance'}
          </Box>
        }
        codePanel={<div><h3>Code Panel</h3><p>Placeholder</p></div>}
        mcpPanel={<div><h3>MCP Panel</h3><p>Placeholder</p></div>}
      />
      {error && <Alert severity="error">{error}</Alert>}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(o => ({ ...o, open: false }))}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(o => ({ ...o, open: false }))}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  ) : (
    <p>Screen ID no válido</p>
  );
};

export default EditorPage;
