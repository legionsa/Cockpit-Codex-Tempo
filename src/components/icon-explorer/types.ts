export interface IconData {
    name: string;
    category: string;
    tags: string[];
    svg: string;
    maintainedBy?: string;
    sizes?: string[];
    usage?: string;
    status?: 'Stable' | 'Beta' | 'Deprecated' | 'New';
}

export interface IconGalleryTab {
    label: string;
    filter: string;
    icons: IconData[];
}
