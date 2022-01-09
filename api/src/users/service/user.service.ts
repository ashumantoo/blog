import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable, switchMap } from 'rxjs';
import { AuthService } from 'src/auth/service/auth.service';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserEntity } from '../models/user.entity';
import { IUser } from '../models/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    private readonly _authService: AuthService
  ) { }

  create(user: IUser): Observable<IUser> {
    return this._authService.hashPassword(user.password).pipe((
      switchMap((passwordHash: string) => {
        const newUser = new UserEntity();
        newUser.name = user.name;
        newUser.username = user.username;
        newUser.email = user.email;
        newUser.password = passwordHash;

        return from(this.userRepository.save(newUser)).pipe(
          map((user: UserEntity) => {
            const { password, ...result } = user;
            return result;
          })
        )
      })
    ))
  }

  findOne(id: string): Observable<IUser> {
    return from(this.userRepository.findOne(id)).pipe(
      map((user: IUser) => {
        const { password, ...result } = user;
        return result;
      })
    );
  }

  findAll(): Observable<IUser[]> {
    return from(this.userRepository.find()).pipe(
      map((users: IUser[]) => {
        users.forEach((user) => delete user.password);
        return users;
      })
    );
  }

  deleteOne(id: number): Observable<any> {
    return from(this.userRepository.delete(id));
  }

  updateOne(id: number, user: UserEntity): Observable<UpdateResult> {
    delete user.email;
    delete user.password;
    return from(this.userRepository.update(id, user));
  }

  login(user: IUser): Observable<string> {
    return this.validateUser(user.email, user.password).pipe(
      switchMap((user: IUser) => {
        if (user) {
          return this._authService.generateJwt(user).pipe(map((jwt: string) => jwt));
        } else {
          throw "Wrong Credentials";
        }
      })
    )
  }

  validateUser(email: string, password: string): Observable<IUser> {
    return this.findUserByEmail(email).pipe(
      switchMap((user: IUser) => this._authService.comparePassword(password, user.password).pipe(
        map((matched: boolean) => {
          if (matched) {
            const { password, ...result } = user;
            return result;
          } else {
            throw Error;
          }
        })
      ))
    )
  }

  findUserByEmail(email: string): Observable<IUser> {
    return from(this.userRepository.findOne({ email }));
  }
}
