import { ApiProperty, OmitType } from "@nestjs/swagger";

export class SignUpDto{
  @ApiProperty()
  name:string
  
  @ApiProperty()
  email:string
  @ApiProperty()
  password:string

}

export class LoginDto extends OmitType(SignUpDto,['name']){}