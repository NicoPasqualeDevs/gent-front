import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import useApi from '@/hooks/api/useApi';
import { DashboardContainer, DashboardContent } from '@/utils/DashboardsUtils';

const TestAgent: React.FC = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const { apiGet } = useApi();

  useEffect(() => {
    const loadWidget = async () => {
      if (!agentId) {
        setError('ID de agente no válido');
        setLoading(false);
        return;
      }

      try {
        const response = await apiGet(`widget/${agentId}/`, {
          skipAuth: true,
          headers: {
            'Accept': 'text/html',
          }
        });

        if (response.success && response.data) {
          setHtmlContent(response.data as string);
        } else {
          throw new Error('Error al cargar el widget');
        }
      } catch (err) {
        console.error('Error loading widget:', err);
        setError('Error al cargar el widget');
      } finally {
        setLoading(false);
      }
    };

    loadWidget();
  }, [agentId, apiGet]);

  if (error) {
    return (
      <DashboardContainer>
        <DashboardContent>
          <Box 
            sx={{ 
              width: '100%', 
              height: '100%', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              color: 'error.main'
            }}
          >
            {error}
          </Box>
        </DashboardContent>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <DashboardContent sx={{ 
        height: '100%',
        position: 'relative',
        '& .MuiPaper-root': {
          borderRadius: 0,
          height: '100%'
        }
      }}>
        {loading && (
          <Box 
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              bgcolor: 'background.paper',
              zIndex: 1
            }}
          >
            <CircularProgress />
          </Box>
        )}
        {htmlContent && (
          <iframe
            srcDoc={htmlContent}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: loading ? 'none' : 'block'
            }}
            title="Agent Test Chat"
            onLoad={() => setLoading(false)}
          />
        )}
      </DashboardContent>
    </DashboardContainer>
  );
};

export default TestAgent;
