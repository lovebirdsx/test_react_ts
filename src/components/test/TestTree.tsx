/**
 * 树形结构渲染优化的几个思路：
 * * 1. 使用 React.memo 包裹节点组件，避免不必要的渲染（只有props变化时才会重新渲染）
 * * 2. 将节点的结构扁平化，使用 zustand 管理节点状态，避免多层嵌套的 props 传递
 * * 3. 使用 useContext 获取 store，避免多层嵌套的 props 传递
 * * 4. 使用 useStore 获取 store 中的数据和方法
 */

import React, { createContext, useContext, useState } from 'react';
import { create, StoreApi, useStore } from 'zustand';

interface ITreeNode {
  id: string;
  name: string;
  children: ITreeNode[];
}

interface ITree {
  root: ITreeNode;
  selectedId: string;
}

function createTree(): ITree {
  return {
    root: {
      id: 'root',
      name: 'Root',
      children: [
        {
          id: 'child1',
          name: 'Child 1',
          children: [],
        },
        {
          id: 'child2',
          name: 'Child 2',
          children: [
            {
              id: 'child2-1',
              name: 'Child 2-1',
              children: [],
            },
          ],
        },
      ],
    },
    selectedId: 'root',
  };
}

interface ITreeNodeState {
  id: string;
  name: string;
  parentId: string;
  childrenIds: string[];
  isSelected: boolean;
}

interface ITreeStore {
  nodeMap: Record<string, ITreeNodeState>;
  rootId: string;
  selectedId: string;
  setSelectedId: (id: string) => void;
  updateNodeName: (id: string, newName: string) => void;
}

function flattenTree(node: ITreeNode): Record<string, ITreeNodeState> {
  const nodeState: ITreeNodeState = {
    id: node.id,
    name: node.name,
    parentId: '',
    childrenIds: node.children.map((child) => child.id),
    isSelected: node.id === 'root',
  };

  return {
    [node.id]: nodeState,
    ...node.children.reduce((acc, child) => {
      return { ...acc, ...flattenTree(child) };
    }, {}),
  };
}

const StoreContext = createContext<StoreApi<ITreeStore> | undefined>(undefined);

function useTreeNode(nodeId: string) {
  const store = useContext(StoreContext);
  if (!store) throw new Error('Store is not defined');

  const node = useStore(store, (state) => state.nodeMap[nodeId]);
  const isSelected = useStore(store, (state) => state.selectedId === nodeId);
  const setSelectedId = useStore(store, (state) => state.setSelectedId);
  const updateNodeName = useStore(store, (state) => state.updateNodeName);

  return { node, isSelected, setSelectedId, updateNodeName };
}

const TreeNode = React.memo((props: { nodeId: string }) => {
  const { node, isSelected, setSelectedId, updateNodeName } = useTreeNode(props.nodeId);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeName(node.id, e.target.value);
  };

  const children = node.childrenIds.map((child) => <TreeNode key={child} nodeId={child} />);

  return (
    <div>
      <input
        style={{ color: isSelected ? 'red' : 'inherit' }}
        type="text"
        value={node.name}
        onChange={handleNameChange}
        onFocus={() => {
          if (isSelected) return;

          setSelectedId(node.id);
          console.log('Selected ID:', node.id);
        }}
      />
      <div style={{ marginLeft: 20 }}>{children}</div>
    </div>
  );
});

function Tree() {
  const props = useContext(StoreContext);

  if (!props) {
    throw new Error('Store is not defined');
  }

  const rootId = useStore(props, (state) => state.rootId);

  return <TreeNode nodeId={rootId} />;
}

export function TestTree() {
  const [store] = useState(() =>
    create<ITreeStore>((set) => ({
      nodeMap: flattenTree(createTree().root),
      rootId: 'root',
      selectedId: 'root',
      setSelectedId: (id: string) =>
        set((state) => {
          const node = state.nodeMap[state.selectedId];
          state.nodeMap[state.selectedId] = { ...node, isSelected: false };

          const newNode = state.nodeMap[id];
          state.nodeMap[id] = { ...newNode, isSelected: true };

          return { selectedId: id, nodeMap: state.nodeMap };
        }),
      updateNodeName: (id: string, newName: string) =>
        set((state) => {
          const node = state.nodeMap[id];
          state.nodeMap[id] = { ...node, name: newName };
          return { nodeMap: state.nodeMap };
        }),
    })),
  );

  return (
    <StoreContext.Provider value={store}>
      <Tree />
    </StoreContext.Provider>
  );
}
