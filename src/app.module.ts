import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IssueModule } from './issue/issue.module';

@Module({
  imports: [IssueModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
