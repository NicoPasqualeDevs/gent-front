import React from 'react';
import {
    Box,
    Typography,
    IconButton,
    Tooltip,
    useTheme,
    alpha
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import { AiTeamsDetails } from '@/types/Teams';
import { useAppContext } from '@/context';
import { languages } from '@/utils/Traslations';
import { 
    spacing, 
    dimensions, 
    typography, 
    borders,
    alignment,
} from './SkeletonAiTeamCardsVars';

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

    const truncateEmail = (email: string) => {
        return email.length > 15 ? `${email.substring(0, 15)}...` : email;
    };

    return (
        <>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', mb: 0 }}>
                <Typography 
                    variant="h6" 
                    sx={{ 
                        mb: spacing.sectionMarginBottom,
                        fontSize: typography.title.fontSize,
                        fontWeight: typography.title.fontWeight,
                        height: dimensions.card.titleHeight,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: '28px',
                        wordSpacing: 'normal'
                    }}
                >
                    {aiTeam.name}
                </Typography>

                <Box sx={{ 
                    ...alignment.text,
                    gap: spacing.contentGap, 
                    mb: spacing.sectionMarginBottom,
                    height: dimensions.card.addressHeight
                }}>
                    <LocationOnIcon sx={{ 
                        fontSize: dimensions.card.iconSize.location,
                        color: theme.palette.text.secondary 
                    }} />
                    <Typography 
                        variant="body2" 
                        sx={{pt:"2px"}}
                    >
                        {aiTeam.address || t.teamsList.noAddress}
                    </Typography>
                </Box>

                <Box sx={{ mb: spacing.sectionMarginBottom }}>
                    <Box
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            px: typography.badge.padding.x,
                            py: typography.badge.padding.y,
                            borderRadius: borders.badgeRadius,
                            backgroundColor: alpha(theme.palette.secondary.main, 0.75),
                            height: dimensions.card.badgeHeight
                        }}
                    >
                        <Typography sx={{pt:"2px"}} color={theme.palette.primary.contrastText}>
                            {t.teamsList.llmKeyBadge}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ mb: 0 }}>
                    <Typography 
                        variant="body2" 
                        sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: typography.description.lines,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: dimensions.lineHeight,
                            minHeight: dimensions.card.descriptionMinHeight
                        }}
                    >
                        {aiTeam.description || t.teamsList.noDescription}
                    </Typography>
                </Box>
            </Box>

            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                pt: spacing.contentGap,
                borderTop: `1px solid ${theme.palette.divider}`,
            }}>
                <Box sx={{
                    ...alignment.text,
                    gap: spacing.contentGap,
                    minWidth: 0,
                }}>
                    <PersonIcon sx={{ 
                        fontSize: dimensions.card.iconSize.person,
                        color: theme.palette.text.secondary 
                    }} />
                    <Tooltip title={aiTeam.owner_data?.email || t.teamsList.noOwner}>
                        <Typography 
                            variant="body2" 
                            sx={{
                                pt:"2px",
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                ml: '-8px',
                            }}
                        >
                            {aiTeam.owner_data?.email 
                                ? truncateEmail(aiTeam.owner_data.email)
                                : t.teamsList.noOwner}
                        </Typography>
                    </Tooltip>
                </Box>

                <Box sx={{
                    display: 'flex',
                    gap: spacing.footerButtonsGap,
                    alignItems: 'center',
                }}>
                    {[
                        { title: t.teamsList.manage, icon: <ManageAccountsIcon sx={{ fontSize: dimensions.card.iconSize.action }} />, onClick: onManage },
                        { title: t.teamsList.edit, icon: <EditIcon sx={{ fontSize: dimensions.card.iconSize.action }} />, onClick: onEdit },
                        { title: t.teamsList.delete, icon: <DeleteIcon color="error" sx={{ fontSize: dimensions.card.iconSize.action }} />, onClick: onDelete }
                    ].map((action, index) => (
                        <Tooltip key={index} title={action.title}>
                            <IconButton 
                                onClick={action.onClick}
                                size="small"
                                sx={{ 
                                    width: dimensions.card.actionButtonSize,
                                    height: dimensions.card.actionButtonSize,
                                    pl: index === 0 ? '7px' : '6pxpx',
                                    backgroundColor: index !== 2 ? alpha(theme.palette.primary.light, 0.5) : alpha(theme.palette.error.main, 0.125),
                                    '&:hover': {
                                        backgroundColor: index !== 2 ? alpha(theme.palette.primary.light, 0.75) : alpha(theme.palette.error.main, 0.25),
                                    }
                                }}
                            >
                                {action.icon}
                            </IconButton>
                        </Tooltip>
                    ))}
                </Box>
            </Box>
        </>
    );
};

export default AiTeamCard;