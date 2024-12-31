import { Module } from '@nestjs/common';
import {  UserController } from './user.controller';
import { GatewayService } from './gateway.service';
import { ClientProxyFactory, RmqOptions, Transport } from '@nestjs/microservices';
import { TaskController } from './task.controller';

@Module({
  imports: [],
  controllers: [UserController,TaskController],
  providers: [GatewayService,{
    provide:"USER_SERVICE",
    useFactory(){
      return ClientProxyFactory.create({
        transport:Transport.RMQ,
        options:{
         urls:["amqp://localhost:5672"],
         queue:"user-queue",
         queueOptions:{}
        }
       } as RmqOptions)
    },
    inject:[],
    
  },
  {  provide:"TOKEN_SERVICE",
    useFactory(){
      return ClientProxyFactory.create({
        transport:Transport.RMQ,
        options:{
         urls:["amqp://localhost:5672"],
         queue:"token-queue",
         queueOptions:{}
        }
       } as RmqOptions)
    },
    inject:[]},
  {  provide:"TASK_SERVICE",
    useFactory(){
      return ClientProxyFactory.create({
        transport:Transport.RMQ,
        options:{
         urls:["amqp://localhost:5672"],
         queue:"task-queue",
         queueOptions:{}
        }
       } as RmqOptions)
    },
    inject:[]}

],
})
export class GatewayModule {}
