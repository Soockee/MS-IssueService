import { Connection, Repository } from 'typeorm';
import { Issue } from './entities/issue.entity'

export const IssueProviders = [
    {  
        provide: 'ISSUE_REPOSITORY',
        useFactory: (connection: Connection) => connection.getRepository(Issue),
        inject: ['DATABASE_CONNECTION'],
    },
]
