import { FileExistGuard } from './file-exist.guard';

describe('FileExistGuard', () => {
  it('should be defined', () => {
    expect(new FileExistGuard()).toBeDefined();
  });
});
