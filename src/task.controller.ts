import { Body, Controller, Get, HttpException, HttpStatus, Inject, InternalServerErrorException, Post, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { LoginDto, SignUpDto } from './dto/user.dto';
import { catchError, lastValueFrom } from 'rxjs';
import { Auth } from './decorator/auth.decorator';
import { Request } from 'express';
import { TaskDto } from './dto/task.dto';


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


}
