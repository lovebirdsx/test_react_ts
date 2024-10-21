import React, { CSSProperties } from 'react';
import { FixedSizeList as List } from 'react-window';

const Row: React.FC<{ index: number; style: CSSProperties }> = ({ index, style }) => (
  <div className={index % 2 ? 'vsplay-list-odd' : 'vsplay-list-even'} style={style}>
    Row {index}
  </div>
);

const Example: React.FC<{ itemCount: number }> = ({ itemCount }) => (
  <List className="vsplay-list" height={150} itemCount={itemCount} itemSize={20} width={300}>
    {Row}
  </List>
);

const VariableSizeList: React.FC = () => {
  const [itemCount, setItemCount] = React.useState(10000);
  return (
    <div>
      <Example itemCount={itemCount} />
      {itemCount} items
      <div>
        <button onClick={() => setItemCount(itemCount + 100)}>Add 100 rows</button>
        <button onClick={() => setItemCount(Math.max(itemCount - 100, 0))}>Remove 100 rows</button>
      </div>
    </div>
  );
};

interface PickItem {
  id: string;
  name: string;
}

interface PickListProps<T extends PickItem> {
  selected?: T;
  initSearchText?: string;
  getItems: () => Promise<T[]>;
  renderItem: (item: T) => React.ReactNode;
  onSelect: (item: T) => void;
}

const PickList: React.FC<PickListProps<PickItem>> = ({ selected, getItems, renderItem, onSelect }) => {
  return (
    <List height={150} itemCount={100} itemSize={20} width={300}>
      {Row}
    </List>
  );
};

const getItems = async () => {
  const allOptions: PickItem[] = Array.from({ length: 10000 }, (_, i) => ({
    id: i.toString(),
    name: `Option ${i}`,
  }));
  return new Promise<PickItem[]>((resolve) => {
    setTimeout(() => {
      resolve(allOptions);
    }, 1000); // 模拟网络延迟
  });
};

const PickListTest: React.FC = () => {
  const [selected, setSelected] = React.useState<PickItem | undefined>();
  const onSelect = (item: PickItem) => {
    setSelected(item);
  };
  return (
    <PickList
      selected={selected}
      getItems={getItems}
      renderItem={(item) => <div>{item.name}</div>}
      onSelect={onSelect}
    />
  );
};

export const TestReactWindow: React.FC = () => {
  return (
    <div>
      <h3>基础测试</h3>
      <VariableSizeList />
      <h3>PickList</h3>
      <PickListTest />
    </div>
  );
};
