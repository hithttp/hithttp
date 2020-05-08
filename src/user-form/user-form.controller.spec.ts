import { Test, TestingModule } from '@nestjs/testing';
import { UserFormController } from './user-form.controller';

describe('UserForm Controller', () => {
  let controller: UserFormController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserFormController],
    }).compile();

    controller = module.get<UserFormController>(UserFormController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
