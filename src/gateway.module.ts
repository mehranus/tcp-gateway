import { Module } from '@nestjs/common';
import {  UserController } from './user.controller';
import { GatewayService } from './gateway.service';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [GatewayService,{
    provide:"USER_SERVICE",
    useFactory(){
      return ClientProxyFactory.create({
        transport:Transport.TCP,
        options:{
          port:4001,
          host:"0.0.0.0"
        }
      })
    },
    inject:[],
    
  },
  {  provide:"TOKEN_SERVICE",
    useFactory(){
      return ClientProxyFactory.create({
        transport:Transport.TCP,
        options:{
          port:4002,
          host:"0.0.0.0"
        }
      })
    },
    inject:[]}

],
})
export class GatewayModule {}
