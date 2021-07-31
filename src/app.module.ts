import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IssueModule } from './issue/issue.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import {routes} from './routes'
import { RouterModule } from 'nest-router';

@Module({
  imports: [
    IssueModule,
    DatabaseModule,
    ConfigModule.forRoot(),
    RouterModule.forRoutes(routes),
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
