import { Module } from '@nestjs/common';
import {  UserController } from './user.controller';
import { GatewayService } from './gateway.service';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { TaskController } from './task.controller';

@Module({
  imports: [],
  controllers: [UserController,TaskController],
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
    inject:[]},
  {  provide:"TASK_SERVICE",
    useFactory(){
      return ClientProxyFactory.create({
        transport:Transport.TCP,
        options:{
          port:4003,
          host:"0.0.0.0"
        }
      })
    },
    inject:[]}

],
})
export class GatewayModule {}
