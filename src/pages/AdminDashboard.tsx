import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/lib/settingsContext';
import { storage } from '@/lib/storage';
import { Page, PageTreeNode } from '@/types/page';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { hashPassword } from '@/lib/passwordUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Plus, Save, Trash2, Eye, FolderPlus, Settings, ArrowUpDown } from 'lucide-react';
import { NavTree } from '@/components/NavTree';
import { PageEditor } from '@/components/PageEditor';
import { TabEditor } from '@/components/TabEditor';
import { PageHero } from '@/components/PageHero';
import { NavigationCards } from '@/components/NavigationCards';
import { Badge } from '@/components/ui/badge';
import { IconPicker } from '@/components/IconPicker';
import { useToast } from '@/components/ui/use-toast';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';


const MAX_NESTING_DEPTH = 3;

export function AdminDashboard() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const { settings } = useSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [editorTab, setEditorTab] = useState('content'); // For page editor Content/Settings tabs
  const [pageToDelete, setPageToDelete] = useState<string | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Handle reordering
    const sourceParentId = source.droppableId === 'root' ? null : source.droppableId.replace('droppable-', '');
    const destParentId = destination.droppableId === 'root' ? null : destination.droppableId.replace('droppable-', '');

    // Get all pages
    const allPages = storage.getPages();

    // Find the moved page
    const movedPage = allPages.find(p => p.id === draggableId);
    if (!movedPage) return;

    // Get siblings in destination
    const destSiblings = allPages
      .filter(p => p.parentId === destParentId && p.id !== draggableId)
      .sort((a, b) => a.order - b.order);

    // Insert moved page into new position
    destSiblings.splice(destination.index, 0, movedPage);

    // Update parentId and order for all affected pages
    const updatedPages = allPages.map(p => {
      if (p.id === draggableId) {
        return { ...p, parentId: destParentId };
      }
      return p;
    });

    // Re-assign order based on new index in destSiblings
    destSiblings.forEach((p, index) => {
      const pageToUpdate = updatedPages.find(up => up.id === p.id);
      if (pageToUpdate) {
        pageToUpdate.order = index;
      }
    });

    // Save all updates
    updatedPages.forEach(p => storage.savePage(p));
    loadPages();
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admindash/login');
      return;
    }
    loadPages();
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    console.log('[AdminDashboard] Settings loaded:', settings);
    console.log('[AdminDashboard] Brand icon SVG length:', settings.brandIconSvg?.length || 0);
  }, [settings]);

  useEffect(() => {
    if (location.state?.pageId) {
      const page = storage.getPageById(location.state.pageId);
      if (page) {
        setSelectedPage(page);
        setIsEditing(true);
      }
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Reset editor tab to 'content' when page selection changes
  useEffect(() => {
    if (selectedPage) {
      setEditorTab('content');
    }
  }, [selectedPage?.id]);

  const loadPages = () => {
    setPages(storage.getPages());
  };

  const handleLogout = () => {
    logout();
    navigate('/admindash/login');
  };

  const handleCreatePage = (parentId: string | null = null) => {
    if (parentId) {
      const depth = storage.getPageDepth(parentId);
      if (depth >= MAX_NESTING_DEPTH) {
        toast({
          title: 'Maximum nesting reached',
          description: `Cannot create pages deeper than ${MAX_NESTING_DEPTH + 1} levels.`,
          variant: 'destructive'
        });
        return;
      }
    }

    const siblings = storage.getChildPages(parentId);
    const newPage: Page = {
      id: Date.now().toString(),
      title: 'New Page',
      slug: `page-${Date.now()}`,
      parentId,
      order: Date.now(),
      tags: [],
      summary: '',
      content: {
        time: Date.now(),
        blocks: [],
        version: '2.29.0'
      },
      status: 'Draft',
      version: '1.0.0',
      lastUpdated: new Date().toISOString()
    };

    storage.savePage(newPage);
    loadPages();
    setSelectedPage(newPage);
    setIsEditing(true);
    toast({
      title: 'Page created',
      description: 'New page has been created successfully.'
    });
  };

  const handleViewModeChange = (viewMode: 'default' | 'tabbed') => {
    if (!selectedPage) return;

    if (viewMode === 'tabbed' && (!selectedPage.tabs || selectedPage.tabs.length === 0)) {
      // Create default tab with current content
      setSelectedPage({
        ...selectedPage,
        viewMode,
        tabs: [
          {
            id: 'overview',
            label: 'Overview',
            content: selectedPage.content
          }
        ]
      });
    } else if (viewMode === 'default') {
      // Keep tabs but switch to default view
      setSelectedPage({
        ...selectedPage,
        viewMode
      });
    } else {
      setSelectedPage({
        ...selectedPage,
        viewMode
      });
    }
  };

  const handleSavePage = () => {
    if (!selectedPage) return;

    storage.savePage({
      ...selectedPage,
      lastUpdated: new Date().toISOString()
    });

    loadPages();
    toast({
      title: 'Page saved',
      description: 'Your changes have been saved successfully.'
    });
    setIsEditing(false);
  };

  const handleDeletePage = (pageId: string) => {
    setPageToDelete(pageId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (pageToDelete) {
      storage.deletePage(pageToDelete);
      loadPages();
      if (selectedPage?.id === pageToDelete) {
        setSelectedPage(null);
      }
      toast({
        title: 'Page deleted',
        description: 'The page and its children have been deleted successfully.'
      });
    }
    setShowDeleteDialog(false);
    setPageToDelete(null);
  };

  const handlePreview = () => {
    if (selectedPage) {
      const breadcrumbs = storage.getBreadcrumbs(selectedPage.id);
      const path = '/' + breadcrumbs.map(p => p.slug).join('/');
      window.open(path, '_blank');
    }
  };

  const handleSelectPage = (pageId: string) => {
    const page = storage.getPageById(pageId);
    if (page) {
      setSelectedPage(page);
      setIsEditing(false);
    }
  };

  const canAddChild = selectedPage ? storage.getPageDepth(selectedPage.id) < MAX_NESTING_DEPTH : false;
  const pageTree = storage.buildPageTree();

  return (
    <div className="min-h-screen bg-background">
      {/* ... header ... */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* ... brand ... */}
            {settings.brandIconSvg && (
              <div
                className="w-6 h-6 flex-shrink-0 [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
                style={{ width: '24px', height: '24px' }}
                dangerouslySetInnerHTML={{ __html: settings.brandIconSvg }}
              />
            )}
            <h1 className="text-2xl font-bold">{settings.dashboardTitle || 'Admin Dashboard'}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePreview} disabled={!selectedPage}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/admindash/settings')}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Pages</CardTitle>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant={isReordering ? "secondary" : "ghost"}
                      onClick={() => setIsReordering(!isReordering)}
                      title="Reorder Pages"
                    >
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                    <Button size="sm" onClick={() => handleCreatePage(null)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <DragDropContext onDragEnd={onDragEnd}>
                  <NavTree
                    nodes={pageTree}
                    onSelectPage={handleSelectPage}
                    isEditable={isReordering}
                  />
                </DragDropContext>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-9">
            {selectedPage ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{isEditing ? 'Edit Page' : selectedPage.title}</CardTitle>
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <Button size="sm" onClick={handleSavePage}>
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => {
                            // Reload page from storage to discard changes
                            const freshPage = storage.getPageById(selectedPage.id);
                            if (freshPage) {
                              setSelectedPage(freshPage);
                            }
                            setIsEditing(false);
                          }}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCreatePage(selectedPage.id)}
                            disabled={!canAddChild}
                            title={!canAddChild ? 'Maximum nesting depth reached' : 'Add child page'}
                          >
                            <FolderPlus className="h-4 w-4 mr-2" />
                            Add Child
                          </Button>
                          <Button size="sm" onClick={() => setIsEditing(true)}>
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeletePage(selectedPage.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs key={selectedPage.id} value={editorTab} onValueChange={setEditorTab} className="w-full">
                    <TabsList>
                      <TabsTrigger value="content">Content</TabsTrigger>
                      <TabsTrigger value="layout">Layout</TabsTrigger>
                      {selectedPage.layout === 'component' && (
                        <TabsTrigger value="component-data">Component Data</TabsTrigger>
                      )}
                      {selectedPage.layout === 'iconGallery' && (
                        <TabsTrigger value="icon-data">Icon Data</TabsTrigger>
                      )}
                      <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="content" className="space-y-6">
                      {selectedPage.layout && selectedPage.layout !== 'default' && (
                        <div className="bg-muted/50 px-4 py-2 rounded-md flex items-center gap-2 text-sm text-muted-foreground border border-border/50">
                          <span className="font-medium text-foreground">Current Layout:</span>
                          <span className="capitalize">{selectedPage.layout.replace(/([A-Z])/g, ' $1').trim()}</span>
                        </div>
                      )}

                      {/* Hero Section Preview & Editor */}
                      {['landing', 'atlassian', 'fullWidth', 'article', 'cardGrid'].includes(selectedPage.layout || '') && (
                        <div className="space-y-4 border rounded-lg p-4 bg-card/50">
                          <div className="flex items-center justify-between">
                            <Label className="text-base font-medium">Hero Section</Label>
                            <Badge variant="outline">Preview</Badge>
                          </div>

                          <div className="border rounded-md overflow-hidden bg-background">
                            <PageHero page={selectedPage} preview />
                          </div>

                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="hero-editor" className="border-none">
                              <AccordionTrigger className="py-2 text-sm text-muted-foreground">Edit Hero Settings</AccordionTrigger>
                              <AccordionContent className="pt-4 space-y-4">
                                <div className="space-y-2">
                                  <Label>Hero Title</Label>
                                  <Input
                                    placeholder="Override page title..."
                                    value={selectedPage.hero?.title || ''}
                                    onChange={(e) => setSelectedPage({
                                      ...selectedPage,
                                      hero: { ...selectedPage.hero, title: e.target.value }
                                    })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Hero Subtitle</Label>
                                  <Textarea
                                    placeholder="Override page summary..."
                                    value={selectedPage.hero?.subtitle || ''}
                                    onChange={(e) => setSelectedPage({
                                      ...selectedPage,
                                      hero: { ...selectedPage.hero, subtitle: e.target.value }
                                    })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Background Image URL</Label>
                                  <Input
                                    placeholder="https://..."
                                    value={selectedPage.hero?.backgroundImage || ''}
                                    onChange={(e) => setSelectedPage({
                                      ...selectedPage,
                                      hero: { ...selectedPage.hero, backgroundImage: e.target.value }
                                    })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Background Color</Label>
                                  <Input
                                    placeholder="#1e40af or rgb(30, 64, 175)"
                                    value={selectedPage.hero?.backgroundColor || ''}
                                    onChange={(e) => setSelectedPage({
                                      ...selectedPage,
                                      hero: { ...selectedPage.hero, backgroundColor: e.target.value }
                                    })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Text Color</Label>
                                  <Select
                                    value={selectedPage.hero?.textColor || 'light'}
                                    onValueChange={(value: any) => setSelectedPage({
                                      ...selectedPage,
                                      hero: { ...selectedPage.hero, textColor: value }
                                    })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="light">Light (for dark backgrounds)</SelectItem>
                                      <SelectItem value="dark">Dark (for light backgrounds)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Primary CTA Text</Label>
                                    <Input
                                      placeholder="Get Started"
                                      value={selectedPage.hero?.primaryCta?.text || ''}
                                      onChange={(e) => setSelectedPage({
                                        ...selectedPage,
                                        hero: {
                                          ...selectedPage.hero,
                                          primaryCta: { ...selectedPage.hero?.primaryCta, text: e.target.value, link: selectedPage.hero?.primaryCta?.link || '' }
                                        }
                                      })}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Primary CTA Link</Label>
                                    <Input
                                      placeholder="/getting-started"
                                      value={selectedPage.hero?.primaryCta?.link || ''}
                                      onChange={(e) => setSelectedPage({
                                        ...selectedPage,
                                        hero: {
                                          ...selectedPage.hero,
                                          primaryCta: { ...selectedPage.hero?.primaryCta, link: e.target.value, text: selectedPage.hero?.primaryCta?.text || '' }
                                        }
                                      })}
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Secondary CTA Text</Label>
                                    <Input
                                      placeholder="View Components"
                                      value={selectedPage.hero?.secondaryCta?.text || ''}
                                      onChange={(e) => setSelectedPage({
                                        ...selectedPage,
                                        hero: {
                                          ...selectedPage.hero,
                                          secondaryCta: { ...selectedPage.hero?.secondaryCta, text: e.target.value, link: selectedPage.hero?.secondaryCta?.link || '' }
                                        }
                                      })}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Secondary CTA Link</Label>
                                    <Input
                                      placeholder="/components"
                                      value={selectedPage.hero?.secondaryCta?.link || ''}
                                      onChange={(e) => setSelectedPage({
                                        ...selectedPage,
                                        hero: {
                                          ...selectedPage.hero,
                                          secondaryCta: { ...selectedPage.hero?.secondaryCta, link: e.target.value, text: selectedPage.hero?.secondaryCta?.text || '' }
                                        }
                                      })}
                                    />
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>
                      )}

                      {/* Navigation Cards Preview & Editor */}
                      {['landing', 'cardGrid'].includes(selectedPage.layout || '') && (
                        <div className="space-y-4 border rounded-lg p-4 bg-card/50">
                          <div className="flex items-center justify-between">
                            <Label className="text-base font-medium">Navigation Cards</Label>
                            <Badge variant="outline">Preview</Badge>
                          </div>

                          <div className="border rounded-md overflow-hidden bg-background">
                            <NavigationCards page={selectedPage} preview />
                          </div>

                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="cards-editor" className="border-none">
                              <AccordionTrigger className="py-2 text-sm text-muted-foreground">Edit Navigation Cards</AccordionTrigger>
                              <AccordionContent className="pt-4 space-y-4">
                                <div className="flex items-center justify-between">
                                  <Label>Cards</Label>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      const currentCards = selectedPage.navigationCards || [];
                                      setSelectedPage({
                                        ...selectedPage,
                                        navigationCards: [...currentCards, { title: 'New Card', description: '', link: '' }]
                                      });
                                    }}
                                  >
                                    <Plus className="w-4 h-4 mr-2" /> Add Card
                                  </Button>
                                </div>
                                <div className="space-y-4">
                                  {(selectedPage.navigationCards || []).map((card, index) => (
                                    <Card key={index}>
                                      <CardContent className="p-4 space-y-4">
                                        <div className="flex justify-between items-start">
                                          <div className="flex-1 space-y-4">
                                            <div className="space-y-2">
                                              <Label>Title</Label>
                                              <Input
                                                value={card.title}
                                                onChange={(e) => {
                                                  const newCards = [...(selectedPage.navigationCards || [])];
                                                  newCards[index] = { ...card, title: e.target.value };
                                                  setSelectedPage({ ...selectedPage, navigationCards: newCards });
                                                }}
                                              />
                                            </div>
                                            <div className="space-y-2">
                                              <Label>Description</Label>
                                              <Input
                                                value={card.description}
                                                onChange={(e) => {
                                                  const newCards = [...(selectedPage.navigationCards || [])];
                                                  newCards[index] = { ...card, description: e.target.value };
                                                  setSelectedPage({ ...selectedPage, navigationCards: newCards });
                                                }}
                                              />
                                            </div>
                                            <div className="space-y-2">
                                              <Label>Link</Label>
                                              <Input
                                                value={card.link}
                                                onChange={(e) => {
                                                  const newCards = [...(selectedPage.navigationCards || [])];
                                                  newCards[index] = { ...card, link: e.target.value };
                                                  setSelectedPage({ ...selectedPage, navigationCards: newCards });
                                                }}
                                              />
                                            </div>
                                          </div>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive ml-2"
                                            onClick={() => {
                                              const newCards = [...(selectedPage.navigationCards || [])];
                                              newCards.splice(index, 1);
                                              setSelectedPage({ ...selectedPage, navigationCards: newCards });
                                            }}
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </Button>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                  {(selectedPage.navigationCards?.length === 0) && (
                                    <div className="text-center py-4 text-muted-foreground text-sm">
                                      No navigation cards added.
                                    </div>
                                  )}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>
                      )}

                      <div className="space-y-2 relative">
                        <Label className="text-base font-medium">Page Content</Label>
                        <div className="mb-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                          💡 <strong>Tip:</strong> Use the Tabs tool in the editor to embed tabbed content within your page (like Examples, Code, Usage sections).
                        </div>
                        {selectedPage.viewMode === 'tabbed' ? (
                          <TabEditor
                            tabs={selectedPage.tabs || []}
                            activeTabId={activeTab}
                            onTabsChange={(tabs) => setSelectedPage({ ...selectedPage, tabs })}
                            onActiveTabChange={setActiveTab}
                            isEditing={isEditing}
                          />
                        ) : (
                          <PageEditor
                            key={selectedPage.id}
                            content={selectedPage.content}
                            onChange={(content) => setSelectedPage({ ...selectedPage, content })}
                            readOnly={!isEditing}
                          />
                        )}

                      </div>
                    </TabsContent>

                    <TabsContent value="settings" className="mt-4 relative">
                      {!isEditing && (
                        <div
                          className="absolute inset-0 z-10 cursor-not-allowed bg-transparent"
                          onClick={() => {
                            toast({
                              title: "Editing Disabled",
                              description: "Please click 'Edit' to make changes to the settings.",
                              variant: "destructive",
                            });
                          }}
                        />
                      )}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={selectedPage.title}
                            onChange={(e) => setSelectedPage({ ...selectedPage, title: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Slug</Label>
                          <Input
                            value={selectedPage.slug}
                            onChange={(e) => setSelectedPage({ ...selectedPage, slug: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Parent Page</Label>
                          <Select
                            value={selectedPage.parentId || 'root'}
                            onValueChange={(value) => {
                              const newParentId = value === 'root' ? null : value;
                              setSelectedPage({ ...selectedPage, parentId: newParentId });
                            }}
                            disabled={!isEditing}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="root">Root Level</SelectItem>
                              {pages
                                .filter(p => p.id !== selectedPage.id && storage.getPageDepth(p.id) < MAX_NESTING_DEPTH)
                                .map(p => (
                                  <SelectItem key={p.id} value={p.id}>
                                    {p.title}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Summary</Label>
                          <Textarea
                            value={selectedPage.summary}
                            onChange={(e) => setSelectedPage({ ...selectedPage, summary: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Status</Label>
                          <Select
                            value={selectedPage.status}
                            onValueChange={(value: any) => setSelectedPage({ ...selectedPage, status: value })}
                            disabled={!isEditing}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Draft">Draft</SelectItem>
                              <SelectItem value="Published">Published</SelectItem>
                              <SelectItem value="Archived">Archived</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Tags (comma-separated)</Label>
                          <Input
                            value={selectedPage.tags.join(', ')}
                            onChange={(e) => setSelectedPage({
                              ...selectedPage,
                              tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                            })}
                            disabled={!isEditing}
                          />
                        </div>

                        {/* Password Protection */}
                        <div className="space-y-4 pt-4 border-t">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="passwordProtected"
                                checked={selectedPage.passwordProtected || false}
                                onChange={(e) => {
                                  setSelectedPage({
                                    ...selectedPage,
                                    passwordProtected: e.target.checked,
                                    passwordHash: e.target.checked ? selectedPage.passwordHash : undefined,
                                    passwordHint: e.target.checked ? selectedPage.passwordHint : undefined
                                  });
                                }}
                                disabled={!isEditing}
                                className="h-4 w-4"
                              />
                              <Label htmlFor="passwordProtected" className="font-medium cursor-pointer">
                                Password protect this page
                              </Label>
                            </div>
                            <p className="text-sm text-muted-foreground ml-6">
                              Require a password to view this page (even from public view)
                            </p>
                          </div>

                          {selectedPage.passwordProtected && (
                            <>
                              <div className="space-y-2 ml-6">
                                <Label>Password</Label>
                                <Input
                                  type="password"
                                  placeholder="Enter password"
                                  onChange={async (e) => {
                                    if (e.target.value) {
                                      const hash = await hashPassword(e.target.value);
                                      setSelectedPage({ ...selectedPage, passwordHash: hash });
                                    }
                                  }}
                                  disabled={!isEditing}
                                />
                                <p className="text-xs text-muted-foreground">
                                  Password will be encrypted before saving
                                </p>
                              </div>
                              <div className="space-y-2 ml-6">
                                <Label>Password Hint (optional)</Label>
                                <Input
                                  value={selectedPage.passwordHint || ''}
                                  onChange={(e) => setSelectedPage({ ...selectedPage, passwordHint: e.target.value })}
                                  placeholder="Enter a hint to help users remember the password"
                                />
                              </div>
                            </>
                          )}
                        </div>

                        {/* Visibility & Role-Based Access */}
                        <div className="space-y-4 pt-4 border-t">
                          <div className="space-y-2">
                            <Label className="font-medium">Page Visibility</Label>
                            <p className="text-sm text-muted-foreground">
                              Control who can access this page
                            </p>
                            <div className="space-y-3 mt-3">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  id="visibility-public"
                                  name="visibility"
                                  checked={(selectedPage.visibility || 'public') === 'public'}
                                  onChange={() => setSelectedPage({ ...selectedPage, visibility: 'public', requiredRole: undefined })}
                                  disabled={!isEditing}
                                  className="h-4 w-4"
                                />
                                <Label htmlFor="visibility-public" className="cursor-pointer font-normal">
                                  Public - Anyone can view
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  id="visibility-authenticated"
                                  name="visibility"
                                  checked={selectedPage.visibility === 'authenticated'}
                                  onChange={() => setSelectedPage({ ...selectedPage, visibility: 'authenticated', requiredRole: undefined })}
                                  disabled={!isEditing}
                                  className="h-4 w-4"
                                />
                                <Label htmlFor="visibility-authenticated" className="cursor-pointer font-normal">
                                  Authenticated - Requires login
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  id="visibility-role-restricted"
                                  name="visibility"
                                  checked={selectedPage.visibility === 'role-restricted'}
                                  onChange={() => setSelectedPage({ ...selectedPage, visibility: 'role-restricted', requiredRole: 'viewer' })}
                                  disabled={!isEditing}
                                  className="h-4 w-4"
                                />
                                <Label htmlFor="visibility-role-restricted" className="cursor-pointer font-normal">
                                  Role-Restricted - Requires specific role
                                </Label>
                              </div>
                            </div>

                            {selectedPage.visibility === 'role-restricted' && (
                              <div className="space-y-2 ml-6 mt-3">
                                <Label>Required Role (minimum)</Label>
                                <Select
                                  value={selectedPage.requiredRole || 'viewer'}
                                  onValueChange={(value: any) => setSelectedPage({ ...selectedPage, requiredRole: value })}
                                  disabled={!isEditing}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="viewer">Viewer (lowest)</SelectItem>
                                    <SelectItem value="editor">Editor</SelectItem>
                                    <SelectItem value="admin">Admin (highest)</SelectItem>
                                  </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                  Users with this role or higher can view this page
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="layout" className="mt-4 space-y-6">
                      <div className="space-y-4">
                        <Label className="text-base">Page Layout</Label>
                        <div className="grid grid-cols-3 gap-4">
                          {[
                            { id: 'default', label: 'Default', desc: 'Standard documentation page with sidebar navigation' },
                            { id: 'landing', label: 'Landing Page', desc: 'Hero section with card grid - like Atlassian home' },
                            { id: 'cardGrid', label: 'Card Grid', desc: 'Category page with card navigation' },
                            { id: 'fullWidth', label: 'Full Width', desc: 'Full width content without sidebar' },
                            { id: 'article', label: 'Article', desc: 'Narrow, centered content for blog posts' },
                            { id: 'component', label: 'Component', desc: 'Component showcase with tags and examples' },
                            { id: 'atlassian', label: 'Atlassian', desc: 'Sidebar + Topbar layout' },
                            { id: 'iconGallery', label: 'Icon Gallery', desc: 'Display a searchable gallery of icons' }
                          ].map((layout) => (
                            <div
                              key={layout.id}
                              className={cn(
                                "rounded-lg border-2 p-4 transition-all text-left",
                                isEditing
                                  ? "cursor-pointer hover:border-primary/50"
                                  : "cursor-not-allowed opacity-50",
                                (selectedPage.layout === layout.id || (!selectedPage.layout && layout.id === 'default'))
                                  ? "border-primary bg-primary/5"
                                  : "border-muted bg-card"
                              )}
                              onClick={() => {
                                if (!isEditing) {
                                  toast({
                                    title: "Editing Disabled",
                                    description: "Please click 'Edit' to make changes to the layout.",
                                    variant: "destructive",
                                  });
                                  return;
                                }
                                setSelectedPage({ ...selectedPage, layout: layout.id as any });
                              }}
                            >
                              <div className="font-medium mb-1">{layout.label}</div>
                              <div className="text-xs text-muted-foreground">{layout.desc}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Accordion type="multiple" defaultValue={['display-options']} className="w-full space-y-4">
                        <AccordionItem value="display-options" className="border rounded-lg px-4">
                          <AccordionTrigger className="hover:no-underline py-4">Display Options</AccordionTrigger>
                          <AccordionContent className="pb-4 pt-2 space-y-4">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="show-breadcrumbs">Show Breadcrumbs</Label>
                              <Switch
                                id="show-breadcrumbs"
                                checked={selectedPage.displayOptions?.showBreadcrumbs ?? true}
                                onCheckedChange={(checked) => setSelectedPage({
                                  ...selectedPage,
                                  displayOptions: { ...selectedPage.displayOptions!, showBreadcrumbs: checked }
                                })}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="show-title">Show Title</Label>
                              <Switch
                                id="show-title"
                                checked={selectedPage.displayOptions?.showTitle ?? true}
                                onCheckedChange={(checked) => setSelectedPage({
                                  ...selectedPage,
                                  displayOptions: { ...selectedPage.displayOptions!, showTitle: checked }
                                })}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="show-summary">Show Summary</Label>
                              <Switch
                                id="show-summary"
                                checked={selectedPage.displayOptions?.showSummary ?? true}
                                onCheckedChange={(checked) => setSelectedPage({
                                  ...selectedPage,
                                  displayOptions: { ...selectedPage.displayOptions!, showSummary: checked }
                                })}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="show-on-this-page">Show "On This Page" Navigation</Label>
                              <Switch
                                id="show-on-this-page"
                                checked={selectedPage.displayOptions?.showOnThisPage ?? true}
                                onCheckedChange={(checked) => setSelectedPage({
                                  ...selectedPage,
                                  displayOptions: { ...selectedPage.displayOptions!, showOnThisPage: checked }
                                })}
                              />
                            </div>
                            <div className="space-y-2 pt-2">
                              <Label>Content Width</Label>
                              <Select
                                value={selectedPage.displayOptions?.contentWidth || 'default'}
                                onValueChange={(value: any) => setSelectedPage({
                                  ...selectedPage,
                                  displayOptions: { ...selectedPage.displayOptions!, contentWidth: value }
                                })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="default">Default (1024px)</SelectItem>
                                  <SelectItem value="wide">Wide (1400px)</SelectItem>
                                  <SelectItem value="full">Full Width</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="page-icon" className="border rounded-lg px-4">
                          <AccordionTrigger className="hover:no-underline py-4">Page Icon</AccordionTrigger>
                          <AccordionContent className="pb-4 pt-2">
                            <div className="space-y-2">
                              <Label>Icon Name (Lucide)</Label>
                              <IconPicker
                                value={selectedPage.icon}
                                onChange={(icon) => setSelectedPage({ ...selectedPage, icon })}
                              />
                              <p className="text-xs text-muted-foreground">Select an icon to represent this page in navigation and menus.</p>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </TabsContent>

                    {selectedPage.layout === 'component' && (
                      <TabsContent value="component-data" className="mt-4 space-y-6">
                        <div className="space-y-4">
                          <Label>Import Path</Label>
                          <Input
                            value={selectedPage.componentData?.importPath || ''}
                            onChange={(e) => setSelectedPage({
                              ...selectedPage,
                              componentData: { ...selectedPage.componentData, importPath: e.target.value }
                            })}
                            placeholder="import { Button } from '@cockpit/ui'"
                          />
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label>Props Definition</Label>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const currentProps = selectedPage.componentData?.props || [];
                                setSelectedPage({
                                  ...selectedPage,
                                  componentData: {
                                    ...selectedPage.componentData,
                                    props: [...currentProps, { name: '', type: 'string', required: false, description: '' }]
                                  }
                                });
                              }}
                            >
                              <Plus className="w-4 h-4 mr-2" /> Add Prop
                            </Button>
                          </div>
                          <div className="space-y-4">
                            {(selectedPage.componentData?.props || []).map((prop, index) => (
                              <Card key={index}>
                                <CardContent className="p-4 grid grid-cols-12 gap-4 items-start">
                                  <div className="col-span-3 space-y-2">
                                    <Label>Name</Label>
                                    <Input
                                      value={prop.name}
                                      onChange={(e) => {
                                        const newProps = [...(selectedPage.componentData?.props || [])];
                                        newProps[index] = { ...prop, name: e.target.value };
                                        setSelectedPage({
                                          ...selectedPage,
                                          componentData: { ...selectedPage.componentData, props: newProps }
                                        });
                                      }}
                                      placeholder="propName"
                                    />
                                  </div>
                                  <div className="col-span-3 space-y-2">
                                    <Label>Type</Label>
                                    <Input
                                      value={prop.type}
                                      onChange={(e) => {
                                        const newProps = [...(selectedPage.componentData?.props || [])];
                                        newProps[index] = { ...prop, type: e.target.value };
                                        setSelectedPage({
                                          ...selectedPage,
                                          componentData: { ...selectedPage.componentData, props: newProps }
                                        });
                                      }}
                                      placeholder="string"
                                    />
                                  </div>
                                  <div className="col-span-2 space-y-2">
                                    <Label>Default</Label>
                                    <Input
                                      value={prop.defaultValue || ''}
                                      onChange={(e) => {
                                        const newProps = [...(selectedPage.componentData?.props || [])];
                                        newProps[index] = { ...prop, defaultValue: e.target.value };
                                        setSelectedPage({
                                          ...selectedPage,
                                          componentData: { ...selectedPage.componentData, props: newProps }
                                        });
                                      }}
                                      placeholder="-"
                                    />
                                  </div>
                                  <div className="col-span-3 space-y-2">
                                    <Label>Description</Label>
                                    <Input
                                      value={prop.description}
                                      onChange={(e) => {
                                        const newProps = [...(selectedPage.componentData?.props || [])];
                                        newProps[index] = { ...prop, description: e.target.value };
                                        setSelectedPage({
                                          ...selectedPage,
                                          componentData: { ...selectedPage.componentData, props: newProps }
                                        });
                                      }}
                                      placeholder="Description..."
                                    />
                                  </div>
                                  <div className="col-span-1 pt-8 flex justify-end">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-destructive hover:text-destructive"
                                      onClick={() => {
                                        const newProps = [...(selectedPage.componentData?.props || [])];
                                        newProps.splice(index, 1);
                                        setSelectedPage({
                                          ...selectedPage,
                                          componentData: { ...selectedPage.componentData, props: newProps }
                                        });
                                      }}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label>Code Examples</Label>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const currentExamples = selectedPage.componentData?.examples || [];
                                setSelectedPage({
                                  ...selectedPage,
                                  componentData: {
                                    ...selectedPage.componentData,
                                    examples: [...currentExamples, { title: 'Basic Usage', language: 'tsx', code: '' }]
                                  }
                                });
                              }}
                            >
                              <Plus className="w-4 h-4 mr-2" /> Add Example
                            </Button>
                          </div>
                          <div className="space-y-6">
                            {(selectedPage.componentData?.examples || []).map((example, index) => (
                              <Card key={index}>
                                <CardContent className="p-4 space-y-4">
                                  <div className="flex gap-4">
                                    <div className="flex-1 space-y-2">
                                      <Label>Title</Label>
                                      <Input
                                        value={example.title}
                                        onChange={(e) => {
                                          const newExamples = [...(selectedPage.componentData?.examples || [])];
                                          newExamples[index] = { ...example, title: e.target.value };
                                          setSelectedPage({
                                            ...selectedPage,
                                            componentData: { ...selectedPage.componentData, examples: newExamples }
                                          });
                                        }}
                                      />
                                    </div>
                                    <div className="w-32 space-y-2">
                                      <Label>Language</Label>
                                      <Select
                                        value={example.language}
                                        onValueChange={(value) => {
                                          const newExamples = [...(selectedPage.componentData?.examples || [])];
                                          newExamples[index] = { ...example, language: value };
                                          setSelectedPage({
                                            ...selectedPage,
                                            componentData: { ...selectedPage.componentData, examples: newExamples }
                                          });
                                        }}
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="tsx">TSX</SelectItem>
                                          <SelectItem value="jsx">JSX</SelectItem>
                                          <SelectItem value="html">HTML</SelectItem>
                                          <SelectItem value="css">CSS</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="pt-8">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive"
                                        onClick={() => {
                                          const newExamples = [...(selectedPage.componentData?.examples || [])];
                                          newExamples.splice(index, 1);
                                          setSelectedPage({
                                            ...selectedPage,
                                            componentData: { ...selectedPage.componentData, examples: newExamples }
                                          });
                                        }}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Code</Label>
                                    <Textarea
                                      value={example.code}
                                      onChange={(e) => {
                                        const newExamples = [...(selectedPage.componentData?.examples || [])];
                                        newExamples[index] = { ...example, code: e.target.value };
                                        setSelectedPage({
                                          ...selectedPage,
                                          componentData: { ...selectedPage.componentData, examples: newExamples }
                                        });
                                      }}
                                      className="font-mono min-h-[200px]"
                                    />
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                    )}

                    {selectedPage.layout === 'iconGallery' && (
                      <TabsContent value="icon-data" className="mt-4 space-y-6">
                        <div className="flex items-center justify-between">
                          <Label>Icons</Label>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const currentIcons = selectedPage.icons || [];
                              setSelectedPage({
                                ...selectedPage,
                                icons: [...currentIcons, { name: 'New Icon', category: 'General', tags: [], svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>' }]
                              });
                            }}
                          >
                            <Plus className="w-4 h-4 mr-2" /> Add Icon
                          </Button>
                        </div>
                        <div className="space-y-4">
                          {(selectedPage.icons || []).map((icon, index) => (
                            <Card key={index}>
                              <CardContent className="p-4 space-y-4">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label>Name</Label>
                                        <Input
                                          value={icon.name}
                                          onChange={(e) => {
                                            const newIcons = [...(selectedPage.icons || [])];
                                            newIcons[index] = { ...icon, name: e.target.value };
                                            setSelectedPage({ ...selectedPage, icons: newIcons });
                                          }}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Category</Label>
                                        <Input
                                          value={icon.category}
                                          onChange={(e) => {
                                            const newIcons = [...(selectedPage.icons || [])];
                                            newIcons[index] = { ...icon, category: e.target.value };
                                            setSelectedPage({ ...selectedPage, icons: newIcons });
                                          }}
                                        />
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Tags (comma separated)</Label>
                                      <Input
                                        value={icon.tags.join(', ')}
                                        onChange={(e) => {
                                          const newIcons = [...(selectedPage.icons || [])];
                                          newIcons[index] = { ...icon, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) };
                                          setSelectedPage({ ...selectedPage, icons: newIcons });
                                        }}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>SVG Code</Label>
                                      <Textarea
                                        value={icon.svg}
                                        onChange={(e) => {
                                          const newIcons = [...(selectedPage.icons || [])];
                                          newIcons[index] = { ...icon, svg: e.target.value };
                                          setSelectedPage({ ...selectedPage, icons: newIcons });
                                        }}
                                        className="font-mono text-xs min-h-[100px]"
                                      />
                                    </div>
                                  </div>
                                  <div className="ml-4 flex flex-col items-center gap-2">
                                    <div
                                      className="w-10 h-10 border rounded p-1 flex items-center justify-center text-foreground"
                                      dangerouslySetInnerHTML={{ __html: icon.svg }}
                                      title="Preview"
                                    />
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-destructive hover:text-destructive"
                                      onClick={() => {
                                        const newIcons = [...(selectedPage.icons || [])];
                                        newIcons.splice(index, 1);
                                        setSelectedPage({ ...selectedPage, icons: newIcons });
                                      }}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                          {(selectedPage.icons?.length === 0) && (
                            <div className="text-center py-8 text-muted-foreground">
                              No icons added. Click "Add Icon" to start building your gallery.
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    )}
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  Select a page from the sidebar or create a new one
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Page</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this page? This will also delete all child pages. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div >
  );
}