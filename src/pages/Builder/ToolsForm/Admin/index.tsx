import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import useBotsApi from '@/hooks/useBots';
import { ErrorToast, SuccessToast } from "@/components/Toast";

const ToolForm: React.FC = () => {
  const { aiTeamId } = useParams<{ aiTeamId: string }>();
  const [toolName, setToolName] = useState('');
  const [instruction, setInstruction] = useState('');
  const [toolCode, setToolCode] = useState<File | null>(null);
  const { postTool } = useBotsApi();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('tool_name', toolName);
    formData.append('instruction', instruction);
    if (aiTeamId) {
      formData.append('aiTeam_id', aiTeamId);
    }
    if (toolCode) {
      formData.append('tool_code', toolCode);
    }

    try {
      await postTool(formData);
      SuccessToast("Herramienta creada exitosamente");
      // Aquí puedes agregar lógica adicional después de crear la herramienta
    } catch (error) {
      ErrorToast("Error al crear la herramienta");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={toolName}
        onChange={(e) => setToolName(e.target.value)}
        placeholder="Nombre de la herramienta"
        required
      />
      <textarea
        value={instruction}
        onChange={(e) => setInstruction(e.target.value)}
        placeholder="Instrucciones"
        required
      />
      <input
        type="file"
        onChange={(e) => setToolCode(e.target.files ? e.target.files[0] : null)}
      />
      <button type="submit">Crear Herramienta</button>
    </form>
  );
};

export default ToolForm;
