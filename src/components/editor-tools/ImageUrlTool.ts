import { API } from '@editorjs/editorjs';

export default class ImageUrlTool {
    private api: API;
    private data: any;

    static get toolbox() {
        return {
            title: 'Image from URL',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
        };
    }

    static get isReadOnlySupported() {
        return true;
    }

    constructor({ api, data }: { api: API; data: any }) {
        this.api = api;
        this.data = data;
    }

    render() {
        const button = document.createElement('button');
        button.type = 'button';
        button.innerHTML = ImageUrlTool.toolbox.icon;
        button.classList.add(this.api.styles.inlineToolButton);

        // This tool doesn't render a block itself immediately. 
        // It triggers the modal, which then inserts the actual Image block.
        // However, Editor.js expects a render method for block tools.
        // We'll return an empty wrapper that triggers the modal on mount/click.

        // Actually, for a Block Tool, render() returns the UI of the block.
        // But we want to open a modal when the user selects this tool from the toolbox.
        // Editor.js doesn't have a direct "onSelect" for block tools that doesn't insert a block.
        // So we'll let Editor.js insert this block, and in the render, we'll dispatch the event.
        // If the user cancels, we should probably remove this block.

        const wrapper = document.createElement('div');

        // Dispatch event to open modal
        setTimeout(() => {
            console.log('Dispatching openImageUrlModal event');
            const event = new CustomEvent('openImageUrlModal', {
                detail: {
                    callback: (url: string) => {
                        console.log('Received URL from modal:', url);
                        // When URL is confirmed, we replace this block with an actual Image block
                        const currentBlockIndex = this.api.blocks.getCurrentBlockIndex();
                        console.log('Current block index:', currentBlockIndex);

                        this.api.blocks.insert('imageUpload', { // We use the standard image tool (which we renamed to imageUpload but it handles both if configured, or we use the one configured for URL)
                            // Wait, we split them. 'imageUpload' is file only. 
                            // We need to insert a block that can render the image from URL.
                            // The 'imageUpload' tool uses @editorjs/image. 
                            // @editorjs/image supports 'url' in data.
                            file: {
                                url: url
                            }
                        }, {}, currentBlockIndex, true); // Replace current block
                    }
                }
            });
            window.dispatchEvent(event);
        }, 0);

        return wrapper;
    }

    save() {
        return this.data;
    }
}
