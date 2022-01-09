import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { IUser } from '../models/user.interface';
import { catchError, map, Observable, of } from 'rxjs';
import { UserEntity } from '../models/user.entity';
import { UpdateResult } from 'typeorm';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) { }

  @Post()
  createOne(@Body() user: UserEntity): Observable<IUser | object> {
    return this.userService.create(user).pipe(
      map((user: IUser) => user),
      catchError(err => of({ error: err.message }))
    );
  }

  @Post('login')
  login(@Body() user: IUser): Observable<Object> {
    return this.userService.login(user).pipe(
      map((jwt: string) => {
        return { access_token: jwt };
      })
    )
  }

  @Get(":id")
  findOne(@Param() params): Observable<IUser> {
    return this.userService.findOne(params.id);
  }

  @Get()
  findAll(): Observable<IUser[]> {
    return this.userService.findAll();
  }

  @Delete(":id")
  delete(@Param("id") id: string): Observable<any> {
    return this.userService.deleteOne(Number(id))
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() user: UserEntity): Observable<UpdateResult> {
    return this.userService.updateOne(Number(id), user);
  }
}
