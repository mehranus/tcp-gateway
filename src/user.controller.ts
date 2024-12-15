import { Body, Controller, HttpException, Inject, InternalServerErrorException, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiConsumes } from '@nestjs/swagger';
import { SignUpDto } from './dto/user.dto';
import { catchError, lastValueFrom } from 'rxjs';


@Controller('user')
export class UserController {
  constructor(
    @Inject("USER_SERVICE") private readonly  userClinetService:ClientProxy,
    @Inject("TOKEN_SERVICE") private readonly  tokenClinetService:ClientProxy,
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
    if(respons?.data){
      const responsToken=await lastValueFrom(
        this.tokenClinetService.send("create_token_user",{userId:respons?.data?.userId,email:respons?.data?.email})
      )
      if(responsToken?.data?.token){
        return{
          token:responsToken?.data?.token
        }
      }
    }
     throw new InternalServerErrorException("some service in missing")
  }


}
