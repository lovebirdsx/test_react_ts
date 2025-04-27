import { useState } from 'react';
import { IStorageService } from './platform/storage/storage';
import { Workbench } from './workbench/Workbench';
import { ServiceProvider, useService } from './workbench/context/Service';
import { WorkbenchStoreProvider } from './workbench/context/Store';

function Tester() {
  const accessor = useService();
  const storage = accessor.get(IStorageService);
  const [title, setTitle] = useState(storage.get('workbench', 'title', 'Default Title'));

  return (
    <div>
      <h3>Tester</h3>
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <button
          onClick={() => {
            storage.set('workbench', 'title', title);
          }}
        >
          Update Title
        </button>
      </div>
    </div>
  );
}

export function TestVsplay() {
  return (
    <ServiceProvider>
      <WorkbenchStoreProvider>
        <Workbench />
      </WorkbenchStoreProvider>
      <Tester />
    </ServiceProvider>
  );
}
