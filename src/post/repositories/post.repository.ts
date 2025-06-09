import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { PostEntity } from '../entities';
import { PostRepositoryInterface } from '../interfaces';

@Injectable()
export class PostRepository
  extends Repository<PostEntity>
  implements PostRepositoryInterface {}
