import { ApiProperty, OmitType } from "@nestjs/swagger";

export class TaskDto{
  @ApiProperty()
  title:string
  @ApiProperty()
  content:string

}

export class RemoveTaskDto extends OmitType(TaskDto,['content']){}