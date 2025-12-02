import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, ChevronDown, GripVertical } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { PageTreeNode } from '@/types/page';
import { cn } from '@/lib/utils';
import { Draggable } from 'react-beautiful-dnd';
import { StrictModeDroppable } from './StrictModeDroppable';

interface NavTreeProps {
  nodes: PageTreeNode[];
  basePath?: string;
  onSelectPage?: (pageId: string) => void;
  onNavigate?: () => void;
  activePageId?: string;
  isEditable?: boolean;
}

interface NavTreeNodeProps {
  node: PageTreeNode;
  basePath?: string;
  onSelectPage?: (pageId: string) => void;
  onNavigate?: () => void;
  activePageId?: string;
  isEditable?: boolean;
  index: number;
}

function NavTreeItem({
  node,
  basePath = '',
  onSelectPage,
  onNavigate,
  activePageId,
  isEditable,
  index
}: NavTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const location = useLocation();
  const fullPath = basePath + '/' + node.slug;
  const isActive = activePageId === node.id || location.pathname === fullPath;
  const hasChildren = node.children && node.children.length > 0;

  const handleClick = (e: React.MouseEvent) => {
    if (onSelectPage) {
      e.preventDefault();
      onSelectPage(node.id);
    }
  };

  const PageIcon = node.icon && (LucideIcons as any)[node.icon] ? (LucideIcons as any)[node.icon] : null;

  const content = (
    <div className="flex items-center gap-1 group">
      {isEditable && (
        <div className="mr-1 cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-muted-foreground">
          <GripVertical className="h-4 w-4" />
        </div>
      )}
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
            'flex-1 px-3 py-2 rounded-md text-sm transition-colors text-left flex items-center gap-2',
            isActive
              ? 'bg-accent text-accent-foreground font-medium'
              : 'hover:bg-accent/50'
          )}
        >
          {PageIcon && <PageIcon className="h-4 w-4 opacity-70" />}
          <span>{node.title}</span>
        </button>
      ) : (
        <Link
          to={fullPath}
          onClick={onNavigate}
          className={cn(
            'flex-1 px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2',
            isActive
              ? 'bg-accent text-accent-foreground font-medium'
              : 'hover:bg-accent/50'
          )}
        >
          {PageIcon && <PageIcon className="h-4 w-4 opacity-70" />}
          <span>{node.title}</span>
        </Link>
      )}
    </div>
  );

  const renderChildren = () => {
    if (!isExpanded || !hasChildren) return null;

    return (
      <div className="border-l border-border ml-2">
        {isEditable ? (
          <StrictModeDroppable droppableId={`droppable-${node.id}`} type="PAGE">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {node.children.map((child, childIndex) => (
                  <NavTreeItem
                    key={child.id}
                    node={child}
                    basePath={fullPath}
                    onSelectPage={onSelectPage}
                    activePageId={activePageId}
                    isEditable={isEditable}
                    index={childIndex}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </StrictModeDroppable>
        ) : (
          node.children.map((child, childIndex) => (
            <NavTreeItem
              key={child.id}
              node={child}
              basePath={fullPath}
              onSelectPage={onSelectPage}
              onNavigate={onNavigate}
              activePageId={activePageId}
              isEditable={isEditable}
              index={childIndex}
            />
          ))
        )}
      </div>
    );
  };

  if (isEditable) {
    return (
      <Draggable draggableId={node.id} index={index}>
        {(provided) => (
          <li
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="mb-1"
          >
            {content}
            {renderChildren()}
          </li>
        )}
      </Draggable>
    );
  }

  return (
    <li>
      {content}
      {renderChildren()}
    </li>
  );
}

export function NavTree({ nodes, onSelectPage, onNavigate, activePageId, isEditable }: NavTreeProps) {
  if (isEditable) {
    return (
      <nav className="space-y-1">
        <StrictModeDroppable droppableId="root" type="PAGE">
          {(provided) => (
            <ul
              className="space-y-1"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {nodes.map((node, index) => (
                <NavTreeItem
                  key={node.id}
                  node={node}
                  onSelectPage={onSelectPage}
                  activePageId={activePageId}
                  isEditable={isEditable}
                  index={index}
                />
              ))}
              {provided.placeholder}
            </ul>
          )}
        </StrictModeDroppable>
      </nav>
    );
  }

  return (
    <nav className="space-y-1">
      <ul className="space-y-1">
        {nodes.map((node, index) => (
          <NavTreeItem
            key={node.id}
            node={node}
            onSelectPage={onSelectPage}
            onNavigate={onNavigate}
            activePageId={activePageId}
            isEditable={isEditable}
            index={index}
          />
        ))}
      </ul>
    </nav>
  );
}