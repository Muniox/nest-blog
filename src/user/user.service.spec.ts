import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserRoleEntity } from './entities/user-role.entity';
import { ConflictException } from '@nestjs/common';
import { PostEntity } from '../post/entities/post.entity';

describe('UserService', () => {
  let service: UserService;

  // const user = {
  //   createdAt: new Date(),
  //   email: 'test@isemail.com',
  //   hash: 'secret password',
  //   id: 'sdfghsdfghdsfh',
  //   role: {} as UserRoleEntity,
  //   posts: [] as PostEntity[],
  //   hashedRT: 'sdfsdfsdf',
  //   updatedAt: new Date(),
  // };

  const mockUserRepository = {
    findOne: jest.fn().mockImplementation(),
    save: jest.fn().mockImplementation((user) => Promise.resolve(user)),
  };
  const mockUserRoleRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(UserRoleEntity),
          useValue: mockUserRoleRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw error if user exist', async () => {
      jest
        .spyOn(service, 'findUserByEmail')
        .mockResolvedValue({} as UserEntity);

      await expect(
        service.create({
          email: 'test@isemail.com',
          password: 'secret password',
        }),
      ).rejects.toBeInstanceOf(ConflictException);

      await expect(
        service.create({
          email: 'test@isemail.com',
          password: 'secret password',
        }),
      ).rejects.toThrowError(new ConflictException(`User already exists`));
    });
  });
});
