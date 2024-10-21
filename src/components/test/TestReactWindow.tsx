import React, { CSSProperties } from 'react';
import { FixedSizeList as List } from 'react-window';

const Row: React.FC<{ index: number; style: CSSProperties }> = ({ index, style }) => (
  <div className={index % 2 ? 'ListItemOdd' : 'ListItemEven'} style={style}>
    Row {index}
  </div>
);

const Example: React.FC<{ itemCount: number }> = ({ itemCount }) => (
  <List className="List" height={150} itemCount={itemCount} itemSize={20} width={300}>
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

export const TestReactWindow: React.FC = () => {
  return (
    <div>
      <VariableSizeList />
    </div>
  );
};
