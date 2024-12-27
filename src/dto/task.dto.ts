import { ApiProperty, ApiPropertyOptional, OmitType, PartialType } from "@nestjs/swagger";
import { TaskEnum } from "src/enum/task.enum";

export class TaskDto{
  @ApiProperty()
  title:string
  @ApiProperty()
  content:string

}

export class RemoveTaskDto extends OmitType(TaskDto,['content']){}
export class updatetaskDto {
  @ApiPropertyOptional()
  title:string
  @ApiPropertyOptional()
  content:string
  @ApiPropertyOptional({enum:TaskEnum,default:TaskEnum.Pending})
  status:string

}