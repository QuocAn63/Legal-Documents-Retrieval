import { Test, TestingModule } from '@nestjs/testing';
import { SharedConversationService } from './shared-conversation.service';

describe('SharedConversationService', () => {
  let service: SharedConversationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SharedConversationService],
    }).compile();

    service = module.get<SharedConversationService>(SharedConversationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
