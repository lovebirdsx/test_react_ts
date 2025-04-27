import { createDecorator } from '../../instantion/common/instantion';

export interface IFileService {
  readonly _serviceBrand: undefined;

  readDir(path: string): Promise<string[]>;
  createFile(path: string, content: string): Promise<void>;
  deleteFile(path: string): Promise<void>;
}

export const IFileService = createDecorator<IFileService>('fileService');
