import { PageCircularProgress } from "@/components/CircularProgress";
import { ErrorToast, SuccessToast } from "@/components/Toast";
import { useAppContext } from "@/context/app";
import useBotsApi from "@/hooks/useBots";
import theme from "@/styles/theme";
import { ToolData } from "@/types/Bots";
import {
  Button,
  Checkbox,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Añadir interfaces para los tipos
interface Tool extends ToolData {
  id: string;
  tool_name: string;
}

interface ToolRelationshipData {
  agent_tool_ids: number[];
  [key: string]: number[] | undefined;
}

const not = (a: Tool[], b: Tool[]): Tool[] => {
  return a.filter((value) => b.indexOf(value) === -1);
};

const intersection = (a: ToolData[], b: ToolData[]): Tool[] => {
  return a.filter((value) => b.indexOf(value) !== -1) as Tool[];
};

const ToolsRelationship: React.FC = () => {
  const { botName, botId, aiTeamId } = useParams();

  const {
    getAllTools,
    getBotTools,
    setToolRelationship,
    removeToolRelationship,
  } = useBotsApi();
  const { replacePath, appNavigation } = useAppContext();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [checked, setChecked] = useState<Tool[]>([]);
  const [noRelatedTools, setNoRelatedTools] = useState<Tool[]>([]);
  const [relatedTools, setRelatedTools] = useState<Tool[]>([]);
  const [currentTools, setCurrentTools] = useState<Tool[]>([]);

  const noRelatedChecked = intersection(checked, noRelatedTools);
  const relatedChecked = intersection(checked, relatedTools);

  const handleToggle = (value: Tool) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const handleAllRelated = () => {
    setRelatedTools(relatedTools.concat(noRelatedTools));
    setNoRelatedTools([]);
  };

  const handleCheckedRelated = () => {
    setRelatedTools(relatedTools.concat(noRelatedChecked));
    setNoRelatedTools(not(noRelatedTools, noRelatedChecked));
    setChecked(not(checked, noRelatedChecked));
  };

  const handleCheckedNoRelated = () => {
    setNoRelatedTools(noRelatedTools.concat(relatedChecked));
    setRelatedTools(not(relatedTools, relatedChecked));
    setChecked(not(checked, relatedChecked));
  };

  const handleAllNoRelated = () => {
    setNoRelatedTools(noRelatedTools.concat(relatedTools));
    setRelatedTools([]);
  };

  const getToolsData = useCallback((botId: string) => {
    getAllTools()
      .then((allTools: unknown) => {
        getBotTools(botId)
          .then((response: unknown) => {
            const botTools = response as Tool[];
            const temp = (allTools as Tool[]).filter((item: Tool) => {
              return !botTools.find((i: Tool) => i.id === item.id);
            });
            setNoRelatedTools(temp);
            setRelatedTools(botTools);
            setCurrentTools(botTools);
            setLoaded(true);
          })
          .catch((error) => {
            if (error instanceof Error) {
              ErrorToast(
                "Error: no se pudo establecer conexión con el servidor"
              );
            } else {
              ErrorToast(
                `${error.status} - ${error.error} ${
                  error.data ? ": " + error.data : ""
                }`
              );
            }
          });
      })
      .catch((error) => {
        if (error instanceof Error) {
          ErrorToast("Error: no se pudo establecer conexión con el servidor");
        } else {
          ErrorToast(
            `${error.status} - ${error.error} ${
              error.data ? ": " + error.data : ""
            }`
          );
        }
      });
  }, [getAllTools, getBotTools]);

  const setRelationship = async () => {
    const newCurrentTools: Tool[] = [];
    const toolsToAdd: number[] = [];
    const toolsToRemove: number[] = [];

    const relatedToolsSet = new Set(relatedTools.map((tool) => tool.id));
    const currentToolsSet = new Set(currentTools.map((tool) => tool.id));
    // Comparamos las relaciones que hay (currentTools) con las nuevas (relatedTools)
    // agregamos las nuevas a una lista para vincularlas y armamos el nuevo currentTools (nuevas + existentes) para futuras modificaciones
    relatedTools.forEach((tool) => {
      if (currentToolsSet.has(tool.id)) {
        newCurrentTools.push(tool);
      } else {
        newCurrentTools.push(tool);
        if (tool.id) {
          toolsToAdd.push(parseInt(tool.id));
        }
      }
    });
    // Definimos las tools a remover
    currentTools.forEach((tool) => {
      if (!relatedToolsSet.has(tool.id) && tool.id) {
        toolsToRemove.push(parseInt(tool.id));
      }
    });

    try {
      if (toolsToRemove.length > 0) {
        const removeData: ToolRelationshipData = { agent_tool_ids: toolsToRemove };
        await removeToolRelationship(removeData);
      }

      if (toolsToAdd.length > 0) {
        const addData: ToolRelationshipData = { agent_tool_ids: toolsToAdd };
        await setToolRelationship(addData);
      }

      SuccessToast("Tools relacionadas satisfactoriamente");
      setCurrentTools(newCurrentTools);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? "Error: no se pudo establecer conexión con el servidor"
          : "Error desconocido al establecer conexión con el servidor.";

      ErrorToast(errorMessage);
    }
  };

  const customList = (items: Tool[]) => (
    <Paper
      sx={{
        width: "100%",
        height: "500px",
        overflow: "auto",
        border: `1px solid ${theme.palette.primary.main}`,
      }}
    >
      <List dense component="div" role="list">
        {items.map((value: Tool) => {
          const labelId = `transfer-list-item-${value}-label`;

          return (
            <ListItemButton
              key={value.id}
              role="listitem"
              onClick={handleToggle(value)}
              sx={{
                color: "white",
              }}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                  sx={{
                    color: "white",
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value.tool_name}`} />
            </ListItemButton>
          );
        })}
      </List>
    </Paper>
  );

  useEffect(() => {
    setLoaded(false);
    if (botId) {
      replacePath([
        ...appNavigation.slice(0, 3),
        {
          label: "Asignar Tools",
          current_path: `/builder/agents/tools/${aiTeamId}/${botName}/${botId}`,
          preview_path: "",
          translationKey: "tools.assign"
        },
      ]);
      getToolsData(botId);
    } else {
      ErrorToast("Error al cargar botId en la vista");
    }
  }, [botId, botName, aiTeamId, replacePath, appNavigation, getToolsData]);

  return (
    <>
      {!loaded ? (
        <PageCircularProgress />
      ) : (
        <>
          <Typography variant="h4">
            {botName ? " Tools de " + botName : "Asignación de Tools"}
          </Typography>
          <Grid
            container
            sx={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <Grid item xs={5}>
              <Typography variant="subtitle1" textAlign={"center"}>
                No relacionadas
              </Typography>
              {customList(noRelatedTools)}
            </Grid>
            <Grid item xs={2}>
              <Grid container direction="column" sx={{ alignItems: "center" }}>
                <Button
                  sx={{ my: 0.5 }}
                  variant="outlined"
                  size="small"
                  onClick={handleAllRelated}
                  disabled={noRelatedTools.length === 0}
                  aria-label="move all right"
                >
                  ≫
                </Button>
                <Button
                  sx={{ my: 0.5 }}
                  variant="outlined"
                  size="small"
                  onClick={handleCheckedRelated}
                  disabled={noRelatedChecked.length === 0}
                  aria-label="move selected right"
                >
                  &gt;
                </Button>
                <Button
                  sx={{ my: 0.5 }}
                  variant="outlined"
                  size="small"
                  onClick={handleCheckedNoRelated}
                  disabled={relatedChecked.length === 0}
                  aria-label="move selected left"
                >
                  &lt;
                </Button>
                <Button
                  sx={{ my: 0.5 }}
                  variant="outlined"
                  size="small"
                  onClick={handleAllNoRelated}
                  disabled={relatedTools.length === 0}
                  aria-label="move all left"
                >
                  ≪
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={5}>
              <Typography variant="subtitle1" textAlign={"center"}>
                Relacionadas
              </Typography>
              {customList(relatedTools)}
            </Grid>
          </Grid>
          <Button
            variant="contained"
            sx={{
              marginTop: "20px",
              marginBottom: "20px",
            }}
            onClick={() => {
              if (botId) {
                setRelationship();
              }
            }}
          >
            Establecer Relación
          </Button>
        </>
      )}
    </>
  );
};

export default ToolsRelationship;
