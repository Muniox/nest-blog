import { Test, TestingModule } from '@nestjs/testing';
import { AdminPostController } from './admin-post.controller';
import { AdminPostService } from '../services';

describe('PostController', () => {
  let controller: AdminPostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminPostController],
      providers: [AdminPostService],
    }).compile();

    controller = module.get<AdminPostController>(AdminPostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
