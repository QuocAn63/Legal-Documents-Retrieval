import { Test, TestingModule } from '@nestjs/testing';
import { SharedConversationController } from './shared-conversation.controller';

describe('SharedConversationController', () => {
  let controller: SharedConversationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SharedConversationController],
    }).compile();

    controller = module.get<SharedConversationController>(SharedConversationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
