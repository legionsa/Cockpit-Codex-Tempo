import { API } from '@editorjs/editorjs';

export default class ImageUploadTool {
    private api: API;
    private data: any;

    static get toolbox() {
        return {
            title: 'Upload Image',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>'
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
        container.style.cursor = 'pointer';
        container.style.transition = 'border-color 0.2s';

        container.onmouseover = () => {
            container.style.borderColor = '#94a3b8';
        };
        container.onmouseout = () => {
            container.style.borderColor = '#e2e8f0';
        };

        const iconContainer = document.createElement('div');
        iconContainer.style.display = 'flex';
        iconContainer.style.alignItems = 'center';
        iconContainer.style.justifyContent = 'center';
        iconContainer.style.width = '32px';
        iconContainer.style.height = '32px';
        iconContainer.style.borderRadius = '6px';
        iconContainer.style.background = '#f1f5f9';
        iconContainer.style.color = '#64748b';
        iconContainer.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>';

        const textContainer = document.createElement('div');
        textContainer.style.flex = '1';

        const title = document.createElement('div');
        title.innerText = 'Click to upload an image';
        title.style.fontSize = '14px';
        title.style.fontWeight = '500';
        title.style.color = '#0f172a';

        const subtitle = document.createElement('div');
        subtitle.innerText = 'PNG, JPG, GIF up to 5MB';
        subtitle.style.fontSize = '12px';
        subtitle.style.color = '#64748b';
        subtitle.style.marginTop = '2px';

        textContainer.appendChild(title);
        textContainer.appendChild(subtitle);

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        fileInput.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const result = event.target?.result as string;
                    if (result) {
                        const currentBlockIndex = this.api.blocks.getCurrentBlockIndex();

                        // Insert the standard image block with the data URL
                        this.api.blocks.insert('imageUpload', {
                            file: {
                                url: result
                            },
                            caption: file.name
                        }, {}, currentBlockIndex, true);

                        // Delete this tool's block (which has been pushed down by the insertion)
                        // We use setTimeout to ensure the insertion is complete and indices are updated
                        setTimeout(() => {
                            this.api.blocks.delete(currentBlockIndex + 1);
                        }, 50);
                    }
                };
                reader.readAsDataURL(file);
            }
        };

        container.onclick = () => {
            fileInput.click();
        };

        container.appendChild(iconContainer);
        container.appendChild(textContainer);
        container.appendChild(fileInput);
        wrapper.appendChild(container);

        return wrapper;
    }

    save() {
        return this.data;
    }
}
