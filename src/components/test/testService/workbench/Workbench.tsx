import { useWorkbenchStore } from './context/store';
import { SiderBar } from './features/parts/siderBar';
import { TitleBar } from './features/parts/titleBar';

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
