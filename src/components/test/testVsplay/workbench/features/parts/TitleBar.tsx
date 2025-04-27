import { useWorkbenchStore } from '../../context/Store';

export function TitleBar() {
  const title = useWorkbenchStore((state) => state.titleBar.title);

  return <div>{`TitleBar title = ${title}`}</div>;
}
