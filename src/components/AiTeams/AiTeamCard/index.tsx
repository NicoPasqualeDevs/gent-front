import { 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  Button, 
  IconButton, 
  Box, 
  Tooltip,
  useTheme 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import { AiTeamsDetails } from '@/types/AiTeams';

interface AiTeamCardProps {
  aiTeam: AiTeamsDetails;
  onDelete: () => void;
  onEdit: () => void;
  onManage: () => void;
}

const AiTeamCard: React.FC<AiTeamCardProps> = ({ aiTeam, onDelete, onEdit, onManage }) => {
  const theme = useTheme();

  return (
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'transparent',
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: 'none',
    }}>
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h6" component="div" gutterBottom noWrap>
          {aiTeam.name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            minHeight: '3.6em',
            mb: 2,
          }}
        >
          {aiTeam.description}
        </Typography>
        
        {aiTeam.owner_data && (
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Owner">
              <PersonIcon sx={{ mr: 1, fontSize: 'small' }} />
            </Tooltip>
            <Typography variant="body2" color="text.secondary">
              {aiTeam.owner_data.name} ({aiTeam.owner_data.email})
            </Typography>
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
        <Box>
          <Button size="small" onClick={onEdit}>
            Edit
          </Button>
          <Button size="small" onClick={onManage}>
            Manage
          </Button>
        </Box>
        <IconButton
          size="small"
          color="error"
          onClick={onDelete}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default AiTeamCard; 