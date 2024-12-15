import { Body, Controller, HttpException, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiConsumes } from '@nestjs/swagger';
import { SignUpDto } from './dto/user.dto';
import { catchError, lastValueFrom } from 'rxjs';


@Controller('user')
export class UserController {
  constructor(
    @Inject("USER_SERVICE") private readonly  userClinetService:ClientProxy
  ) {}

  @Post('signup')
  @ApiConsumes('application/x-www-form-urlencoded')
   async signup(@Body() signupDto:SignUpDto){
    const respons=await lastValueFrom(
      this.userClinetService.send("signup",signupDto).pipe((
        catchError(err=>{
          throw err
        })
      ))
    )
    if(respons?.error){
      throw new HttpException(respons?.message,respons?.status ?? 500)
    }
    return respons
  }


}
