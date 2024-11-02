// Espaciado
export const spacing = {
    cardPadding: '24px',
    contentGap: 2,
    sectionMarginBottom: 2,
    footerButtonsGap: 1,
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

// Alineación
export const alignment = {
    text: {
        display: 'flex',
        alignItems: 'center',
    },
    ownerText: {
        marginTop: 0,
    },
    addressText: {
        marginTop: 0,
    },
    skeletonTransform: 'none',
} as const;

// Medidas comunes
export const common = {
    ownerNameWidth: 120,
    titleSkeletonWidth: '60%',
    addressSkeletonWidth: '40%',
    badgeSkeletonWidth: 140,
    descriptionSkeletonWidths: {
        first: '100%',
        second: '90%',
        third: '60%'
    }
} as const;

export const commonStyles = {
    scrollableContent: {
        overflow: 'auto',
        scrollbarColor: "auto",
    }
} as const;