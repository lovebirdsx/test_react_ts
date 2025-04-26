import { useWorkbenchStore } from '../../context/store';

export function TitleBar() {
  const title = useWorkbenchStore((state) => state.titleBar.title);
  const setTitle = useWorkbenchStore((state) => state.titleBar.setTitle);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
  };

  return (
    <div>
      <input type="text" value={title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Enter title" />
    </div>
  );
}
