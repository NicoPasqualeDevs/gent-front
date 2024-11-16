import React from "react";
import {
  Card, CardContent, Typography, Box, Button, 
  Divider, IconButton, Tooltip
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import WidgetsIcon from "@mui/icons-material/Widgets";
import ApiIcon from '@mui/icons-material/Api';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from "@mui/icons-material/Delete";
import { AgentData } from "@/types/Bots";
import { modelAIOptions } from "@/utils/LargeModelsUtils";
import theme from "@/styles/theme";
import { commonStyles } from "@/utils/DashboardsUtils";
import { alpha } from '@mui/material/styles';
import { TranslationFunction } from '@/types/Translations';

interface IaPanelCardProps {
  bot: AgentData;
  t: TranslationFunction;
  apiBase: string;
  onEdit: (bot: AgentData) => void;
  onDelete: (botId: string) => void;
  navigate: (path: string) => void;
  aiTeamId: string;
}

const IaPanelCard: React.FC<IaPanelCardProps> = ({
  bot,
  t,
  apiBase,
  onEdit,
  onDelete,
  navigate,
  aiTeamId
}) => {
  return (
    <Card sx={commonStyles.card}>
      <CardContent sx={{
        ...commonStyles.cardContent,
        py: 1,
        position: 'relative',
      }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header con título y avatar */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2
          }}>
            <Box>
              <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                {bot.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t.iaPanel.created.replace("{date}", "20/10/2024")}
              </Typography>
            </Box>
          </Box>

          {/* Badge del modelo AI */}
          <Typography variant="body2" sx={{
            color: theme.palette.secondary.contrastText,
            backgroundColor: theme.palette.secondary.light,
            display: 'inline-block',
            padding: '7px 14px',
            borderRadius: '16px',
            fontSize: '0.95rem',
            fontWeight: 'medium',
            mb: 2,
            pt: "9px",
            lineHeight: '0.95rem',
            minWidth: '200px',
            textAlign: 'center',
          }}>
            {modelAIOptions.find(option => option.value === bot.model_ai)?.label || 'No especificado'}
          </Typography>

          <Divider sx={{
            mb: 2,
            mt: 2,
            width: "100%",
            borderColor: theme.palette.divider
          }} />

          {/* Sección de implementación */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom sx={{
              fontWeight: 'bold',
              fontSize: '1rem',
              mb: 1.5
            }}>
              {t.iaPanel.implementation}
            </Typography>
            <Box sx={{
              display: 'flex',
              gap: 1,
              flexWrap: 'wrap'
            }}>
              <Tooltip title={t.iaPanel.testAgent}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate(`/builder/agents/chat/${bot.id}`)}
                  startIcon={<PlayArrowIcon />}
                  sx={commonStyles.implementationButton}
                >
                  <Box sx={{ display: { xs: 'block', xl: 'none' } }}>
                    {t.iaPanel.testAgent}
                  </Box>
                </Button>
              </Tooltip>

              <Tooltip title={t.iaPanel.useAPI}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate(`/builder/agents/tools/${aiTeamId}/${bot.name}/${bot.id}`)}
                  startIcon={<ApiIcon />}
                  sx={commonStyles.implementationButton}
                >
                  <Box sx={{ display: { xs: 'block', xl: 'none' } }}>
                    {t.iaPanel.useAPI}
                  </Box>
                </Button>
              </Tooltip>

              <Tooltip title={t.iaPanel.widget}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => window.open(apiBase.slice(0, -1) + bot.widget_url, "_blank")}
                  startIcon={<WidgetsIcon />}
                  sx={commonStyles.implementationButton}
                >
                  <Box sx={{ display: { xs: 'block', xl: 'none' } }}>
                    {t.iaPanel.widget}
                  </Box>
                </Button>
              </Tooltip>
            </Box>
          </Box>

          <Divider sx={{
            mb: 2,
            mt: 2,
            width: "100%",
            borderColor: theme.palette.divider
          }} />

          {/* Sección de configuración */}
          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{
              fontWeight: 'bold',
              fontSize: '1rem',
              mb: 1.5
            }}>
              {t.iaPanel.configuration}
            </Typography>
            <Box sx={{
              display: 'flex',
              flexWrap: 'nowrap',
            }}>
              <Box sx={{
                width: 140,
                flexShrink: 0
              }}>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => navigate(`/builder/agents/widgetCustomizer/${bot.id}`)}
                  sx={commonStyles.configButton}
                >
                  <span>{t.iaPanel.customization}</span>
                </Button>
              </Box>
              <Box sx={{ width: 16, flexShrink: 0 }} />
              <Box sx={{
                width: 140,
                flexShrink: 0
              }}>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => navigate(`/builder/agents/tools/${aiTeamId}/${bot.name}/${bot.id}`)}
                  sx={commonStyles.configButton}
                >
                  <span>{t.iaPanel.tools}</span>
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Footer con acciones */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            position: 'absolute',
            top: 8,
            right: 8,
            gap: 0.5,
            zIndex: 1,
            '& .MuiIconButton-root': {
              padding: '4px',
              backgroundColor: alpha(theme.palette.background.paper, 0.2),
              '&:hover': {
                backgroundColor: alpha(theme.palette.background.paper, 0.2)
              }
            }
          }}>
            <Tooltip title={t.iaPanel.edit} arrow placement="top">
              <IconButton
                size="small"
                onClick={() => onEdit(bot)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <IconButton
              size="small"
              color="error"
              onClick={() => onDelete(bot.id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default IaPanelCard;
