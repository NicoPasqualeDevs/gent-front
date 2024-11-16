import React from 'react';
import { Box } from '@mui/material';
import { Header } from './Header';
import { Cover } from './Cover';
import { Chat } from './Chat';
import { ChatAction } from './ChatAction';
import { useWidgetPreview } from '../../../../hooks/useWidgetPreview';

interface WidgetPreviewProps {
  widgetData: {
    primary_color: string;
    primary_textContrast: string;
    secondary_color: string;
    secondary_textContrast: string;
    badge_color: string;
    badge_contrast: string;
    font_family: string;
    brand_alt: string;
    brand_logo: string;
    icon_bot: string;
    icon_chat: string;
    icon_hidden: string;
    icon_send: string;
    faq_questions?: string;
  };
}

export const ReactWidget: React.FC<WidgetPreviewProps> = ({ widgetData }) => {
  const { chatState, toggleChat } = useWidgetPreview();

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <Box
        className="widgetComponent-base"
        sx={{
          width: '330px',
          height: '600px',
          backgroundColor: 'white',
          borderRadius: '15px',
          boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          fontFamily: widgetData.font_family || 'inherit'
        }}
      >
        <Header 
          chatState={chatState}
          brandLogo={widgetData.brand_logo}
          brandAlt={widgetData.brand_alt}
          onBack={toggleChat}
          primaryColor={widgetData.primary_color}
          primaryTextContrast={widgetData.primary_textContrast}
        />
        
        {!chatState && (
          <Cover 
            onStartChat={toggleChat}
            faqQuestions={widgetData.faq_questions?.split('|') || []}
            primaryColor={widgetData.primary_color}
          />
        )}
        
        {chatState && (
          <>
            <Chat 
              primaryColor={widgetData.primary_color}
              primaryTextContrast={widgetData.primary_textContrast}
              secondaryColor={widgetData.secondary_color}
              secondaryTextContrast={widgetData.secondary_textContrast}
              iconBot={widgetData.icon_bot}
            />
            <ChatAction 
              iconSend={widgetData.icon_send}
              primaryColor={widgetData.primary_color}
              secondaryColor={widgetData.secondary_color}
            />
          </>
        )}
      </Box>
    </Box>
  );
}; 