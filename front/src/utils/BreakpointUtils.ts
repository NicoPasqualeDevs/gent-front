import { Breakpoint } from "@mui/material"

export const isLarge = (breakpoint : Breakpoint) => {
  switch (breakpoint) {
    case "xl": return true
    case "lg": return true
    case "md": return false
    case "sm": return false
    case "xs": return false
    default: return false
  }
}