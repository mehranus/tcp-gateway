import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  const option= new DocumentBuilder()
  .setTitle("NestJS-microService")
  .setVersion("v1")
  .addBearerAuth({
    type:'http',
    bearerFormat:"JWT",
    in:'header',
    scheme:'bearer'
  },
  "Authorization"
).build()
const document=SwaggerModule.createDocument(app,option)
SwaggerModule.setup('/',app,document)
  await app.listen(6500,()=>{
    console.log('gateway: http://localhost:6500')
  });
}
bootstrap();
