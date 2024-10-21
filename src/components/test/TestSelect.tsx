import React, { useState, useEffect, useRef, ChangeEvent } from 'react';

// 样式可以根据需要自定义
const styles = {
  container: {
    position: 'relative',
    width: '300px',
    fontFamily: 'Arial, sans-serif',
  },
  input: {
    width: '100%',
    padding: '8px',
    boxSizing: 'border-box',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    maxHeight: '200px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    overflow: 'auto',
    zIndex: 1000,
  },
  option: {
    padding: '8px',
    cursor: 'pointer',
  },
  optionHighlighted: {
    backgroundColor: '#f0f0f0',
  },
  loading: {
    padding: '8px',
    textAlign: 'center',
    color: '#999',
  },
  selectedItem: {
    display: 'inline-block',
    padding: '4px 8px',
    margin: '2px',
    backgroundColor: '#e0e0e0',
    borderRadius: '12px',
  },
  clearButton: {
    marginLeft: '8px',
    cursor: 'pointer',
    color: '#999',
  },
};

interface Option {
  value: string;
  label: string;
}

interface AsyncSelectProps {
  fetchOptions: (search: string) => Promise<Option[]>;
  multiple?: boolean;
  placeholder?: string;
  debounceTime?: number;
}

const AsyncSelect = ({
  fetchOptions, // Function to fetch options, should return a promise
  multiple, // Whether multiple selection is allowed
  placeholder,
  debounceTime, // Debounce time for search input
}: AsyncSelectProps) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef(null);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | undefined>(undefined);

  const ITEM_HEIGHT = 20; // 每项的固定高度
  const VISIBLE_COUNT = 5; // 可视区域显示的项数
  const totalHeight = options.length * ITEM_HEIGHT;

  // Fetch options when searchTerm changes
  useEffect(() => {
    setLoading(true);
    fetchOptions(searchTerm)
      .then((data) => {
        setOptions(data);
        setLoading(false);
        setScrollTop(0);
        if (listRef.current) {
          listRef.current.scrollTop = 0;
        }
      })
      .catch(() => {
        setOptions([]);
        setLoading(false);
      });
  }, [fetchOptions, searchTerm]);

  // Handle input change with debounce
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchTerm(value);
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    const timer = setTimeout(() => {
      // The fetchOptions effect will handle fetching
    }, debounceTime);
    setDebounceTimer(timer);
  };

  // Handle selection
  const handleSelect = (option: Option) => {
    if (multiple) {
      setSelectedOptions((prev) => {
        if (prev!.find((item) => item.value === option.value)) {
          return prev!.filter((item) => item.value !== option.value);
        }
        return [...prev!, option];
      });
    } else {
      setSelectedOptions([option]);
      setIsDropdownOpen(false);
    }
  };

  // Handle clear selection
  const handleClear = () => {
    setSelectedOptions([]);
  };

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle scroll for virtualization
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop((e.target as HTMLDivElement).scrollTop);
  };

  // Calculate visible options based on scrollTop
  const startIndex = Math.floor(scrollTop / ITEM_HEIGHT);
  const endIndex = Math.min(startIndex + VISIBLE_COUNT, options.length);
  const visibleData = options.slice(startIndex, endIndex);

  // Render selected options for multiple
  const renderSelected = () => {
    if (multiple && selectedOptions.length > 0) {
      return selectedOptions.map((option) => (
        <span key={option.value} style={styles.selectedItem}>
          {option.label}
        </span>
      ));
    }

    if (!multiple && selectedOptions && selectedOptions.length > 0) {
      return <span style={styles.selectedItem}>{selectedOptions[0].label}</span>;
    }
    return null;
  };

  return (
    <div style={styles.container as React.CSSProperties} ref={containerRef}>
      <div onClick={() => setIsDropdownOpen((prev) => !prev)}>
        {renderSelected()}
        <input
          type="text"
          ref={inputRef}
          style={styles.input as React.CSSProperties}
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => handleInputChange(e)}
          onFocus={() => setIsDropdownOpen(true)}
        />
        {(multiple || selectedOptions) && (
          <span style={styles.clearButton} onClick={handleClear}>
            ×
          </span>
        )}
      </div>
      {isDropdownOpen && (
        <div style={styles.dropdown as React.CSSProperties} onScroll={handleScroll} ref={listRef}>
          {loading ? (
            <div style={styles.loading as React.CSSProperties}>Loading...</div>
          ) : options.length === 0 ? (
            <div style={styles.loading as React.CSSProperties}>No options</div>
          ) : (
            <div
              style={{
                position: 'relative',
                height: totalHeight,
              }}
            >
              {visibleData.map((option, index) => {
                const optionIndex = startIndex + index;
                const isSelected = multiple
                  ? selectedOptions.find((item) => item.value === option.value)
                  : selectedOptions && selectedOptions.length > 0 && selectedOptions[0].value === option.value;
                return (
                  <div
                    key={option.value}
                    style={{
                      ...styles.option,
                      top: optionIndex * ITEM_HEIGHT,
                      position: 'absolute',
                      width: '100%',
                      backgroundColor: isSelected ? '#d0f0fd' : 'transparent',
                    }}
                    onClick={() => handleSelect(option)}
                  >
                    {option.label}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// 使用示例
const mockFetchOptions = (search: string) => {
  return new Promise<Option[]>((resolve) => {
    setTimeout(() => {
      const allOptions: Option[] = Array.from({ length: 1000 }, (_, i) => ({
        value: i.toString(),
        label: `Option ${i}`,
      }));
      const filtered = allOptions.filter((option) => option.label.toLowerCase().includes(search.toLowerCase()));
      resolve(filtered);
    }, 1000); // 模拟网络延迟
  });
};

const OriginalSelect: React.FC = () => {
  const allOptions: Option[] = Array.from({ length: 10000 }, (_, i) => ({
    value: i.toString(),
    label: `Option ${i}`,
  }));
  return (
    <select name="select1" size={1} autoComplete="">
      {allOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export const TestSelect = () => {
  return (
    <div style={{ padding: '50px' }}>
      <h2>Async Select Component Multiple</h2>
      <AsyncSelect fetchOptions={mockFetchOptions} multiple={true} placeholder="Select options..." />
      <h2>Async Select Component Single</h2>
      <AsyncSelect fetchOptions={mockFetchOptions} multiple={false} placeholder="Select one option..." />
      <h2>Original Select Component</h2>
      <OriginalSelect />
    </div>
  );
};
