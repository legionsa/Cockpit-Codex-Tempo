import React, { useEffect, useRef, useState } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Quote from '@editorjs/quote';
import Warning from '@editorjs/warning';
import Delimiter from '@editorjs/delimiter';
import Table from '@editorjs/table';
import Code from '@editorjs/code';
import Embed from '@editorjs/embed';
import ImageTool from '@editorjs/image';
// @ts-ignore
import ImageUrlTool from './editor-tools/ImageUrlTool';
// @ts-ignore
import ImageUploadTool from './editor-tools/ImageUploadTool';
// @ts-ignore
import RawTool from '@editorjs/raw';
import IconTool from './editor-tools/IconTool';
import PageLinkTool from './editor-tools/PageLinkTool';
import { IconLibraryModal } from './IconLibraryModal';
import { PageSelectorModal } from './PageSelectorModal';
// ...

import { EditorJSContent } from '@/types/page';
import { useToast } from '@/components/ui/use-toast';

interface PageEditorProps {
  content: EditorJSContent;
  onChange: (content: EditorJSContent) => void;
  readOnly?: boolean;
}

export function PageEditor({ content, onChange, readOnly = false }: PageEditorProps) {
  const { toast } = useToast();
  const editorRef = useRef<EditorJS | null>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const initialContentRef = useRef(content);
  const [showIconLibrary, setShowIconLibrary] = useState(false);
  const [iconCallback, setIconCallback] = useState<((icon: any) => void) | null>(null);
  const [showPageSelector, setShowPageSelector] = useState(false);
  const [pageCallback, setPageCallback] = useState<((page: any) => void) | null>(null);


  useEffect(() => {
    const handleOpenIconLibrary = (e: any) => {
      setIconCallback(() => e.detail.callback);
      setShowIconLibrary(true);
    };

    const handleOpenPageSelector = (e: any) => {
      setPageCallback(() => e.detail.callback);
      setShowPageSelector(true);
    };



    window.addEventListener('openIconLibrary', handleOpenIconLibrary);
    window.addEventListener('openPageSelector', handleOpenPageSelector);


    return () => {
      window.removeEventListener('openIconLibrary', handleOpenIconLibrary);
      window.removeEventListener('openPageSelector', handleOpenPageSelector);

    };
  }, []);

  // ... initEditor ...


  useEffect(() => {
    let isMounted = true;
    let editorInstance: EditorJS | null = null;

    const initEditor = async () => {
      // Cleanup existing editor first
      if (editorRef.current) {
        try {
          await editorRef.current.destroy();
        } catch (error) {
          console.error('Error destroying editor:', error);
        }
        editorRef.current = null;
        setIsReady(false);
      }

      if (!holderRef.current || !isMounted) return;

      // Small delay to ensure DOM is clean
      await new Promise(resolve => setTimeout(resolve, 0));

      if (!isMounted) return;

      try {
        editorInstance = new EditorJS({
          holder: holderRef.current,
          readOnly,
          data: initialContentRef.current,
          placeholder: 'Start writing your documentation...',
          tools: {
            // ... tools config
            header: {
              class: Header,
              config: {
                placeholder: 'Enter a header',
                levels: [1, 2, 3, 4, 5, 6],
                defaultLevel: 2
              }
            },
            paragraph: {
              class: Paragraph,
              inlineToolbar: true,
              config: {
                placeholder: 'Enter paragraph text'
              }
            },
            list: {
              class: List,
              inlineToolbar: true,
              config: {
                defaultStyle: 'unordered'
              }
            },
            quote: {
              class: Quote,
              inlineToolbar: true,
              config: {
                quotePlaceholder: 'Enter a quote',
                captionPlaceholder: 'Quote\'s author'
              }
            },
            warning: {
              class: Warning,
              inlineToolbar: true,
              config: {
                titlePlaceholder: 'Title',
                messagePlaceholder: 'Message'
              }
            },
            delimiter: Delimiter,
            table: {
              class: Table as any,
              inlineToolbar: true,
              config: {
                rows: 2,
                cols: 3
              }
            },
            code: {
              class: Code,
              config: {
                placeholder: 'Enter code'
              }
            },
            raw: {
              class: RawTool,
              config: {
                placeholder: 'Enter HTML/Figma embed code'
              }
            },
            embed: {
              class: Embed,
              config: {
                services: {
                  youtube: true,
                  codesandbox: true,
                  codepen: true,
                  figma: {
                    regex: /https?:\/\/(?:www\.)?figma\.com\/(file|proto)\/([0-9a-zA-Z]{22,128})(?:\/.*)?$/,
                    embedUrl: 'https://www.figma.com/embed?embed_host=share&url=<%= remote_id %>',
                    html: '<iframe style="border: 1px solid rgba(0, 0, 0, 0.1);" width="800" height="450" allowfullscreen></iframe>',
                    height: 450,
                    width: 800,
                    id: (groups: string[]) => groups.join('/')
                  }
                }
              }
            },
            // The standard Image tool - used for rendering but hidden from toolbox
            imageUpload: {
              class: ImageTool as any,
              config: {
                uploader: {
                  uploadByFile(file: File) {
                    return new Promise((resolve) => {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        resolve({
                          success: 1,
                          file: {
                            url: e.target?.result,
                          },
                        });
                      };
                      reader.readAsDataURL(file);
                    });
                  },
                },
              },
              toolbox: false // Hide from toolbox
            },
            // Custom tool for uploading images
            uploadImage: {
              class: ImageUploadTool,
              inlineToolbar: true
            },
            // Custom tool for inserting images from URL
            imageUrl: {
              class: ImageUrlTool,
              inlineToolbar: true,
              config: {
                // No config needed for now, handled by modal
              }
            },
            icon: {
              class: IconTool
            },
            pageLink: {
              class: PageLinkTool
            }
          },
          onChange: async () => {
            if (!readOnly && editorInstance) {
              try {
                const outputData = await editorInstance.save();
                onChange({
                  time: Date.now(),
                  blocks: outputData.blocks,
                  version: outputData.version || '2.29.0'
                });
              } catch (error) {
                console.error('Error saving editor content:', error);
              }
            }
          },
          onReady: () => {
            if (isMounted) {
              setIsReady(true);
            }
          }
        });

        await editorInstance.isReady;

        if (isMounted) {
          editorRef.current = editorInstance;
        }
      } catch (error) {
        console.error('Error initializing editor:', error);
      }
    };

    initEditor();

    return () => {
      isMounted = false;
      setIsReady(false);

      if (editorInstance && typeof editorInstance.destroy === 'function') {
        try {
          editorInstance.destroy();
        } catch (error) {
          console.error('Cleanup error:', error);
        }
      }
    };
  }, [readOnly]);

  return (
    <div className="bg-background">
      <div
        ref={holderRef}
        className="prose prose-slate dark:prose-invert max-w-none min-h-[400px] p-4 border border-border rounded-lg"
        onClick={() => {
          if (readOnly) {
            toast({
              title: "Editing Disabled",
              description: "Please click 'Edit' to make changes to the content.",
              variant: "destructive",
            });
          }
        }}
      />
      <IconLibraryModal
        open={showIconLibrary}
        onClose={() => setShowIconLibrary(false)}
        onSelectIcon={(icon) => {
          if (iconCallback) {
            iconCallback(icon);
          }
          setShowIconLibrary(false);
        }}
      />
      <PageSelectorModal
        open={showPageSelector}
        onClose={() => setShowPageSelector(false)}
        onSelect={(page) => {
          if (pageCallback) {
            pageCallback(page);
          }
          setShowPageSelector(false);
        }}
      />
    </div>
  );
}