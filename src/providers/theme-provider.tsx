"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props}: ThemeProviderProps) {

      const [mounted, setMounted] = React.useState(false)

  // Asegúrate de que el componente solo se renderice en el cliente
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Renderiza un placeholder durante la hidratación para evitar errores
    return <>{children}</>
  }

    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}