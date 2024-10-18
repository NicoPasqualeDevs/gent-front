import { PageCircularProgress } from "@/components/CircularProgress";
import { ErrorToast } from "@/components/Toast";
import useBotsApi from "@/hooks/useBots";
import { ToolData } from "@/types/Bots";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
} from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Tools: React.FC = () => {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const { getClientTools } = useBotsApi();
  const [tools, setTools] = useState<ToolData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTools = useCallback(async () => {
    if (!clientId) return;

    setIsLoading(true);
    try {
      const response = await getClientTools(clientId);
      setTools(response);
    } catch (error) {
      ErrorToast("Error al cargar las herramientas");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [clientId, getClientTools]);

  useEffect(() => {
    if (isLoading) {
      fetchTools();
    }
  }, [fetchTools, isLoading]);

  if (isLoading) {
    return <PageCircularProgress />;
  }

  return (
    <>
      <Typography variant="h4" gutterBottom>Listado de Tools</Typography>
      {tools.length > 0 ? (
        tools.map((tool) => (
          <Card key={tool.id} sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h6">{tool.tool_name}</Typography>
              <Stack direction="row" spacing={2}>
                <Typography>ID: {tool.id}</Typography>
                <Typography>Tipo: {tool.type}</Typography>
              </Stack>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography>No hay Tools para mostrar</Typography>
      )}
      <Button
        variant="contained"
        sx={{ marginTop: 2 }}
        onClick={() => navigate(`/builder/agents/tools-form/${clientId}`)}
      >
        Crear Tool
      </Button>
    </>
  );
};

export default Tools;
