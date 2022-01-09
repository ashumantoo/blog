import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserEntity } from '../models/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
    ) { }

    create(user: UserEntity): Observable<UserEntity> {
        return from(this.userRepository.save(user));
    }

    findOne(id: string): Observable<UserEntity> {
        return from(this.userRepository.findOne(id));
    }

    findAll(): Observable<UserEntity[]> {
        return from(this.userRepository.find());
    }

    deleteOne(id: number): Observable<any> {
        return from(this.userRepository.delete(id));
    }

    updateOne(id: number, user: UserEntity): Observable<UpdateResult> {
        return from(this.userRepository.update(id, user));
    }
}
