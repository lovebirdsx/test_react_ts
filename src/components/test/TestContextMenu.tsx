import React from 'react';
import { create } from 'zustand';

function optional() {
  return (target: any, propertyKey: string) => {
    Reflect.defineMetadata('optional', true, target, propertyKey);
  };
}

interface ContextMenuItem {
  name: string;
  action: string | ((data: any) => void);
  category?: string;
}

function contextMenuItem(menuItem: ContextMenuItem | ContextMenuItem[]) {
  return (target: any, propertyKey: string) => {
    const existingMenuItems: ContextMenuItem[] = Reflect.getMetadata('contextMenuItems', target, propertyKey) || [];
    if (Array.isArray(menuItem)) {
      existingMenuItems.push(...menuItem);
    } else {
      existingMenuItems.push(menuItem);
    }
    Reflect.defineMetadata('contextMenuItems', existingMenuItems, target, propertyKey);
  };
}

interface DataNode {
  key?: string;
  value: any;
  metadata: {
    isOptional: boolean;
    contextMenuItems: ContextMenuItem[];
  };
  children?: DataNode[];
}

function buildDataNode(target: any, propertyKey?: string): DataNode {
  const value = propertyKey ? target[propertyKey] : target;
  const isOptional = propertyKey ? Reflect.getMetadata('optional', target, propertyKey) : false;
  const contextMenuItems: ContextMenuItem[] = propertyKey
    ? Reflect.getMetadata('contextMenuItems', target, propertyKey)
    : [];

  const node: DataNode = {
    key: propertyKey,
    value,
    metadata: {
      isOptional,
      contextMenuItems,
    },
    children: typeof value === 'object' ? [] : undefined,
  };

  // Recursively build child nodes for objects
  if (typeof value === 'object' && value !== null) {
    for (const key of Object.keys(value)) {
      node.children!.push(buildDataNode(value, key));
    }
  }

  return node;
}

interface ContextMenuState {
  isVisible: boolean;
  position: { x: number; y: number };
  items: ContextMenuItem[];
  targetNode: DataNode | null;
  setContextMenu: (menu: Partial<ContextMenuState>) => void;
  clearContextMenu: () => void;
}

const useContextMenuStore = create<ContextMenuState>((set) => ({
  isVisible: false,
  position: { x: 0, y: 0 },
  items: [],
  targetNode: null,
  setContextMenu: (menu) => set((state) => ({ ...state, ...menu })),
  clearContextMenu: () =>
    set({
      isVisible: false,
      position: { x: 0, y: 0 },
      items: [],
      targetNode: null,
    }),
}));

interface EditorState {
  lastCommand?: string;
  setLastCommand: (command?: string) => void;
}

const useEditorStore = create<EditorState>((set) => ({
  lastCommand: undefined,
  setLastCommand: (command) => set({ lastCommand: command }),
}));

class Baz {
  id = 1;
  @optional()
  name = 'baz';
}

class Foo {
  @optional()
  bar = 1;
  baz = new Baz();

  @contextMenuItem([
    {
      name: 'Custom Action 1',
      action: 'customAction1',
      category: 'Custom',
    },
    {
      name: 'Custom Action 2',
      action: 'customAction2',
      category: 'Custom',
    },
    {
      name: 'Custom Action 3',
      action: 'customAction3',
      category: 'Custom',
    },
  ])
  foo = 1;
}

function getSystemContextMenuItems(node: DataNode): ContextMenuItem[] {
  const items: ContextMenuItem[] = [];

  if (node.metadata.isOptional) {
    items.push({
      name: 'Delete',
      action: 'deleteField',
      category: 'System Actions',
    });
  }

  if (Array.isArray(node.value)) {
    items.push(
      {
        name: 'Add Item',
        action: 'addItem',
        category: 'System Actions',
      },
      {
        name: 'Delete Item',
        action: 'deleteItem',
        category: 'System Actions',
      },
    );
  } else {
    items.push({
      name: 'Reset',
      action: 'resetField',
      category: 'System Actions',
    });
  }

  return items;
}

function getContextMenuItems(node: DataNode): ContextMenuItem[] {
  const systemItems = getSystemContextMenuItems(node);
  const customItems = node.metadata.contextMenuItems || [];
  return [...systemItems, ...customItems];
}

const actionRegistry = new Map<string, (node: DataNode) => void>();

function registerAction(name: string, action: (node: DataNode) => void) {
  actionRegistry.set(name, action);
}

function executeAction(name: string, node: DataNode) {
  const action = actionRegistry.get(name);
  if (action) {
    action(node);
  } else {
    useEditorStore.getState().setLastCommand(name);
  }
}

registerAction('deleteField', (node) => {
  useEditorStore.getState().setLastCommand('deleteField');
});

registerAction('resetField', (node) => {
  useEditorStore.getState().setLastCommand('resetField');
});

registerAction('addItem', (node) => {
  useEditorStore.getState().setLastCommand('addItem');
});

registerAction('deleteItem', (node) => {
  useEditorStore.getState().setLastCommand('deleteItem');
});

registerAction('customAction1', (node) => {
  useEditorStore.getState().setLastCommand('customAction1');
});

interface ContextMenuProps {
  items: ContextMenuItem[];
  position: { x: number; y: number };
  onClose: () => void;
  onSelect: (actionName: string) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ items, position, onClose, onSelect }) => {
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const contextMenuElement = document.getElementById('context-menu');
      if (contextMenuElement && !contextMenuElement.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const groupedItems = items.reduce(
    (acc, item) => {
      const category = item.category || 'Default';
      acc[category] = acc[category] || [];
      acc[category].push(item);
      return acc;
    },
    {} as Record<string, ContextMenuItem[]>,
  );

  return (
    <div
      id="context-menu"
      className="context-menu"
      style={{
        position: 'absolute',
        top: position.y,
        left: position.x,
        zIndex: 1000,
        backgroundColor: 'white',
        border: '1px solid #ccc',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        padding: '5px',
        borderRadius: '4px',
      }}
      onClick={onClose}
    >
      {Object.keys(groupedItems).map((category) => (
        <div key={category} className="context-menu-category">
          <div
            className="context-menu-category-title"
            style={{
              fontWeight: 'bold',
              marginBottom: '5px',
              borderBottom: '1px solid #eee',
              paddingBottom: '2px',
            }}
          ></div>
          {groupedItems[category].map((item) => (
            <div
              key={item.name}
              className="context-menu-item"
              style={{
                padding: '5px',
                cursor: 'pointer',
              }}
              onClick={() => onSelect(item.action as string)}
            >
              {item.name}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

interface TreeNodeProps {
  node: DataNode;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node }) => {
  const { setContextMenu } = useContextMenuStore();

  const handleContextMenu = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    setContextMenu({
      isVisible: true,
      position: { x: event.clientX, y: event.clientY },
      items: getContextMenuItems(node),
      targetNode: node,
    });
  };

  const renderOneRowField = () => {
    return (
      <div>
        {node.key} : {node.value}
      </div>
    );
  };

  const renderMultipleRowField = () => {
    const rows = node.children?.map((child) => <TreeNode key={child.key} node={child} />);
    return (
      <div>
        {node.key && <div>{node.key}</div>}
        <div style={{ marginLeft: node.key ? 10 : 0 }}>{rows}</div>
      </div>
    );
  };

  return <div onContextMenu={handleContextMenu}>{node.children ? renderMultipleRowField() : renderOneRowField()}</div>;
};

const ContextMenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isVisible, position, items, clearContextMenu, targetNode } = useContextMenuStore();

  const handleSelect = (actionName: string) => {
    if (targetNode) {
      executeAction(actionName, targetNode);
    }
    clearContextMenu();
  };

  return (
    <>
      {children}
      {isVisible && (
        <ContextMenu items={items} position={position} onClose={clearContextMenu} onSelect={handleSelect} />
      )}
    </>
  );
};

function Editor() {
  const lastCommand = useEditorStore((state) => state.lastCommand);
  return <div>Last Command: {lastCommand}</div>;
}

export function TestContextMenu() {
  return (
    <div>
      <h1>TestContextMenu</h1>
      <Editor />
      <ContextMenuProvider>
        <TreeNode node={buildDataNode(new Foo())} />
      </ContextMenuProvider>
    </div>
  );
}
