/**
 * GalleryBlock - Custom Editor.js block for icon/component galleries
 */

import { IconGalleryTabs } from '@/components/icon-explorer/IconGalleryTabs';
import ReactDOM from 'react-dom/client';

export default class GalleryBlock {
    static get toolbox() {
        return {
            title: 'Gallery',
            icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>',
        };
    }

    private api: any;
    private data: { items: any[]; columns?: number };
    private wrapper: HTMLElement | undefined;
    private root: ReactDOM.Root | undefined;

    constructor({ data, api }: any) {
        this.api = api;
        this.data = data || { items: [], columns: 5 };
    }

    render() {
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('gallery-block');

        // Render React component
        this.root = ReactDOM.createRoot(this.wrapper);

        // Convert items to tabs format expected by IconGalleryTabs
        const tabs = this.data.items.length > 0
            ? [{
                label: 'All',
                filter: 'all',
                icons: this.data.items
            }]
            : [];

        this.root.render(<IconGalleryTabs tabs={tabs} />);

        return this.wrapper;
    }

    save() {
        return this.data;
    }

    validate(savedData: any) {
        return savedData.items && Array.isArray(savedData.items);
    }

    destroy() {
        if (this.root) {
            this.root.unmount();
            this.root = undefined;
        }
        this.wrapper = undefined;
    }

    static get isReadOnlySupported() {
        return true;
    }
}
