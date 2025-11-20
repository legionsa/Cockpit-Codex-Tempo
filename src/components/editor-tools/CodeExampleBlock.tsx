/**
 * CodeExampleBlock - Custom Editor.js block for code examples with syntax highlighting
 */

import { ComponentPreview } from '@/components/component-docs/ComponentPreview';
import { CodeExample } from '@/types/page';
import ReactDOM from 'react-dom/client';

export default class CodeExampleBlock {
    static get toolbox() {
        return {
            title: 'Code Examples',
            icon: '<svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><path d="M3.177 6.852c.205.253.205.657 0 .91L1.34 9.782c-.227.253-.227.658 0 .91l1.837 2.02c.205.253.205.657 0 .91-.203.253-.53.253-.733 0L.209 11.444c-.227-.253-.227-.658 0-.91l1.837-2.02c.205-.253.205-.657 0-.91L.209 5.583c-.227-.253-.227-.658 0-.91L2.446 2.65c.203-.252.53-.252.733 0 .205.253.205.657 0 .91L1.34 5.583c-.227.253-.227.658 0 .91l1.837 2.02zm7.646-6c.205.252.205.656 0 .909L8.986 3.78c-.227.253-.227.658 0 .91l1.837 2.02c.205.253.205.657 0 .91-.203.253-.53.253-.733 0L8.253 5.6c-.227-.253-.227-.658 0-.91L10.09 2.67c.205-.253.205-.657 0-.91L8.253.65c-.227-.252-.227-.657 0-.91.203-.252.53-.252.733 0L10.823.76c.227.253.227.658 0 .91z"/></svg>',
        };
    }

    private api: any;
    private data: { examples: CodeExample[]; importPath?: string };
    private wrapper: HTMLElement | undefined;
    private root: any;

    constructor({ data, api }: any) {
        this.api = api;
        this.data = data || { examples: [], importPath: '' };
    }

    render() {
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('code-example-block');

        // Render React component
        this.root = ReactDOM.createRoot(this.wrapper);
        this.root.render(
            <ComponentPreview
                examples={this.data.examples}
                importPath={this.data.importPath}
            />
        );

        return this.wrapper;
    }

    save() {
        return this.data;
    }

    validate(savedData: any) {
        return savedData.examples && Array.isArray(savedData.examples);
    }

    static get isReadOnlySupported() {
        return true;
    }
}
