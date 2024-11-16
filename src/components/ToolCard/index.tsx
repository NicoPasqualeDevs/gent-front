import React from 'react';
import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';
import { ToolData } from '@/types/Tools';

interface ToolCardProps {
  tool: ToolData;
  onAction: (toolId: number, action: 'relate' | 'unrelate') => void;
  actionType: 'relate' | 'unrelate';
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onAction, actionType }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" component="div">
          {tool.tool_name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {tool.instruction}
        </Typography>
      </CardContent>
      <CardActions>
        <Button 
          size="small" 
          color={actionType === 'relate' ? 'primary' : 'error'}
          onClick={() => onAction(Number(tool.id), actionType)}
        >
          {actionType === 'relate' ? 'Agregar' : 'Remover'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default ToolCard;
