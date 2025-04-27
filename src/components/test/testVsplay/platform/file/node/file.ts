import { registerSingleton } from '../../instantion/common/extension';
import { IFileService } from '../common/file';

class FileService implements IFileService {
  readonly _serviceBrand: undefined = undefined;

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

registerSingleton(IFileService, FileService, true);
