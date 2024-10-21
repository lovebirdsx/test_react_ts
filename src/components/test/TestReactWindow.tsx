import React, { CSSProperties } from 'react';
import { FixedSizeList as List } from 'react-window';

const Row: React.FC<{ index: number; style: CSSProperties }> = ({ index, style }) => (
  <div className={index % 2 ? 'ListItemOdd' : 'ListItemEven'} style={style}>
    Row {index}
  </div>
);

const Example = () => (
  <List className="List" height={150} itemCount={100000} itemSize={20} width={300}>
    {Row}
  </List>
);

export const TestReactWindow: React.FC = () => {
  return (
    <div>
      <Example />
    </div>
  );
};
