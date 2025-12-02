import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Edit, ArrowLeft, ExternalLink, Code, Check } from 'lucide-react';
import { storage } from '@/lib/storage';
import { CustomIcon } from '@/types/page';
import { cn } from '@/lib/utils';

interface Icon {
  name: string;
  category: string;
  svg: string;
}

interface IconLibraryModalProps {
  open: boolean;
  onClose: () => void;
  onSelectIcon: (icon: Icon) => void;
}

export function IconLibraryModal({ open, onClose, onSelectIcon }: IconLibraryModalProps) {
  const [activeTab, setActiveTab] = useState('library');
  const [view, setView] = useState<'grid' | 'add' | 'detail'>('grid');

  // System Icons State
  const [icons, setIcons] = useState<Icon[]>([]);
  const [filteredIcons, setFilteredIcons] = useState<Icon[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [focusedIndex, setFocusedIndex] = useState(0);

  // Custom Icons State
  const [customIcons, setCustomIcons] = useState<CustomIcon[]>([]);
  const [selectedCustomIcon, setSelectedCustomIcon] = useState<CustomIcon | null>(null);
  const [formData, setFormData] = useState<Partial<CustomIcon>>({
    name: '',
    tags: [],
    svg: '',
    reactCode: '',
    figmaLink: '',
    size: 24
  });

  // Load System Icons
  useEffect(() => {
    const cachedIcons = localStorage.getItem('icon-library-cache');
    if (cachedIcons) {
      const parsed = JSON.parse(cachedIcons);
      setIcons(parsed);
      setFilteredIcons(parsed);
      setLoading(false);
    } else {
      fetch('/icons.json')
        .then(res => res.json())
        .then(data => {
          setIcons(data);
          setFilteredIcons(data);
          localStorage.setItem('icon-library-cache', JSON.stringify(data));
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to load icons:', err);
          setLoading(false);
        });
    }
  }, []);

  // Load Custom Icons
  useEffect(() => {
    if (open) {
      setCustomIcons(storage.getCustomIcons());
    }
  }, [open, view]);

  // Filter System Icons
  useEffect(() => {
    let filtered = icons;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(icon => icon.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(icon =>
        icon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        icon.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredIcons(filtered);
    setFocusedIndex(0);
  }, [searchQuery, selectedCategory, icons]);

  const categories = ['all', ...Array.from(new Set(icons.map(icon => icon.category)))];

  const handleSaveCustomIcon = () => {
    if (!formData.name || !formData.svg) return;

    const newIcon: CustomIcon = {
      id: selectedCustomIcon?.id || crypto.randomUUID(),
      name: formData.name,
      svg: formData.svg,
      tags: typeof formData.tags === 'string' ? (formData.tags as string).split(',').map(t => t.trim()) : (formData.tags || []),
      category: 'custom',
      reactCode: formData.reactCode,
      figmaLink: formData.figmaLink,
      size: formData.size || 24,
      createdAt: selectedCustomIcon?.createdAt || Date.now()
    };

    storage.saveCustomIcon(newIcon);
    setCustomIcons(storage.getCustomIcons());
    setView('grid');
    setFormData({ name: '', tags: [], svg: '', reactCode: '', figmaLink: '', size: 24 });
    setSelectedCustomIcon(null);
  };

  const handleDeleteCustomIcon = (id: string) => {
    if (confirm('Are you sure you want to delete this icon?')) {
      storage.deleteCustomIcon(id);
      setCustomIcons(storage.getCustomIcons());
      setView('grid');
      setSelectedCustomIcon(null);
    }
  };

  const renderCustomIconForm = () => (
    <div className="space-y-4 p-1">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" onClick={() => setView('grid')}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <h3 className="text-lg font-semibold">{selectedCustomIcon ? 'Edit Icon' : 'Add New Icon'}</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. My Custom Icon"
            />
          </div>

          <div className="space-y-2">
            <Label>SVG Code</Label>
            <Textarea
              value={formData.svg}
              onChange={e => setFormData({ ...formData, svg: e.target.value })}
              placeholder="<svg...>"
              className="font-mono text-xs h-[150px]"
            />
          </div>

          <div className="space-y-2">
            <Label>React Code (Optional)</Label>
            <Textarea
              value={formData.reactCode}
              onChange={e => setFormData({ ...formData, reactCode: e.target.value })}
              placeholder="import { Icon } from..."
              className="font-mono text-xs"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Preview</Label>
            <div className="border border-border rounded-lg p-8 flex items-center justify-center bg-muted/20 min-h-[150px]">
              {formData.svg ? (
                <div
                  style={{ width: formData.size || 24, height: formData.size || 24 }}
                  dangerouslySetInnerHTML={{ __html: formData.svg }}
                />
              ) : (
                <span className="text-muted-foreground text-sm">No SVG content</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Figma Link (Optional)</Label>
            <Input
              value={formData.figmaLink}
              onChange={e => setFormData({ ...formData, figmaLink: e.target.value })}
              placeholder="https://figma.com/..."
            />
          </div>

          <div className="space-y-2">
            <Label>Tags (comma separated)</Label>
            <Input
              value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags}
              onChange={e => setFormData({ ...formData, tags: e.target.value as any })}
              placeholder="ui, brand, logo"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={() => setView('grid')}>Cancel</Button>
        <Button onClick={handleSaveCustomIcon} disabled={!formData.name || !formData.svg}>
          {selectedCustomIcon ? 'Update Icon' : 'Add Icon'}
        </Button>
      </div>
    </div>
  );

  const renderCustomIconDetail = () => {
    if (!selectedCustomIcon) return null;
    return (
      <div className="space-y-6 p-1">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={() => setView('grid')}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => {
              setFormData(selectedCustomIcon);
              setView('add');
            }}>
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={() => handleDeleteCustomIcon(selectedCustomIcon.id)}>
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
          </div>
        </div>

        <div className="flex gap-8">
          <div className="w-1/3 space-y-4">
            <div className="border border-border rounded-lg p-12 flex items-center justify-center bg-muted/20">
              <div
                style={{ width: selectedCustomIcon.size || 48, height: selectedCustomIcon.size || 48 }}
                dangerouslySetInnerHTML={{ __html: selectedCustomIcon.svg }}
              />
            </div>
            <Button className="w-full" onClick={() => {
              onSelectIcon({
                name: selectedCustomIcon.name,
                category: 'custom',
                svg: selectedCustomIcon.svg
              });
              onClose();
            }}>
              <Check className="h-4 w-4 mr-2" /> Use This Icon
            </Button>
          </div>

          <div className="w-2/3 space-y-6">
            <div>
              <h2 className="text-2xl font-bold">{selectedCustomIcon.name}</h2>
              <div className="flex gap-2 mt-2">
                {selectedCustomIcon.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-muted rounded-full text-xs text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {selectedCustomIcon.reactCode && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Code className="h-4 w-4" /> React Code</Label>
                <div className="bg-muted p-3 rounded-md font-mono text-sm overflow-x-auto">
                  {selectedCustomIcon.reactCode}
                </div>
              </div>
            )}

            {selectedCustomIcon.figmaLink && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><ExternalLink className="h-4 w-4" /> Figma Source</Label>
                <a
                  href={selectedCustomIcon.figmaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline block truncate"
                >
                  {selectedCustomIcon.figmaLink}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Icon Library</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <TabsList className="w-full justify-start mb-4">
            <TabsTrigger value="library">System Library</TabsTrigger>
            <TabsTrigger value="custom">Custom Icons</TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="flex-1 flex flex-col min-h-0 data-[state=inactive]:hidden">
            <div className="flex gap-4 mb-4">
              <Input
                placeholder="Search icons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
                autoFocus
              />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <ScrollArea className="flex-1 border border-border rounded-lg p-4">
              {loading ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Loading icons...
                </div>
              ) : filteredIcons.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No icons found
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {filteredIcons.map((icon, index) => (
                    <button
                      key={`${icon.name}-${index}`}
                      onClick={() => {
                        onSelectIcon(icon);
                        onClose();
                      }}
                      className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-border hover:bg-accent hover:border-primary transition-all"
                      title={icon.name}
                    >
                      <div
                        className="w-8 h-8 text-foreground"
                        dangerouslySetInnerHTML={{ __html: icon.svg }}
                      />
                      <span className="text-xs mt-2 text-center truncate w-full">
                        {icon.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="custom" className="flex-1 flex flex-col min-h-0 data-[state=inactive]:hidden">
            {view === 'grid' && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-muted-foreground">
                    {customIcons.length} custom icons
                  </div>
                  <Button onClick={() => {
                    setFormData({ name: '', tags: [], svg: '', reactCode: '', figmaLink: '', size: 24 });
                    setView('add');
                  }}>
                    <Plus className="h-4 w-4 mr-2" /> Add Icon
                  </Button>
                </div>

                <ScrollArea className="flex-1 border border-border rounded-lg p-4">
                  {customIcons.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
                      <p>No custom icons yet</p>
                      <Button variant="outline" onClick={() => setView('add')}>
                        Create your first icon
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {customIcons.map((icon) => (
                        <button
                          key={icon.id}
                          onClick={() => {
                            setSelectedCustomIcon(icon);
                            setView('detail');
                          }}
                          className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-border hover:bg-accent hover:border-primary transition-all relative group"
                        >
                          <div
                            className="w-8 h-8 text-foreground"
                            dangerouslySetInnerHTML={{ __html: icon.svg }}
                          />
                          <span className="text-xs mt-2 text-center truncate w-full">
                            {icon.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </>
            )}

            {view === 'add' && renderCustomIconForm()}
            {view === 'detail' && renderCustomIconDetail()}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
