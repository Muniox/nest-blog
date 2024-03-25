import { Test, TestingModule } from '@nestjs/testing';
import { AdminPanelPostController } from './admin-panel-post.controller';
import { AdminPanelPostService } from '../services';

describe('PostController', () => {
  let controller: AdminPanelPostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminPanelPostController],
      providers: [AdminPanelPostService],
    }).compile();

    controller = module.get<AdminPanelPostController>(AdminPanelPostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
