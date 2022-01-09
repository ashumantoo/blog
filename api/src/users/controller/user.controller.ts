import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { IUser } from '../models/user.interface';
import { Observable } from 'rxjs';
import { UserEntity } from '../models/user.entity';
import { UpdateResult } from 'typeorm';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

    @Post()
    createOne(@Body() user: UserEntity): Observable<UserEntity> {
        return this.userService.create(user);
    }

    @Get(":id")
    findOne(@Param() params): Observable<UserEntity> {
        return this.userService.findOne(params.id);
    }

    @Get()
    findAll(): Observable<UserEntity[]> {
        return this.userService.findAll();
    }

    @Delete(":id")
    delete(@Param("id") id: string): Observable<any> {
        return this.userService.deleteOne(Number(id))
    }

    @Put(":id")
    update(@Param("id") id: string,@Body() user: UserEntity): Observable<UpdateResult> {
        return this.userService.updateOne(Number(id), user);
    }
}
