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
        const wrapper = document.createElement('div');
        wrapper.classList.add('cdx-block');

        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.gap = '10px';
        container.style.alignItems = 'center';
        container.style.padding = '12px';
        container.style.border = '1px solid #e2e8f0';
        container.style.borderRadius = '8px';
        container.style.background = '#ffffff';
        container.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Paste image URL here...';
        input.style.flex = '1';
        input.style.padding = '10px 14px';
        input.style.borderRadius = '6px';
        input.style.border = '1px solid #cbd5e1';
        input.style.fontSize = '14px';
        input.style.outline = 'none';
        input.style.color = '#0f172a';
        input.style.backgroundColor = '#f8fafc';

        // Add focus style listener
        input.onfocus = () => {
            input.style.borderColor = '#0f172a';
            input.style.backgroundColor = '#ffffff';
        };
        input.onblur = () => {
            input.style.borderColor = '#cbd5e1';
            input.style.backgroundColor = '#f8fafc';
        };

        const button = document.createElement('button');
        button.innerText = 'Add Image';
        button.type = 'button';
        button.style.padding = '10px 20px';
        button.style.borderRadius = '6px';
        button.style.background = '#0f172a';
        button.style.color = 'white';
        button.style.fontSize = '14px';
        button.style.fontWeight = '500';
        button.style.cursor = 'pointer';
        button.style.border = 'none';
        button.style.transition = 'background 0.2s';

        button.onmouseover = () => {
            button.style.background = '#1e293b';
        };
        button.onmouseout = () => {
            button.style.background = '#0f172a';
        };

        const submitUrl = () => {
            const url = input.value.trim();
            if (url) {
                const currentBlockIndex = this.api.blocks.getCurrentBlockIndex();

                // Insert the image block
                this.api.blocks.insert('imageUpload', {
                    file: {
                        url: url
                    }
                }, {}, currentBlockIndex, true);
            }
        };

        button.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            submitUrl();
        };

        input.onkeydown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                submitUrl();
            }
        };

        container.appendChild(input);
        container.appendChild(button);
        wrapper.appendChild(container);

        return wrapper;
    }

    save() {
        return this.data;
    }
}
