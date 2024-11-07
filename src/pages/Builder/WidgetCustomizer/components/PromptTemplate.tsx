import React from 'react';
import { Box, TextField, Typography } from '@mui/material';

export const PromptTemplate: React.FC = () => {
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
        rows={20}
        placeholder={placeholderTemplate}
        sx={{
          '& .MuiOutlinedInput-root': {
            fontFamily: 'monospace',
            fontSize: '0.9rem'
          }
        }}
        helperText="Utiliza las secciones ### Contexto, ### Instrucciones y ### Ejemplo para estructurar tu prompt"
      />
    </Box>
  );
};

export default PromptTemplate; 