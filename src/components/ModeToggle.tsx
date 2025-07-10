"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "./ui/button"

export function ModeToggle() {
    const { resolvedTheme, setTheme } = useTheme()

    const toggleTheme = () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full w-8 h-8 border-primary/20"
            title={`Cambiar a tema ${resolvedTheme === 'dark' ? 'claro' : 'oscuro'}`}
        >
            {resolvedTheme === 'dark' ? (
                <Sun className="h-4 w-4 text-yellow-500" />
            ) : (
                <Moon className="h-4 w-4 text-slate-700" />
            )}
            <span className="sr-only">Cambiar tema</span>
        </Button>
    )
}