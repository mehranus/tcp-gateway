import { Body, Controller, Delete, Get, HttpException, HttpStatus, Inject, InternalServerErrorException, Post, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { LoginDto, SignUpDto } from './dto/user.dto';
import { catchError, lastValueFrom } from 'rxjs';
import { Auth } from './decorator/auth.decorator';
import { Request } from 'express';
import { RemoveTaskDto, TaskDto } from './dto/task.dto';
import { title } from 'process';


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


}
