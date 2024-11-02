// Espaciado
export const spacing = {
    cardPadding: '24px',
    contentGap: 2,
    sectionMarginBottom: 2,
} as const;

// Dimensiones
export const dimensions = {
    card: {
        titleHeight: 28,
        addressHeight: 20,
        badgeHeight: 28,
        descriptionMinHeight: 60,
        actionButtonSize: 32,
        iconSize: {
            location: 16,
            person: 24,
            action: '1.25rem'
        }
    },
    lineHeight: '20px',
} as const;

// Tipografía
export const typography = {
    title: {
        fontSize: '1.25rem',
        fontWeight: 500,
    },
    badge: {
        padding: {
            x: 1.5,
            y: 0.5,
        },
        borderRadius: '14px',
    },
    description: {
        lines: 3,
    }
} as const;

// Bordes y efectos
export const borders = {
    badgeRadius: '14px',
} as const;
