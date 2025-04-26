import { SiderBar } from './features/parts/siderBar';
import { TitleBar } from './features/parts/titleBar';

export function Workbench() {
  return (
    <div>
      <TitleBar />
      <SiderBar />
    </div>
  );
}
