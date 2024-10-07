export const scaleXs = 400;
export const scaleSm = 600;
export const scaleMd = 800;
export const scaleLg = 800;
export const scaleXl = 1000;

export const getTaskImgWidth = (breakpoint: string) => {
    switch (breakpoint) {
        case "xl": return 200
            break
        case "lg": return 150
            break
        case "md": return 200
            break
        case "sm": return 250
            break
        case "xs": return 300
            break
        default: return 150
            break
    }
}
