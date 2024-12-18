import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { HttpArgumentsHost } from "@nestjs/common/interfaces";
import { ClientProxy } from "@nestjs/microservices";
import { Request } from "express";
import { lastValueFrom, Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject("USER_SERVICE") private readonly userClinetService: ClientProxy,
    @Inject("TOKEN_SERVICE") private readonly tokenClinetService: ClientProxy
  ) {}

 async canActivate(context: ExecutionContext) {
    const httpContext:HttpArgumentsHost=context.switchToHttp()
    const req:Request=httpContext.getRequest()
    const {authorization = undefined}=req.headers

    if(!authorization) throw new UnauthorizedException("authorization headers is requierd")
    const [bearer,token]=authorization?.split(' ') 
   if(!bearer || bearer.toLowerCase() !== "bearer")  throw new UnauthorizedException("bearer token is incorent")
   if(!token)  throw new UnauthorizedException("token is requierd!")
   const verifyUserRespons=await lastValueFrom(
  this.tokenClinetService.send('verify_token',token)
  ) 
  if(verifyUserRespons?.error || !verifyUserRespons){
   
     throw new HttpException(verifyUserRespons?.message,verifyUserRespons?.status)
    
  }

  const {data}=verifyUserRespons

  if(!data || !data?.userId) throw new UnauthorizedException("user account not found!")
  const userRespouns=await lastValueFrom(
  this.userClinetService.send("get_user_by_id",{userId:data?.userId})
  )  

  if(userRespouns?.error || !userRespouns){
    throw new HttpException(userRespouns?.message,userRespouns?.status)
  }
  const {user = undefined}=userRespouns?.data

  if(!user) throw new UnauthorizedException("user account not found!")
   
    req.user=user


    return true;
  }
}
