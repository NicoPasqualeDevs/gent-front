import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  useTheme,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import { AiTeamsDetails } from '@/types/AiTeams';
import { useAppContext } from '@/context/app';
import { languages } from '@/utils/Traslations';
import { alpha } from '@mui/material/styles';

interface AiTeamCardProps {
  aiTeam: AiTeamsDetails;
  onDelete: () => void;
  onEdit: () => void;
  onManage: () => void;
}

const AiTeamCard: React.FC<AiTeamCardProps> = ({
  aiTeam,
  onDelete,
  onEdit,
  onManage
}) => {
  const theme = useTheme();
  const { language } = useAppContext();
  const t = languages[language as keyof typeof languages];

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <Box sx={{
      height: '180px',
      display: 'flex',
      flexDirection: 'column',
      p: 0,
    }}>
      {/* Título, dirección y descripción */}
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="h6"
          component="h2"
          sx={{
            mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: '1.1rem',
            fontWeight: 600,
            lineHeight: 1.2
          }}
        >
          {truncateText(aiTeam.name, 40)}
        </Typography>

        {/* Dirección */}
        {aiTeam.address && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              mb: 1
            }}
          >
            <LocationOnIcon
              sx={{
                fontSize: '0.9rem',
                color: theme.palette.text.secondary
              }}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontSize: '0.8rem'
              }}
            >
              {truncateText(aiTeam.address, 35)}
            </Typography>
          </Box>
        )}

        {/* LLM Key Badge */}
        <Box sx={{ mb: 1 }}>
          <Chip
            icon={<KeyIcon sx={{ fontSize: '0.9rem' }} />}
            label={`LLM Key (${t.aiTeamsList.comingSoon})`}
            size="small"
            variant="outlined"
            sx={{
              fontSize: '0.75rem',
              color: theme.palette.text.secondary,
              borderColor: theme.palette.divider,
              '& .MuiChip-icon': {
                color: theme.palette.text.secondary
              }
            }}
          />
        </Box>

        {/* Descripción */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: '1.4em',
            height: '2.8em',
            mb: 1
          }}
        >
          {aiTeam.description || t.aiTeamsList.noDescription}
        </Typography>
      </Box>

      {/* Área de acciones y footer */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        mt: 'auto',
        pt: 0.5,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}>
        {/* Información del propietario */}
        {aiTeam.owner_data && (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            width: '100%',
          }}>
            <Tooltip title={t.aiTeamsList.owner}>
              <PersonIcon sx={{
                fontSize: 'small',
                color: theme.palette.text.secondary
              }} />
            </Tooltip>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1
              }}
            >
              {truncateText(aiTeam.owner_data.email, 30)}
            </Typography>
          </Box>
        )}

        {/* Botones de acción */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 1,
          width: '100%'
        }}>
          <Tooltip title={t.aiTeamsList.manage}>
            <IconButton
              onClick={onManage}
              size="small"
              sx={{
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1)
                }
              }}
            >
              <ManageAccountsIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t.aiTeamsList.edit}>
            <IconButton
              onClick={onEdit}
              size="small"
              sx={{
                color: theme.palette.info.main,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.info.main, 0.1)
                }
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t.aiTeamsList.delete}>
            <IconButton
              onClick={onDelete}
              size="small"
              sx={{
                color: theme.palette.error.main,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.error.main, 0.1)
                }
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

export default AiTeamCard;