import { Body, Controller, Get, HttpException, HttpStatus, Inject, InternalServerErrorException, Post, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { LoginDto, SignUpDto } from './dto/user.dto';
import { catchError, lastValueFrom } from 'rxjs';
import { Auth } from './decorator/auth.decorator';
import { Request } from 'express';


@Controller('user')
@ApiTags("User")
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
  @Post('login')
  @ApiConsumes('application/x-www-form-urlencoded')
   async login(@Body() loginDto:LoginDto){
    const respons=await lastValueFrom(
      this.userClinetService.send("login",loginDto).pipe((
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


  @Get("check_login")
  @Auth()
  getUser(@Req() req:Request){
    return req?.user
  }
  @Get("logout")
  @Auth()
  async logoutUser(@Req() req:Request){
   const {_id}=req?.user
   const response=await lastValueFrom(
    this.tokenClinetService.send("destroy_token",{userId:_id})
   )

   if(response?.error){
    throw new HttpException(response?.message,response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR)
   }
   return{
    message:response?.message,
    status:response?.status
   }

  }

}
