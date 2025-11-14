export default class TabsTool {
  static get toolbox() {
    return {
      title: 'Tabs',
      icon: '<svg width="17" height="15" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="7" height="7" fill="currentColor"/><rect x="14" y="3" width="7" height="7" fill="currentColor"/><rect x="3" y="14" width="18" height="7" fill="currentColor"/></svg>'
    };
  }

  static get enableLineBreaks() {
    return true;
  }

  constructor({ data, api, block }: any) {
    this.api = api;
    this.block = block;
    this.data = {
      tabs: data.tabs || [
        { name: 'Tab 1', content: '' },
        { name: 'Tab 2', content: '' }
      ]
    };
    this.wrapper = null;
    this.activeTabIndex = 0;
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
      primaryForeground: isDark ? 'hsl(222.2, 47.4%, 11.2%)' : 'hsl(210, 40%, 98%)',
      accent: isDark ? 'hsl(217.2, 32.6%, 17.5%)' : 'hsl(210, 40%, 96.1%)',
    };
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('tabs-tool-wrapper');
    
    this.updateView();
    
    // Watch for theme changes
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
    `;
    
    // Tab headers
    const tabHeaders = document.createElement('div');
    tabHeaders.style.cssText = 'display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; align-items: center;';
    
    this.data.tabs.forEach((tab: any, index: number) => {
      const tabBtn = document.createElement('button');
      tabBtn.type = 'button';
      const isActive = index === this.activeTabIndex;
      
      tabBtn.style.cssText = `
        padding: 8px 16px;
        border: 1px solid ${isActive ? colors.primary : colors.border};
        background: ${isActive ? colors.primary : colors.background};
        color: ${isActive ? colors.primaryForeground : colors.foreground};
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 8px;
      `;
      
      tabBtn.addEventListener('mouseenter', () => {
        if (!isActive) {
          tabBtn.style.background = colors.accent;
        }
      });
      
      tabBtn.addEventListener('mouseleave', () => {
        if (!isActive) {
          tabBtn.style.background = colors.background;
        }
      });
      
      const nameSpan = document.createElement('span');
      nameSpan.textContent = tab.name;
      nameSpan.contentEditable = 'true';
      nameSpan.style.cssText = 'outline: none; min-width: 40px;';
      nameSpan.addEventListener('blur', (e: any) => {
        this.data.tabs[index].name = e.target.textContent || `Tab ${index + 1}`;
      });
      nameSpan.addEventListener('keydown', (e: any) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          e.target.blur();
        }
      });
      
      tabBtn.appendChild(nameSpan);
      
      if (this.data.tabs.length > 1) {
        const deleteBtn = document.createElement('span');
        deleteBtn.innerHTML = '×';
        deleteBtn.style.cssText = `
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.2s;
        `;
        deleteBtn.addEventListener('mouseenter', () => {
          deleteBtn.style.opacity = '1';
        });
        deleteBtn.addEventListener('mouseleave', () => {
          deleteBtn.style.opacity = '0.7';
        });
        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.data.tabs.splice(index, 1);
          if (this.activeTabIndex >= this.data.tabs.length) {
            this.activeTabIndex = this.data.tabs.length - 1;
          }
          this.updateView();
        });
        tabBtn.appendChild(deleteBtn);
      }
      
      tabBtn.addEventListener('click', (e) => {
        if (e.target === nameSpan) return;
        this.activeTabIndex = index;
        this.updateView();
      });
      
      tabHeaders.appendChild(tabBtn);
    });
    
    // Add tab button
    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.innerHTML = '+ Add Tab';
    addBtn.style.cssText = `
      padding: 8px 16px;
      border: 1px dashed ${colors.border};
      background: ${colors.background};
      color: ${colors.mutedForeground};
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s;
    `;
    addBtn.addEventListener('mouseenter', () => {
      addBtn.style.background = colors.accent;
      addBtn.style.color = colors.foreground;
    });
    addBtn.addEventListener('mouseleave', () => {
      addBtn.style.background = colors.background;
      addBtn.style.color = colors.mutedForeground;
    });
    addBtn.addEventListener('click', () => {
      this.data.tabs.push({ name: `Tab ${this.data.tabs.length + 1}`, content: '' });
      this.activeTabIndex = this.data.tabs.length - 1;
      this.updateView();
    });
    
    tabHeaders.appendChild(addBtn);
    this.wrapper.appendChild(tabHeaders);
    
    // Active tab content
    const contentArea = document.createElement('div');
    contentArea.style.cssText = `
      background: ${colors.background};
      border: 1px solid ${colors.border};
      border-radius: 6px;
      padding: 12px;
    `;
    
    const textarea = document.createElement('textarea');
    textarea.value = this.data.tabs[this.activeTabIndex].content;
    textarea.placeholder = 'Enter content (HTML, text, embed codes, etc.)';
    textarea.style.cssText = `
      width: 100%;
      min-height: 150px;
      border: none;
      outline: none;
      font-family: 'Monaco', 'Menlo', monospace;
      font-size: 13px;
      resize: vertical;
      background: transparent;
      color: ${colors.foreground};
    `;
    textarea.addEventListener('input', (e: any) => {
      this.data.tabs[this.activeTabIndex].content = e.target.value;
    });
    
    contentArea.appendChild(textarea);
    this.wrapper.appendChild(contentArea);
  }

  save() {
    return this.data;
  }

  static get isReadOnlySupported() {
    return true;
  }
}