import { Routes } from 'nest-router';
import { IssueModule } from './issue/issue.module';

export const routes: Routes = [
  {
    path: '',
    module: IssueModule,
  },
];
