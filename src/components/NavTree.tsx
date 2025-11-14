import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, ChevronDown } from 'lucide-react';
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
  onSelectPage 
}: { 
  node: PageTreeNode; 
  basePath?: string;
  onSelectPage?: (pageId: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const location = useLocation();
  const fullPath = basePath + '/' + node.slug;
  const isActive = location.pathname === fullPath;
  const hasChildren = node.children.length > 0;

  const handleClick = (e: React.MouseEvent) => {
    if (onSelectPage) {
      e.preventDefault();
      onSelectPage(node.id);
    }
  };

  return (
    <li>
      <div className="flex items-center gap-1">
        {hasChildren && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-accent rounded"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        )}
        {!hasChildren && <div className="w-6" />}
        {onSelectPage ? (
          <button
            onClick={handleClick}
            className={cn(
              'flex-1 px-3 py-2 rounded-md text-sm transition-colors text-left',
              isActive 
                ? 'bg-accent text-accent-foreground font-medium' 
                : 'hover:bg-accent/50'
            )}
          >
            {node.title}
          </button>
        ) : (
          <Link
            to={fullPath}
            className={cn(
              'flex-1 px-3 py-2 rounded-md text-sm transition-colors',
              isActive 
                ? 'bg-accent text-accent-foreground font-medium' 
                : 'hover:bg-accent/50'
            )}
          >
            {node.title}
          </Link>
        )}
      </div>
      {hasChildren && isExpanded && (
        <ul className="ml-4 mt-1 space-y-1 border-l border-border pl-2">
          {node.children.map(child => (
            <NavTreeItem 
              key={child.id} 
              node={child} 
              basePath={fullPath} 
              onSelectPage={onSelectPage}
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
      <ul className="space-y-1">
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