export interface BaseShortcut {
    id: string;
    name: string;
}

export interface WebsiteShortcut extends BaseShortcut {
    type: 'website';
    url: string;
}

export interface UNInoteShortcut extends BaseShortcut {
    type: 'uninote';
    description: string;
    startTime: Date;
    completed: boolean;
}

export type Shortcut = WebsiteShortcut | UNInoteShortcut;

export interface ShortcutFormData {
    type: 'website' | 'uninote';
    name: string;
    url?: string;
    description?: string;
}