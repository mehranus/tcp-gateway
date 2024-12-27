import { Body, Controller, Delete, Get, HttpException, Inject, InternalServerErrorException, Post, Put, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

import { catchError, lastValueFrom } from 'rxjs';
import { Auth } from './decorator/auth.decorator';
import { Request } from 'express';
import { RemoveTaskDto, TaskDto, updatetaskDto } from './dto/task.dto';



@Controller('task')
@ApiTags("Task")
export class TaskController {
  constructor(
    @Inject("TASK_SERVICE") private readonly  taskClinetService:ClientProxy,

  ) {}

  @Post('create')
  @Auth()
  @ApiConsumes('application/x-www-form-urlencoded')
   async create(@Body() createDto:TaskDto,@Req() req:Request){
    const respons=await lastValueFrom(
      this.taskClinetService.send("create_task",{
        title:createDto.title,
        content:createDto.content,
        userId:req.user?._id
      })
    )
    if(respons?.error){
      throw new HttpException(respons?.message,respons?.status ?? 500)
    }
    return {
      message:respons?.message,
      data:respons?.data
    }
  }
  @Get('user')
  @Auth()
  @ApiConsumes('application/x-www-form-urlencoded')
   async userTask(@Req() req:Request){
    const respons=await lastValueFrom(
      this.taskClinetService.send("user_task",{userId:req.user?._id})
    )

    return respons?.data ?? {data:[]}
  }
  @Delete('delete')
  @Auth()
  @ApiConsumes('application/x-www-form-urlencoded')
   async deleteTask(@Body() removeDto:RemoveTaskDto){
    const respons=await lastValueFrom(
      this.taskClinetService.send("delete_task",{title:removeDto.title}).pipe((
        catchError(err=>{
          throw err
        })
    ))
  )
  if(respons?.error) throw new HttpException(respons?.message,respons?.status || InternalServerErrorException)
    
    return respons?.message

  
  }
  @Put('update')
  @Auth()
  @ApiConsumes('application/x-www-form-urlencoded')
   async updateTask(@Body() updateDto:updatetaskDto,@Req() req:Request){
  
    const respons=await lastValueFrom(
      this.taskClinetService.send("update_task",{
        title:updateDto.title,
        content:updateDto.content,
        status:updateDto.status,
        userId:req.user?._id}).pipe((
        catchError(err=>{
          throw err
        })
    ))
  )
 
  if(respons?.error) throw new HttpException(respons?.message,respons?.status || InternalServerErrorException)
    
    return {
     message: respons?.message,
     data: respons?.data
    }

  
  }


}
