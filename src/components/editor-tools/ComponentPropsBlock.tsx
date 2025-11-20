/**
 * ComponentPropsBlock - Custom Editor.js block for displaying component props tables
 */

import { PropsTable } from '@/components/component-docs/PropsTable';
import { PropDefinition } from '@/types/page';
import ReactDOM from 'react-dom/client';

export default class ComponentPropsBlock {
    static get toolbox() {
        return {
            title: 'Component Props',
            icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>',
        };
    }

    private api: any;
    private data: { props: PropDefinition[] };
    private wrapper: HTMLElement | undefined;
    private root: any;

    constructor({ data, api }: any) {
        this.api = api;
        this.data = data || { props: [] };
    }

    render() {
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('component-props-block');

        // Render React component
        this.root = ReactDOM.createRoot(this.wrapper);
        this.root.render(<PropsTable props={this.data.props} />);

        return this.wrapper;
    }

    save() {
        return this.data;
    }

    validate(savedData: any) {
        return savedData.props && Array.isArray(savedData.props);
    }

    static get isReadOnlySupported() {
        return true;
    }
}
