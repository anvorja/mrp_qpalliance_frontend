// src/data/NavigationData.ts
import {
    Home,
    Package,
    AlertTriangle,
    BarChart3,
    ClipboardList,
    Settings,
    Truck,
    Users,
    HelpCircle,
    Layers,
    FileText
} from 'lucide-react';
import { NavigationSection } from "@/types/navigation";

export const navigationData: NavigationSection[] = [
    {
        section: "Principal",
        items: [
            {
                title: "Inicio",
                href: "/",
                icon: Home
            },
            {
                title: "Productos",
                href: "/products",
                icon: Package
            },
            {
                title: "Alertas de Stock",
                href: "/products/alerts",
                icon: AlertTriangle
            },
            {
                title: "Reportes",
                href: "/reports",
                icon: BarChart3
            },
            {
                title: "Movimientos",
                href: "/movements",
                icon: ClipboardList
            }
        ]
    },
    {
        section: "Gestión",
        items: [
            {
                title: "Proveedores",
                href: "/suppliers",
                icon: Truck
            },
            {
                title: "Usuarios",
                href: "/users",
                icon: Users
            },
            {
                title: "Categorías",
                href: "/categories",
                icon: Layers
            },
            {
                title: "Documentos",
                href: "/documents",
                icon: FileText
            }
        ]
    },
    {
        section: "Sistema",
        items: [
            {
                title: "Configuración",
                href: "/settings",
                icon: Settings
            },
            {
                title: "Ayuda",
                href: "/help",
                icon: HelpCircle
            }
        ]
    }
];