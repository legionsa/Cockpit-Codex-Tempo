import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, ChevronDown, FileText, Folder, FolderOpen } from 'lucide-react';
import { PageTreeNode } from '@/types/page';
import { cn } from '@/lib/utils';

interface NavTreeProps {
  nodes: PageTreeNode[];
  basePath?: string;
  onSelectPage?: (pageId: string) => void;
}

function NavTreeItem({ 
  node, 
  basePath = '', 
  onSelectPage,
  level = 0
}: { 
  node: PageTreeNode; 
  basePath?: string;
  onSelectPage?: (pageId: string) => void;
  level?: number;
}) {
  const location = useLocation();
  const fullPath = basePath + '/' + node.slug;
  const isActive = location.pathname === fullPath;
  const isInPath = location.pathname.startsWith(fullPath + '/') || location.pathname === fullPath;
  const hasChildren = node.children.length > 0;
  const [isExpanded, setIsExpanded] = useState(isInPath);

  // Auto-expand when navigating to a child page
  useEffect(() => {
    if (isInPath && hasChildren) {
      setIsExpanded(true);
    }
  }, [isInPath, hasChildren]);

  const handleClick = (e: React.MouseEvent) => {
    if (onSelectPage) {
      e.preventDefault();
      onSelectPage(node.id);
    }
  };

  const toggleExpand = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <li>
      <div 
        className={cn(
          "group flex items-center gap-1 rounded-md transition-colors",
          isActive && "bg-primary/10"
        )}
      >
        {hasChildren ? (
          <button
            onClick={toggleExpand}
            className="p-1.5 hover:bg-accent rounded transition-colors"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </button>
        ) : (
          <div className="w-7" />
        )}
        
        {onSelectPage ? (
          <button
            onClick={handleClick}
            className={cn(
              'flex-1 flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors text-left',
              isActive 
                ? 'text-primary font-medium' 
                : 'text-foreground/80 hover:text-foreground hover:bg-accent/50'
            )}
          >
            {hasChildren ? (
              isExpanded ? <FolderOpen className="h-4 w-4 text-muted-foreground" /> : <Folder className="h-4 w-4 text-muted-foreground" />
            ) : (
              <FileText className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="truncate">{node.title}</span>
          </button>
        ) : (
          <Link
            to={fullPath}
            className={cn(
              'flex-1 flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors',
              isActive 
                ? 'text-primary font-medium' 
                : 'text-foreground/80 hover:text-foreground hover:bg-accent/50'
            )}
          >
            {hasChildren ? (
              isExpanded ? <FolderOpen className="h-4 w-4 text-muted-foreground" /> : <Folder className="h-4 w-4 text-muted-foreground" />
            ) : (
              <FileText className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="truncate">{node.title}</span>
          </Link>
        )}
      </div>
      
      {hasChildren && isExpanded && (
        <ul className="ml-3 mt-0.5 space-y-0.5 border-l-2 border-border/50 pl-3">
          {node.children.map(child => (
            <NavTreeItem 
              key={child.id} 
              node={child} 
              basePath={fullPath} 
              onSelectPage={onSelectPage}
              level={level + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function NavTree({ nodes, onSelectPage }: NavTreeProps) {
  return (
    <nav className="space-y-1">
      <ul className="space-y-0.5">
        {nodes.map(node => (
          <NavTreeItem 
            key={node.id} 
            node={node} 
            onSelectPage={onSelectPage}
          />
        ))}
      </ul>
    </nav>
  );
}