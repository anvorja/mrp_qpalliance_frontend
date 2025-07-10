// src/types/navigation.ts
import { LucideIcon } from 'lucide-react';

export interface NavigationItem {
    title: string;
    href: string;
    icon: LucideIcon;
}

export interface NavigationSection {
    section: string;
    items: NavigationItem[];
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}