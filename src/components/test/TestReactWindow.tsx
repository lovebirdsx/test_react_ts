import React, { useState, useEffect, useRef, CSSProperties } from 'react';
import { FixedSizeList as List } from 'react-window';
import { fuzzyContains } from '../../common/util';

interface PickItem {
  id: string;
  name: string;
}

interface PickListProps<T extends PickItem> {
  selected?: T | T[];
  fetchItems: () => Promise<T[]>;
  renderItem: (item: T) => React.ReactNode;
  onSelect: (selected?: T | T[]) => void;
  multiple?: boolean;
  nullable?: boolean;
}

const ITEM_SIZE = 20;
const VISIBLE_ITEM_COUNT = 10;

const PickList: React.FC<PickListProps<PickItem>> = ({
  selected,
  fetchItems,
  renderItem,
  onSelect,
  multiple = false,
  nullable = false,
}) => {
  const [searchText, setSearchText] = useState('');
  const [items, setItems] = useState<PickItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<PickItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<PickItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hoverItemId, setHoverItemId] = useState<number>(0);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<List>(null);

  // 初始化选中项
  useEffect(() => {
    if (selected) {
      if (multiple && Array.isArray(selected)) {
        setSelectedItems(selected);
      } else if (!multiple && !Array.isArray(selected)) {
        setSelectedItems([selected]);
      } else {
        setSelectedItems([]);
      }
    } else {
      setSelectedItems([]);
    }
  }, [selected, multiple]);

  // 获得选项列表
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    fetchItems()
      .then((data) => {
        setItems(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [fetchItems, isOpen]);

  // 滚动到选中项
  useEffect(() => {
    if (listRef.current && selectedItems.length > 0 && !searchText) {
      const index = filteredItems.findIndex((e) => e.id === selectedItems[0].id);
      if (index >= 0) {
        listRef.current.scrollToItem(index, 'start');
        setHoverItemId(index);
        console.log('scroll to', index);
      }
    }
  }, [selectedItems, filteredItems, searchText]);

  // 被过滤的选项列表
  useEffect(() => {
    setFilteredItems(items.filter((item) => fuzzyContains(item.name, searchText)));
  }, [items, searchText]);

  const handleInputFocus = () => {
    setIsOpen(true);
    setHoverItemId(0);
    setSearchText('');
  };

  const handleInputBlur = () => {
    // 需要延迟关闭，否则无法点击选项
    setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    if (filteredItems.length > 0) {
      setHoverItemId(0);
      listRef.current?.scrollToItem(0, 'start');
    }
  };

  const handleItemClick = (item: PickItem) => {
    setSearchText('');
    if (multiple) {
      let newSelectedItems;
      if (selectedItems.some((i) => i.id === item.id)) {
        newSelectedItems = selectedItems.filter((i) => i.id !== item.id);
      } else {
        newSelectedItems = [...selectedItems, item];
      }
      setSelectedItems(newSelectedItems);
      onSelect(newSelectedItems);
    } else {
      setSelectedItems([item]);
      onSelect(item);
      setIsOpen(false);
    }
  };

  const handleClearSelection = (e: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedItems([]);
    onSelect(multiple ? [] : undefined);
    e.stopPropagation();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHoverItemId((prev) => Math.min(prev + 1, filteredItems.length - 1));
        if (listRef.current) {
          listRef.current.scrollToItem(Math.min(hoverItemId + 1, filteredItems.length - 1));
        }
        break;

      case 'PageDown':
        e.preventDefault();
        setHoverItemId((prev) => Math.min(prev + 10, filteredItems.length - 1));
        if (listRef.current) {
          listRef.current.scrollToItem(Math.min(hoverItemId + 10, filteredItems.length - 1));
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        setHoverItemId((prev) => Math.max(prev - 1, 0));
        if (listRef.current) {
          listRef.current.scrollToItem(Math.max(hoverItemId - 1, 0));
        }
        break;

      case 'PageUp':
        e.preventDefault();
        setHoverItemId((prev) => Math.max(prev - 10, 0));
        if (listRef.current) {
          listRef.current.scrollToItem(Math.max(hoverItemId - 10, 0));
        }
        break;

      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;

      case 'Enter':
        if (filteredItems.length > 0 && hoverItemId >= 0 && hoverItemId < filteredItems.length) {
          handleItemClick(filteredItems[hoverItemId]);
        } else {
          setSearchText('');
        }
        inputRef.current?.blur();
        break;

      case 'Delete':
        if (searchText === '' && selectedItems.length > 0) {
          setSelectedItems(selectedItems.slice(0, -1));
          onSelect(selectedItems.slice(0, -1));
        }
        break;

      default:
        break;
    }
  };

  const renderListItem = ({ index, style }: { index: number; style: CSSProperties }) => {
    const item = filteredItems[index];
    const isHovered = index === hoverItemId;
    const isSelected = selectedItems.some((i) => i.id === item.id);
    return (
      <div
        key={item.id}
        style={style}
        onClick={() => handleItemClick(item)}
        className={`vsplay-list-item ${isSelected ? 'selected' : isHovered ? 'hovered' : ''}`}
      >
        {renderItem(item)}
      </div>
    );
  };

  const getPlaceholder = () => {
    if (isOpen) {
      if (searchText) {
        return '';
      }

      if (multiple || selectedItems.length === 0) {
        return '搜索...';
      }

      return selectedItems[0]!.name;
    }

    return multiple || selectedItems.length === 0 ? '选择...' : '';
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    // 算出当前鼠标所在的选项
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const index = Math.floor(y / ITEM_SIZE);
    if (index < 0 || index >= VISIBLE_ITEM_COUNT) {
      return;
    }

    const newIndex = visibleStartIndex + index;
    if (newIndex !== hoverItemId) {
      setHoverItemId(newIndex);
    }
  };

  return (
    <div className="vsplay-picklist-container">
      <div
        className="vsplay-input-container"
        onClick={() => {
          inputRef.current?.focus();
        }}
      >
        {multiple ? (
          <div className="vsplay-selected-items" onClick={(e) => e.stopPropagation()}>
            {selectedItems.map((item) => (
              <span key={item.id} className="vsplay-selected-item">
                {item.name}
                <button onClick={() => handleItemClick(item)}>x</button>
              </span>
            ))}
            <input
              type="text"
              placeholder={getPlaceholder()}
              value={searchText}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              ref={inputRef}
            />
          </div>
        ) : (
          <div className="vsplay-selected-item">
            <input
              type="text"
              placeholder={getPlaceholder()}
              value={!isOpen && selectedItems.length > 0 ? selectedItems[0].name : searchText}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              ref={inputRef}
            />
          </div>
        )}
        {nullable && selectedItems.length > 0 && (
          <button
            className="vsplay-picklist-clear-button"
            onClick={handleClearSelection}
            disabled={selectedItems.length === 0}
          >
            x
          </button>
        )}
      </div>
      {isOpen && (
        <div className="vsplay-dropdown">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : filteredItems.length > 0 ? (
            <div onMouseMove={handleMouseMove}>
              <List
                className="vsplay-picklist"
                ref={listRef}
                height={ITEM_SIZE * VISIBLE_ITEM_COUNT}
                itemCount={filteredItems.length}
                initialScrollOffset={selectedItems.length > 0 ? filteredItems.indexOf(selectedItems[0]) * ITEM_SIZE : 0}
                itemSize={ITEM_SIZE}
                width="100%"
                onItemsRendered={({ visibleStartIndex }) => setVisibleStartIndex(visibleStartIndex)}
              >
                {renderListItem}
              </List>
            </div>
          ) : (
            <div className="vsplay-no-items">未找到匹配的项</div>
          )}
        </div>
      )}
    </div>
  );
};

const fetchItems = async () => {
  const allOptions: PickItem[] = Array.from({ length: 100000 }, (_, i) => ({
    id: i.toString(),
    name: `Option ${i}`,
  }));
  return new Promise<PickItem[]>((resolve) => {
    setTimeout(() => {
      resolve(allOptions);
    }, 100);
  });
};

const Checkbox = ({ children, ...props }: JSX.IntrinsicElements['input']) => (
  <label style={{ marginRight: '1em' }}>
    <input type="checkbox" {...props} />
    {children}
  </label>
);

const PickListTest: React.FC<{ multiple: boolean }> = ({ multiple }) => {
  const [nullable, setNullable] = useState(true);
  const [selected, setSelected] = React.useState<PickItem | PickItem[] | undefined>();
  const onSelect = (item?: PickItem | PickItem[]) => {
    setSelected(item);
  };

  const getSelectedInfo = () => {
    if (selected === undefined) {
      return '未选择';
    }

    if (Array.isArray(selected)) {
      return `已选择 ${selected.length} 项 (${selected.map((item) => item.name).join(', ')})`;
    }

    return `已选择 ${selected.name}`;
  };

  return (
    <>
      <PickList
        selected={selected}
        fetchItems={fetchItems}
        renderItem={(item) => item.name}
        onSelect={onSelect}
        multiple={multiple}
        nullable={nullable}
      />
      <div
        style={{
          color: 'hsl(0, 0%, 40%)',
          display: 'inline-block',
          fontSize: 12,
          fontStyle: 'italic',
          marginTop: '1em',
        }}
      >
        <Checkbox checked={nullable} onChange={() => setNullable((state) => !state)}>
          nullable
        </Checkbox>
      </div>
      <div style={{ marginTop: '0.5em' }}>{getSelectedInfo()}</div>
    </>
  );
};

export const TestReactWindow: React.FC = () => {
  return (
    <div className="vsplay-body">
      <h3>PickList Single</h3>
      <PickListTest multiple={false} />
      <h3>PickList Multiple</h3>
      <PickListTest multiple />
    </div>
  );
};
