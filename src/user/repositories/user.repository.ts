import { Injectable } from '@nestjs/common';

import { Repository } from 'typeorm';
import { UserEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {
    super(
      userRepository.target,
      userRepository.manager,
      userRepository.queryRunner,
    );
  }
}
