import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Button, CircularProgress } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import useAgents from '@/hooks/apps/agents';
import { useParams } from 'react-router-dom';
import { ErrorToast, SuccessToast } from "@/components/Toast";

export const PromptTemplate: React.FC = () => {
  const [promptText, setPromptText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { agentId } = useParams();
  const { getPromptTemplate, savePromptTemplate } = useAgents();

  const placeholderTemplate = `### Contexto
Eres un asistente virtual especializado en atención al cliente para nuestra empresa. Tu objetivo es proporcionar información precisa y útil basada en el conocimiento proporcionado.

### Instrucciones
1. Saluda al usuario de manera cordial y profesional
2. Utiliza el contexto proporcionado para responder preguntas
3. Si no tienes información suficiente, indícalo amablemente
4. Mantén un tono conversacional pero profesional
5. Evita inventar información que no esté en el contexto

### Ejemplo
Usuario: "¿Cuál es el horario de atención?"
Asistente: "¡Hola! Con gusto te ayudo. Nuestro horario de atención es de lunes a viernes de 9:00 AM a 6:00 PM. ¿Hay algo más en lo que pueda ayudarte?"`;

  useEffect(() => {
    const loadPromptTemplate = async () => {
      if (agentId) {
        try {
          const response = await getPromptTemplate(agentId);
          if (response.data) {
            if (response.data.data.trim() === "Prompt template file not initialized.") {
              setPromptText(placeholderTemplate);
            } else {
              setPromptText(response.data.data);
            }
          }
        } catch (error) {
          console.error('Error al cargar el prompt template:', error);
          ErrorToast("Error al cargar el prompt template");
          setPromptText(placeholderTemplate);
        }
      }
    };

    loadPromptTemplate();
  }, [agentId]);

  const handleSave = async () => {
    if (agentId && !isSaving) {
      setIsSaving(true);
      try {
        await savePromptTemplate(agentId, promptText);
        SuccessToast("Prompt template guardado exitosamente");
      } catch (error) {
        console.error('Error al guardar el prompt template:', error);
        if (error instanceof Error) {
          ErrorToast("Error: no se pudo establecer conexión con el servidor");
        } else {
          ErrorToast("Error al guardar el prompt template");
        }
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 3,
      height: '100%',
      p: 2
    }}>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        Define el comportamiento de tu asistente utilizando la siguiente estructura:
      </Typography>

      <TextField
        label="Prompt Template"
        multiline
        rows={25}
        value={promptText}
        onChange={(e) => setPromptText(e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            fontFamily: 'monospace',
            fontSize: '0.9rem'
          },
          flex: 1,
          minHeight: '500px'
        }}
        helperText="Utiliza las secciones ### Contexto, ### Instrucciones y ### Ejemplo para estructurar tu prompt"
      />

      <Button
        variant="contained"
        startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
        onClick={handleSave}
        disabled={isSaving}
        sx={{ 
          alignSelf: 'flex-end',
          color: 'white',
          minWidth: '160px'
        }}
      >
        {isSaving ? 'Guardando...' : 'Guardar Prompt'}
      </Button>
    </Box>
  );
};

export default PromptTemplate; 