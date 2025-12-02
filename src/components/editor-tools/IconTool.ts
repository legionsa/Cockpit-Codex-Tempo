export default class IconTool {
  static get toolbox() {
    return {
      title: 'Icon',
      icon: '<svg width="17" height="15" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" fill="none"/></svg>'
    };
  }

  static get enableLineBreaks() {
    return true;
  }

  api: any;
  block: any;
  data: {
    name: string;
    category: string;
    svg: string;
    size: number;
    color: string;
  };
  wrapper: HTMLElement | null;

  constructor({ data, api, block }: any) {
    this.api = api;
    this.block = block;
    this.data = {
      name: data.name || '',
      category: data.category || '',
      svg: data.svg || '',
      size: data.size || 24,
      color: data.color || 'currentColor'
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
      primary: isDark ? 'hsl(210, 40%, 98%)' : 'hsl(222.2, 47.4%, 11.2%)',
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
    const colors = this.getThemeColors();
    this.wrapper.innerHTML = '';
    this.wrapper.style.cssText = `
      border: 1px solid ${colors.border};
      border-radius: 8px;
      padding: 16px;
      margin: 8px 0;
      background: ${colors.muted};
      display: flex;
      align-items: center;
      gap: 16px;
    `;

    if (this.data.svg) {
      const iconPreview = document.createElement('div');
      iconPreview.style.cssText = `
        width: ${this.data.size}px;
        height: ${this.data.size}px;
        color: ${this.data.color};
        flex-shrink: 0;
      `;
      iconPreview.innerHTML = this.data.svg;
      this.wrapper.appendChild(iconPreview);

      const info = document.createElement('div');
      info.style.cssText = `
        flex: 1;
        color: ${colors.foreground};
      `;
      info.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 4px;">${this.data.name}</div>
        <div style="font-size: 12px; color: ${colors.mutedForeground};">
          Category: ${this.data.category} • Size: ${this.data.size}px
        </div>
      `;
      this.wrapper.appendChild(info);

      const changeBtn = document.createElement('button');
      changeBtn.type = 'button';
      changeBtn.textContent = 'Change Icon';
      changeBtn.style.cssText = `
        padding: 8px 16px;
        border: 1px solid ${colors.border};
        background: ${colors.background};
        color: ${colors.foreground};
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s;
      `;
      changeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.openIconLibrary();
      });
      this.wrapper.appendChild(changeBtn);
    } else {
      const selectBtn = document.createElement('button');
      selectBtn.type = 'button';
      selectBtn.textContent = '+ Select Icon';
      selectBtn.style.cssText = `
        width: 100%;
        padding: 16px;
        border: 2px dashed ${colors.border};
        background: ${colors.background};
        color: ${colors.foreground};
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s;
      `;
      selectBtn.addEventListener('mouseenter', () => {
        selectBtn.style.background = colors.muted;
      });
      selectBtn.addEventListener('mouseleave', () => {
        selectBtn.style.background = colors.background;
      });
      selectBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.openIconLibrary();
      });
      this.wrapper.appendChild(selectBtn);
    }
  }

  openIconLibrary() {
    console.log('Opening icon library...');
    const event = new CustomEvent('openIconLibrary', {
      detail: {
        callback: (icon: any) => {
          console.log('Icon selected:', icon);
          this.data = {
            ...this.data,
            name: icon.name,
            category: icon.category,
            svg: icon.svg
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