import { useState, useEffect } from 'react';

interface TestArrayProps {
  hobbies: string[];
  onModify: (hobbies: string[]) => void;
}

function Array(props: TestArrayProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; index: number } | null>(null);
  const [copiedHobby, setCopiedHobby] = useState<string | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDrop = (index: number) => {
    if (draggedIndex !== null) {
      const updatedHobbies = [...props.hobbies];
      const [removed] = updatedHobbies.splice(draggedIndex, 1);
      updatedHobbies.splice(index, 0, removed);
      props.onModify(updatedHobbies);
      setDraggedIndex(null);
    }
  };

  const handleContextMenu = (event: React.MouseEvent, index: number) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, index });
  };

  const handleCut = () => {
    if (contextMenu !== null) {
      setCopiedHobby(props.hobbies[contextMenu.index]);
      const updatedHobbies = [...props.hobbies];
      updatedHobbies.splice(contextMenu.index, 1);
      props.onModify(updatedHobbies);
      setContextMenu(null);
    }
  };

  const handlePaste = () => {
    if (contextMenu !== null && copiedHobby) {
      const updatedHobbies = [...props.hobbies];
      updatedHobbies.splice(contextMenu.index, 0, copiedHobby);
      props.onModify(updatedHobbies);
      setCopiedHobby(null); // Optionally clear the clipboard after pasting
      setContextMenu(null);
    }
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  // Close the context menu when clicking outside
  useEffect(() => {
    const handleClick = () => handleCloseContextMenu();
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div>
      {props.hobbies.map((hobby, idx) => (
        <div
          key={idx}
          draggable
          onDragStart={() => handleDragStart(idx)}
          onDragOver={(e) => e.preventDefault()} // Required to allow drop
          onDrop={() => handleDrop(idx)}
          onContextMenu={(e) => handleContextMenu(e, idx)}
          style={{ padding: '8px', border: '1px solid #ccc', margin: '4px 0', cursor: 'pointer' }}
        >
          {hobby}
        </div>
      ))}

      {contextMenu && (
        <div
          style={{
            position: 'absolute',
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`,
            backgroundColor: 'white',
            border: '1px solid #ccc',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            zIndex: 1000,
          }}
        >
          <div onClick={handleCut} style={{ padding: '8px', cursor: 'pointer' }}>
            Cut
          </div>
          <div
            onClick={handlePaste}
            style={{ padding: '8px', cursor: 'pointer', color: copiedHobby ? 'black' : 'gray' }}
          >
            Paste
          </div>
        </div>
      )}
    </div>
  );
}

export function TestArray() {
  const [hobbies, setHobbies] = useState([
    'swimming',
    'reading',
    'jogging',
    'playing guitar',
    'watching movies',
    'playing video games',
    'cooking',
    'travel',
    'photography',
    'painting',
    'dancing',
    'singing',
    'writing',
    'coding',
    'gardening',
    'fishing',
    'camping',
    'hiking',
    'skiing',
    'snowboarding',
    'skateboarding',
  ]);

  return <Array hobbies={hobbies} onModify={setHobbies} />;
}
