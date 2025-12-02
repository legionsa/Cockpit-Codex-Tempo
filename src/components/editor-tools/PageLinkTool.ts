export default class PageLinkTool {
    static get toolbox() {
        return {
            title: 'Page Link',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        };
    }

    static get enableLineBreaks() {
        return false;
    }

    api: any;
    block: any;
    data: {
        pageId: string;
        title: string;
        slug: string;
        summary?: string;
        style: 'vertical' | 'horizontal' | 'minimal';
    };
    wrapper: HTMLElement | null;

    constructor({ data, api, block }: any) {
        this.api = api;
        this.block = block;
        this.data = {
            pageId: data.pageId || '',
            title: data.title || '',
            slug: data.slug || '',
            summary: data.summary || '',
            style: data.style || 'horizontal'
        };
        this.wrapper = null;
    }

    getThemeColors() {
        const isDark = document.documentElement.classList.contains('dark');
        return {
            background: isDark ? 'hsl(222.2, 84%, 4.9%)' : 'hsl(0, 0%, 100%)',
            foreground: isDark ? 'hsl(210, 40%, 98%)' : 'hsl(222.2, 84%, 4.9%)',
            muted: isDark ? 'hsl(217.2, 32.6%, 17.5%)' : 'hsl(210, 40%, 96.1%)',
            mutedForeground: isDark ? 'hsl(215, 20.2%, 65.1%)' : 'hsl(215.4, 16.3%, 46.9%)',
            border: isDark ? 'hsl(217.2, 32.6%, 17.5%)' : 'hsl(214.3, 31.8%, 91.4%)',
            accent: isDark ? 'hsl(217.2, 32.6%, 17.5%)' : 'hsl(210, 40%, 96.1%)',
        };
    }

    render() {
        this.wrapper = document.createElement('div');
        this.updateView();

        const observer = new MutationObserver(() => {
            this.updateView();
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return this.wrapper;
    }

    updateView() {
        if (!this.wrapper) return;

        const colors = this.getThemeColors();
        this.wrapper.innerHTML = '';

        if (!this.data.pageId) {
            // Empty state - Select Page button
            this.wrapper.style.cssText = `
        padding: 16px;
        border: 2px dashed ${colors.border};
        border-radius: 8px;
        background: ${colors.background};
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
      `;

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.innerHTML = `
        <span style="display: flex; align-items: center; gap: 8px; font-weight: 500; color: ${colors.foreground};">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Link to Page
        </span>
      `;
            btn.style.cssText = `
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
      `;

            this.wrapper.addEventListener('click', () => this.openPageSelector());
            this.wrapper.appendChild(btn);

        } else {
            // Selected state - Preview card
            this.wrapper.style.cssText = `
        border: 1px solid ${colors.border};
        border-radius: 8px;
        background: ${colors.background};
        overflow: hidden;
        position: relative;
        transition: all 0.2s;
      `;

            // Style selector
            const styleSelector = document.createElement('div');
            styleSelector.style.cssText = `
        position: absolute;
        top: 8px;
        right: 8px;
        display: flex;
        gap: 4px;
        background: ${colors.background};
        padding: 4px;
        border-radius: 6px;
        border: 1px solid ${colors.border};
        z-index: 10;
        opacity: 0;
        transition: opacity 0.2s;
      `;
            this.wrapper.addEventListener('mouseenter', () => { styleSelector.style.opacity = '1'; });
            this.wrapper.addEventListener('mouseleave', () => { styleSelector.style.opacity = '0'; });

            ['vertical', 'horizontal', 'minimal'].forEach(style => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.title = style.charAt(0).toUpperCase() + style.slice(1);
                btn.innerHTML = this.getStyleIcon(style);
                btn.style.cssText = `
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: ${this.data.style === style ? colors.accent : 'transparent'};
          color: ${colors.foreground};
          border-radius: 4px;
          cursor: pointer;
        `;
                btn.onclick = (e) => {
                    e.stopPropagation();
                    this.data.style = style as any;
                    this.updateView();
                };
                styleSelector.appendChild(btn);
            });

            // Change page button
            const changeBtn = document.createElement('button');
            changeBtn.type = 'button';
            changeBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>';
            changeBtn.style.cssText = `
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        background: transparent;
        color: ${colors.foreground};
        border-radius: 4px;
        cursor: pointer;
        margin-left: 4px;
        border-left: 1px solid ${colors.border};
        padding-left: 8px;
      `;
            changeBtn.onclick = (e) => {
                e.stopPropagation();
                this.openPageSelector();
            };
            styleSelector.appendChild(changeBtn);

            this.wrapper.appendChild(styleSelector);

            // Render content based on style
            const content = document.createElement('div');

            if (this.data.style === 'vertical') {
                content.style.cssText = `
          display: flex;
          flex-direction: column;
        `;
                // Placeholder image area
                const img = document.createElement('div');
                img.style.cssText = `
          height: 160px;
          background: ${colors.muted};
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${colors.mutedForeground};
          font-size: 24px;
        `;
                img.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
                content.appendChild(img);

                const text = document.createElement('div');
                text.style.cssText = `padding: 16px;`;
                text.innerHTML = `
          <div style="font-weight: 600; font-size: 16px; color: ${colors.foreground}; margin-bottom: 4px;">${this.data.title}</div>
          <div style="font-size: 14px; color: ${colors.mutedForeground}; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${this.data.summary || 'No description'}</div>
        `;
                content.appendChild(text);

            } else if (this.data.style === 'horizontal') {
                content.style.cssText = `
          display: flex;
          height: 100px;
        `;
                const img = document.createElement('div');
                img.style.cssText = `
          width: 100px;
          background: ${colors.muted};
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${colors.mutedForeground};
          border-right: 1px solid ${colors.border};
        `;
                img.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
                content.appendChild(img);

                const text = document.createElement('div');
                text.style.cssText = `padding: 16px; flex: 1; min-width: 0;`;
                text.innerHTML = `
          <div style="font-weight: 600; font-size: 16px; color: ${colors.foreground}; margin-bottom: 4px;">${this.data.title}</div>
          <div style="font-size: 14px; color: ${colors.mutedForeground}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${this.data.summary || 'No description'}</div>
        `;
                content.appendChild(text);

            } else { // minimal
                content.style.cssText = `
          display: flex;
          align-items: center;
          padding: 12px 16px;
          gap: 12px;
        `;
                content.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; color: ${colors.mutedForeground};">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </div>
          <div style="flex: 1; min-width: 0;">
            <div style="font-weight: 500; font-size: 14px; color: ${colors.foreground};">${this.data.title}</div>
            <div style="font-size: 12px; color: ${colors.mutedForeground};">/${this.data.slug}</div>
          </div>
        `;
            }

            this.wrapper.appendChild(content);
        }
    }

    getStyleIcon(style: string) {
        if (style === 'vertical') return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>';
        if (style === 'horizontal') return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"/><line x1="10" y1="6" x2="10" y2="18"/></svg>';
        return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="8" width="20" height="8" rx="2"/></svg>';
    }

    openPageSelector() {
        const event = new CustomEvent('openPageSelector', {
            detail: {
                callback: (page: any) => {
                    this.data = {
                        ...this.data,
                        pageId: page.id,
                        title: page.title,
                        slug: page.slug,
                        summary: page.summary || ''
                    };
                    this.updateView();
                }
            },
            bubbles: true
        });
        window.dispatchEvent(event);
    }

    save() {
        return this.data;
    }

    static get isReadOnlySupported() {
        return true;
    }
}
