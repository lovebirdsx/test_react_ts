import { useWorkbenchStore } from './context/Store';
import { SiderBar } from './features/parts/SiderBar';
import { TitleBar } from './features/parts/TitleBar';

export function Workbench() {
  const id = useWorkbenchStore((state) => state.id);
  return (
    <div>
      <h3>Workbench {id}</h3>
      <TitleBar />
      <SiderBar />
    </div>
  );
}
