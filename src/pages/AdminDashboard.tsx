import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { storage } from '@/lib/storage';
import { Page, PageTreeNode } from '@/types/page';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Plus, Save, Trash2, Eye, FolderPlus } from 'lucide-react';
import { NavTree } from '@/components/NavTree';
import { PageEditor } from '@/components/PageEditor';
import { TabEditor } from '@/components/TabEditor';
import { useToast } from '@/components/ui/use-toast';
import { useLocation } from 'react-router-dom';
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

const MAX_NESTING_DEPTH = 3;

export function AdminDashboard() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [pageToDelete, setPageToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admindash/login');
      return;
    }
    loadPages();
  }, [isAuthenticated, navigate]);

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
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePreview} disabled={!selectedPage}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
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
                  <Button size="sm" onClick={() => handleCreatePage(null)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <NavTree nodes={pageTree} onSelectPage={handleSelectPage} />
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
                  <Tabs defaultValue="content" className="w-full">
                    <TabsList>
                      <TabsTrigger value="content">Content</TabsTrigger>
                      <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="content" className="mt-4">
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
                    </TabsContent>

                    <TabsContent value="settings" className="mt-4">
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
                        <div className="space-y-2">
                          <Label>Page Layout</Label>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id="viewMode-default"
                                name="viewMode"
                                value="default"
                                checked={!selectedPage.viewMode || selectedPage.viewMode === 'default'}
                                onChange={() => handleViewModeChange('default')}
                                disabled={!isEditing}
                                className="w-4 h-4"
                              />
                              <label htmlFor="viewMode-default" className="text-sm cursor-pointer">
                                Default (Standard Content)
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id="viewMode-tabbed"
                                name="viewMode"
                                value="tabbed"
                                checked={selectedPage.viewMode === 'tabbed'}
                                onChange={() => handleViewModeChange('tabbed')}
                                disabled={!isEditing}
                                className="w-4 h-4"
                              />
                              <label htmlFor="viewMode-tabbed" className="text-sm cursor-pointer">
                                Tabbed (Multiple Sections)
                              </label>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Choose how this page content is displayed.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label>Password Protection (optional)</Label>
                          <Input
                            type="password"
                            placeholder="Leave empty for no password"
                            value={selectedPage.password || ''}
                            onChange={(e) => setSelectedPage({
                              ...selectedPage,
                              password: e.target.value
                            })}
                            disabled={!isEditing}
                          />
                          <p className="text-xs text-muted-foreground">
                            Set a password to restrict access to this page. Admins can always view protected pages.
                          </p>
                        </div>
                      </div>
                    </TabsContent>
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
    </div>
  );
}