import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { catchError, from, map, Observable, throwError } from 'rxjs';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class FileExistGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const filename = req.body.filename;

    const pathFile = path.join(process.cwd(), 'storage', `${filename}`);

    return from(fs.readFile(pathFile)).pipe(
      map(() => true),
      catchError((err) => {
        if (err.code === 'ENOENT')
          return throwError(() => new ForbiddenException("File dosen't exist"));
        throw err;
      }),
    );
  }
}
