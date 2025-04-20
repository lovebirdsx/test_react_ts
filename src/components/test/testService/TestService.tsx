import React, { createContext, useContext, useState, useEffect } from 'react';
import { createStore, StoreApi, useStore } from 'zustand';

// #region platform/instantion/instantion.ts

interface IServiceAccessor {
  getService<T>(id: string): T;
}

class ServiceAccessor implements IServiceAccessor {
  private services: Record<string, any> = {};

  registerService<T>(id: string, service: T): void {
    this.services[id] = service;
  }

  getService<T>(id: string): T {
    return this.services[id];
  }
}

// #region platform/instantion/instantion.ts

// #region platform/file/FileService.ts

interface IFileService {
  readDir(path: string): Promise<string[]>;
  createFile(path: string, content: string): Promise<void>;
  deleteFile(path: string): Promise<void>;
}

const FileServiceId = 'fileService';

// #endregion platform/file/FileService.ts

// #region platform/file/node/FileService.ts

class FileService implements IFileService {
  readonly fileMap: Record<string, string> = {
    'file1.txt': 'file content 1',
    'file2.txt': 'file content 2',
  };

  async readDir(path: string): Promise<string[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Object.keys(this.fileMap));
      }, 100);
    });
  }

  async createFile(path: string, content: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (path.includes('error')) {
          reject(new Error('Failed to create file'));
          return;
        }
        (this.fileMap as Record<string, string>)[path] = content;
        resolve();
      }, 100);
    });
  }

  async deleteFile(path: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        delete (this.fileMap as Record<string, string>)[path];
        resolve();
      }, 100);
    });
  }
}

// #endregion platform/file/node/FileService.ts

// #region workbench/common/explorer/explorerSlice.ts

interface IExplorerState {
  cwd: string;
  files: string[];
  isLoading: boolean;
  error: string | null;
  addFile: (path: string, content: string) => Promise<void>;
  deleteFile: (path: string) => Promise<void>;
  loadFiles: () => Promise<void>;
}

// #endregion workbench/common/explorer/explorerSlice.ts

interface IExplorerDeps {
  fileService: IFileService;
}

const createExplorerStore = (deps: IExplorerDeps): StoreApi<IExplorerState> => {
  const { fileService } = deps;
  return createStore<IExplorerState>((set, get) => {
    const updateFiles = async () => {
      set({ isLoading: true, error: null });
      try {
        const files = await fileService.readDir(get().cwd);
        set({ files, isLoading: false });
      } catch (err) {
        set({ isLoading: false, error: err instanceof Error ? err.message : 'Failed to load files' });
      }
    };

    return {
      cwd: '/home/user',
      files: [],
      isLoading: false,
      error: null,
      loadFiles: updateFiles,
      addFile: async (path, content) => {
        set({ isLoading: true, error: null });
        try {
          await fileService.createFile(path, content);
          await updateFiles();
        } catch (err) {
          set({ isLoading: false, error: err instanceof Error ? err.message : 'Failed to add file' });
          throw err;
        }
      },
      deleteFile: async (path) => {
        set({ isLoading: true, error: null });
        try {
          await fileService.deleteFile(path);
          await updateFiles();
        } catch (err) {
          set({ isLoading: false, error: err instanceof Error ? err.message : 'Failed to delete file' });
          throw err;
        }
      },
    };
  });
};

const fileServiceInstance = new FileService();
const explorerStore = createExplorerStore({ fileService: fileServiceInstance });

const ExplorerContext = createContext<StoreApi<IExplorerState> | null>(null);

const ExplorerContextProvider = ({ children }: { children: React.ReactNode }) => {
  return <ExplorerContext.Provider value={explorerStore}>{children}</ExplorerContext.Provider>;
};

const useExplorerStore = <T,>(selector: (state: IExplorerState) => T): T => {
  const store = useContext(ExplorerContext);
  if (!store) {
    throw new Error('useExplorerStore must be used within an ExplorerProvider');
  }
  return useStore(store, selector);
};

function Explorer() {
  const cwd = useExplorerStore((state) => state.cwd);
  const files = useExplorerStore((state) => state.files);
  const isLoading = useExplorerStore((state) => state.isLoading);
  const error = useExplorerStore((state) => state.error);
  const addFile = useExplorerStore((state) => state.addFile);
  const deleteFile = useExplorerStore((state) => state.deleteFile);
  const loadFiles = useExplorerStore((state) => state.loadFiles);

  const [addFileName, setAddFileName] = useState('');
  const [addFileError, setAddFileError] = useState<string | null>(null);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const handleAddFile = async () => {
    if (!addFileName) return;
    if (files.includes(addFileName)) {
      setAddFileError(`File "${addFileName}" already exists.`);
      return;
    }
    setAddFileError(null);
    try {
      await addFile(addFileName, 'New file content');
      setAddFileName('');
    } catch (err) {
      setAddFileError(err instanceof Error ? err.message : 'Failed to add file');
      console.error('Add file error:', err);
    }
  };

  const handleDeleteFile = async (file: string) => {
    try {
      await deleteFile(file);
    } catch (err) {
      console.error('Delete file error:', err);
    }
  };

  return (
    <div>
      <h2>Current Directory: {cwd}</h2>
      <div>
        <input
          type="text"
          placeholder="File name"
          value={addFileName}
          onChange={(e) => {
            setAddFileName(e.target.value);
            setAddFileError(null);
          }}
          disabled={isLoading}
        />
        <button onClick={handleAddFile} disabled={isLoading || !addFileName}>
          {'Add File'}
        </button>
        {addFileError && <p style={{ color: 'red' }}>{addFileError}</p>}
      </div>

      {error && <p style={{ color: 'red' }}>Error loading files: {error}</p>}

      {isLoading && files.length === 0 && <p>Loading files...</p>}

      <ul>
        {files.map((file) => (
          <li key={file}>
            <button
              onClick={() => handleDeleteFile(file)}
              disabled={isLoading}
              style={{ marginRight: '5px', cursor: 'pointer' }}
            >
              x
            </button>
            {file}
          </li>
        ))}
      </ul>
      {isLoading && <p>Processing...</p>}
    </div>
  );
}

export function TestService() {
  return (
    <ExplorerContextProvider>
      <Explorer />
    </ExplorerContextProvider>
  );
}
