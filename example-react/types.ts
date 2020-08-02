export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    Date: any;
    BasicType: any;
    JSONType: any;
};


export type Query = {
    __typename?: 'Query';
    me: User;
    user?: Maybe<User>;
    allUsers?: Maybe<Array<Maybe<User>>>;
    search: Array<SearchResult>;
    myChats: Array<Chat>;
    Account?: Maybe<AccountQuery>;
    Project?: Maybe<ProjectQuery>;
    Task?: Maybe<TaskQuery>;
    User?: Maybe<UserQuery>;
    _metadataList?: Maybe<Array<Maybe<GqlMetaData>>>;
    _metadataMap?: Maybe<Scalars['JSONType']>;
    _typeNameMap?: Maybe<Scalars['JSONType']>;
    _metadata?: Maybe<GqlMetaData>;
};


export type QueryUserArgs = {
    id: Scalars['ID'];
};


export type QuerySearchArgs = {
    term: Scalars['String'];
};


export type Query_MetadataArgs = {
    name: GqlAdapterEnum;
};

export enum Role {
    User = 'USER',
    Admin = 'ADMIN'
}

export type Node = {
    id: Scalars['ID'];
};

export type SearchResult = User | Chat | ChatMessage;

export type User = Node & {
    __typename?: 'User';
    id: Scalars['ID'];
    username: Scalars['String'];
    email: Scalars['String'];
    role: Role;
    name: Scalars['String'];
    createdAt: Scalars['Date'];
    updatedAt: Scalars['Date'];
    _fn?: Maybe<Scalars['BasicType']>;
    _col?: Maybe<Scalars['BasicType']>;
    projects?: Maybe<Array<Maybe<Project>>>;
    tasks?: Maybe<Array<Maybe<Task>>>;
};


export type User_FnArgs = {
    fn: Scalars['String'];
    as?: Maybe<Scalars['String']>;
    args: Scalars['BasicType'];
};


export type User_ColArgs = {
    name: Scalars['String'];
    as?: Maybe<Scalars['String']>;
};


export type UserProjectsArgs = {
    limit?: Maybe<Scalars['Int']>;
    where?: Maybe<Scalars['JSONType']>;
    subQuery?: Maybe<Scalars['Boolean']>;
    order?: Maybe<Array<Maybe<ProjectOrderType>>>;
    groupBy?: Maybe<Scalars['BasicType']>;
    right?: Maybe<Scalars['Boolean']>;
    required?: Maybe<Scalars['Boolean']>;
    separate?: Maybe<Scalars['Boolean']>;
    duplicating?: Maybe<Scalars['Boolean']>;
    on?: Maybe<Scalars['JSONType']>;
};


export type UserTasksArgs = {
    limit?: Maybe<Scalars['Int']>;
    where?: Maybe<Scalars['JSONType']>;
    subQuery?: Maybe<Scalars['Boolean']>;
    order?: Maybe<Array<Maybe<TaskOrderType>>>;
    groupBy?: Maybe<Scalars['BasicType']>;
    right?: Maybe<Scalars['Boolean']>;
    required?: Maybe<Scalars['Boolean']>;
    duplicating?: Maybe<Scalars['Boolean']>;
    on?: Maybe<Scalars['JSONType']>;
};

export type Chat = Node & {
    __typename?: 'Chat';
    id: Scalars['ID'];
    users: Array<User>;
    messages: Array<ChatMessage>;
};

export type ChatMessage = Node & {
    __typename?: 'ChatMessage';
    id: Scalars['ID'];
    content: Scalars['String'];
    time: Scalars['Date'];
    user: User;
};

export type Account = {
    __typename?: 'Account';
    uuid: Scalars['ID'];
    name?: Maybe<Scalars['String']>;
    age?: Maybe<Scalars['Int']>;
    describe?: Maybe<Scalars['JSONType']>;
    active?: Maybe<Scalars['Boolean']>;
    balance?: Maybe<Scalars['String']>;
    createdAt: Scalars['Date'];
    updatedAt: Scalars['Date'];
    _fn?: Maybe<Scalars['BasicType']>;
    _col?: Maybe<Scalars['BasicType']>;
};


export type Account_FnArgs = {
    fn: Scalars['String'];
    as?: Maybe<Scalars['String']>;
    args: Scalars['BasicType'];
};


export type Account_ColArgs = {
    name: Scalars['String'];
    as?: Maybe<Scalars['String']>;
};

export type AccountCreateInput = {
    uuid?: Maybe<Scalars['ID']>;
    name?: Maybe<Scalars['String']>;
    age?: Maybe<Scalars['Int']>;
    describe?: Maybe<Scalars['JSONType']>;
    active?: Maybe<Scalars['Boolean']>;
    balance?: Maybe<Scalars['String']>;
};

export enum AccountFieldEnum {
    All = '_all',
    Uuid = 'uuid',
    Name = 'name',
    Age = 'age',
    Describe = 'describe',
    Active = 'active',
    Balance = 'balance',
    CreatedAt = 'createdAt',
    UpdatedAt = 'updatedAt'
}

export type AccountMutation = {
    __typename?: 'AccountMutation';
    create?: Maybe<Account>;
    update?: Maybe<Account>;
    remove?: Maybe<Scalars['Boolean']>;
};


export type AccountMutationCreateArgs = {
    data: AccountCreateInput;
};


export type AccountMutationUpdateArgs = {
    data: AccountUpdateInput;
    uuid: Scalars['ID'];
};


export type AccountMutationRemoveArgs = {
    uuid: Scalars['ID'];
};

export type AccountOrderType = {
    name: AccountFieldEnum;
    sort?: Maybe<SortType>;
};

export type AccountQuery = {
    __typename?: 'AccountQuery';
    one?: Maybe<Account>;
    list?: Maybe<Array<Maybe<Account>>>;
    aggregate?: Maybe<Scalars['BasicType']>;
};


export type AccountQueryOneArgs = {
    uuid?: Maybe<Scalars['String']>;
    scope?: Maybe<Array<Maybe<Scalars['String']>>>;
    where?: Maybe<Scalars['JSONType']>;
    order?: Maybe<Array<Maybe<AccountOrderType>>>;
};


export type AccountQueryListArgs = {
    scope?: Maybe<Array<Maybe<Scalars['String']>>>;
    limit?: Maybe<Scalars['Int']>;
    where?: Maybe<Scalars['JSONType']>;
    offset?: Maybe<Scalars['Int']>;
    subQuery?: Maybe<Scalars['Boolean']>;
    having?: Maybe<Scalars['JSONType']>;
    order?: Maybe<Array<Maybe<AccountOrderType>>>;
    groupBy?: Maybe<Scalars['BasicType']>;
};


export type AccountQueryAggregateArgs = {
    fn: AggregateMenu;
    field: AccountFieldEnum;
    where?: Maybe<Scalars['JSONType']>;
};

export type AccountUpdateInput = {
    name?: Maybe<Scalars['String']>;
    age?: Maybe<Scalars['Int']>;
    describe?: Maybe<Scalars['JSONType']>;
    active?: Maybe<Scalars['Boolean']>;
    balance?: Maybe<Scalars['String']>;
};

export enum AggregateMenu {
    Sum = 'SUM',
    Max = 'MAX',
    Min = 'MIN',
    Count = 'COUNT',
    Avg = 'AVG'
}


export type FieldMetaData = {
    __typename?: 'FieldMetaData';
    type: Scalars['String'];
    dataType?: Maybe<Scalars['String']>;
    name: Scalars['String'];
    description?: Maybe<Scalars['String']>;
    title?: Maybe<Scalars['String']>;
    allowNull: Scalars['Boolean'];
    isPk?: Maybe<Scalars['Boolean']>;
    isList: Scalars['Boolean'];
    sortable: Scalars['Boolean'];
    editable: Scalars['Boolean'];
    createAble: Scalars['Boolean'];
    validate?: Maybe<Scalars['JSONType']>;
};

export enum GqlAdapterEnum {
    Account = 'Account',
    Project = 'Project',
    Task = 'Task',
    User = 'User'
}

export type GqlMetaData = {
    __typename?: 'GqlMetaData';
    name: Scalars['String'];
    type: Scalars['String'];
    pkName?: Maybe<Scalars['String']>;
    title?: Maybe<Scalars['String']>;
    fields?: Maybe<Array<Maybe<FieldMetaData>>>;
    description?: Maybe<Scalars['String']>;
    editable: Scalars['Boolean'];
    createAble: Scalars['Boolean'];
    removeAble: Scalars['Boolean'];
};


export type Mutation = {
    __typename?: 'Mutation';
    Account?: Maybe<AccountMutation>;
    Project?: Maybe<ProjectMutation>;
    Task?: Maybe<TaskMutation>;
    User?: Maybe<UserMutation>;
    openServer?: Maybe<Scalars['Boolean']>;
};


export type MutationOpenServerArgs = {
    path: Scalars['String'];
};

export type Project = {
    __typename?: 'Project';
    id: Scalars['ID'];
    title: Scalars['String'];
    over?: Maybe<Scalars['Boolean']>;
    createdAt: Scalars['Date'];
    updatedAt: Scalars['Date'];
    ownerId?: Maybe<Scalars['Int']>;
    _fn?: Maybe<Scalars['BasicType']>;
    _col?: Maybe<Scalars['BasicType']>;
    user?: Maybe<User>;
};


export type Project_FnArgs = {
    fn: Scalars['String'];
    as?: Maybe<Scalars['String']>;
    args: Scalars['BasicType'];
};


export type Project_ColArgs = {
    name: Scalars['String'];
    as?: Maybe<Scalars['String']>;
};


export type ProjectUserArgs = {
    right?: Maybe<Scalars['Boolean']>;
    required?: Maybe<Scalars['Boolean']>;
    duplicating?: Maybe<Scalars['Boolean']>;
    on?: Maybe<Scalars['JSONType']>;
};

export type ProjectCreateInput = {
    title: Scalars['String'];
    over?: Maybe<Scalars['Boolean']>;
    ownerId?: Maybe<Scalars['Int']>;
    user?: Maybe<UserCreateInput>;
};

export enum ProjectFieldEnum {
    All = '_all',
    Id = 'id',
    Title = 'title',
    Over = 'over',
    CreatedAt = 'createdAt',
    UpdatedAt = 'updatedAt',
    OwnerId = 'ownerId'
}

export type ProjectMutation = {
    __typename?: 'ProjectMutation';
    create?: Maybe<Project>;
    update?: Maybe<Project>;
    remove?: Maybe<Scalars['Boolean']>;
};


export type ProjectMutationCreateArgs = {
    data: ProjectCreateInput;
};


export type ProjectMutationUpdateArgs = {
    data: ProjectUpdateInput;
    id: Scalars['ID'];
};


export type ProjectMutationRemoveArgs = {
    id: Scalars['ID'];
};

export type ProjectOrderType = {
    name: ProjectFieldEnum;
    sort?: Maybe<SortType>;
};

export type ProjectQuery = {
    __typename?: 'ProjectQuery';
    one?: Maybe<Project>;
    list?: Maybe<Array<Maybe<Project>>>;
    aggregate?: Maybe<Scalars['BasicType']>;
};


export type ProjectQueryOneArgs = {
    id?: Maybe<Scalars['Int']>;
    scope?: Maybe<Array<Maybe<Scalars['String']>>>;
    where?: Maybe<Scalars['JSONType']>;
    order?: Maybe<Array<Maybe<ProjectOrderType>>>;
};


export type ProjectQueryListArgs = {
    scope?: Maybe<Array<Maybe<Scalars['String']>>>;
    limit?: Maybe<Scalars['Int']>;
    where?: Maybe<Scalars['JSONType']>;
    offset?: Maybe<Scalars['Int']>;
    subQuery?: Maybe<Scalars['Boolean']>;
    having?: Maybe<Scalars['JSONType']>;
    order?: Maybe<Array<Maybe<ProjectOrderType>>>;
    groupBy?: Maybe<Scalars['BasicType']>;
};


export type ProjectQueryAggregateArgs = {
    fn: AggregateMenu;
    field: ProjectFieldEnum;
    where?: Maybe<Scalars['JSONType']>;
};

export type ProjectUpdateInput = {
    title?: Maybe<Scalars['String']>;
    over?: Maybe<Scalars['Boolean']>;
    ownerId?: Maybe<Scalars['Int']>;
};

export enum SortType {
    Asc = 'asc',
    Desc = 'desc'
}

export type Subscription = {
    __typename?: 'Subscription';
    Account?: Maybe<Account>;
    Project?: Maybe<Project>;
    Task?: Maybe<Task>;
    User?: Maybe<User>;
};


export type SubscriptionAccountArgs = {
    uuid?: Maybe<Scalars['ID']>;
    name?: Maybe<Scalars['String']>;
    age?: Maybe<Scalars['Int']>;
    describe?: Maybe<Scalars['JSONType']>;
    active?: Maybe<Scalars['Boolean']>;
    balance?: Maybe<Scalars['String']>;
    createdAt?: Maybe<Scalars['Date']>;
    updatedAt?: Maybe<Scalars['Date']>;
    triggerType: TriggerEnum;
};


export type SubscriptionProjectArgs = {
    id?: Maybe<Scalars['ID']>;
    title?: Maybe<Scalars['String']>;
    over?: Maybe<Scalars['Boolean']>;
    createdAt?: Maybe<Scalars['Date']>;
    updatedAt?: Maybe<Scalars['Date']>;
    ownerId?: Maybe<Scalars['Int']>;
    triggerType: TriggerEnum;
};


export type SubscriptionTaskArgs = {
    id?: Maybe<Scalars['ID']>;
    name?: Maybe<Scalars['String']>;
    createdAt?: Maybe<Scalars['Date']>;
    updatedAt?: Maybe<Scalars['Date']>;
    triggerType: TriggerEnum;
};


export type SubscriptionUserArgs = {
    id?: Maybe<Scalars['ID']>;
    name?: Maybe<Scalars['String']>;
    createdAt?: Maybe<Scalars['Date']>;
    updatedAt?: Maybe<Scalars['Date']>;
    triggerType: TriggerEnum;
};

export type Task = {
    __typename?: 'Task';
    id: Scalars['ID'];
    name: Scalars['String'];
    createdAt: Scalars['Date'];
    updatedAt: Scalars['Date'];
    _fn?: Maybe<Scalars['BasicType']>;
    _col?: Maybe<Scalars['BasicType']>;
    users?: Maybe<Array<Maybe<User>>>;
};


export type Task_FnArgs = {
    fn: Scalars['String'];
    as?: Maybe<Scalars['String']>;
    args: Scalars['BasicType'];
};


export type Task_ColArgs = {
    name: Scalars['String'];
    as?: Maybe<Scalars['String']>;
};


export type TaskUsersArgs = {
    limit?: Maybe<Scalars['Int']>;
    where?: Maybe<Scalars['JSONType']>;
    subQuery?: Maybe<Scalars['Boolean']>;
    order?: Maybe<Array<Maybe<UserOrderType>>>;
    groupBy?: Maybe<Scalars['BasicType']>;
    right?: Maybe<Scalars['Boolean']>;
    required?: Maybe<Scalars['Boolean']>;
    duplicating?: Maybe<Scalars['Boolean']>;
    on?: Maybe<Scalars['JSONType']>;
};

export type TaskCreateInput = {
    name: Scalars['String'];
    users?: Maybe<Array<Maybe<UserCreateInput>>>;
};

export enum TaskFieldEnum {
    All = '_all',
    Id = 'id',
    Name = 'name',
    CreatedAt = 'createdAt',
    UpdatedAt = 'updatedAt'
}

export type TaskMutation = {
    __typename?: 'TaskMutation';
    create?: Maybe<Task>;
    update?: Maybe<Task>;
    remove?: Maybe<Scalars['Boolean']>;
};


export type TaskMutationCreateArgs = {
    data: TaskCreateInput;
};


export type TaskMutationUpdateArgs = {
    data: TaskUpdateInput;
    id: Scalars['ID'];
};


export type TaskMutationRemoveArgs = {
    id: Scalars['ID'];
};

export type TaskOrderType = {
    name: TaskFieldEnum;
    sort?: Maybe<SortType>;
};

export type TaskQuery = {
    __typename?: 'TaskQuery';
    one?: Maybe<Task>;
    list?: Maybe<Array<Maybe<Task>>>;
    aggregate?: Maybe<Scalars['BasicType']>;
};


export type TaskQueryOneArgs = {
    id?: Maybe<Scalars['Int']>;
    scope?: Maybe<Array<Maybe<Scalars['String']>>>;
    where?: Maybe<Scalars['JSONType']>;
    order?: Maybe<Array<Maybe<TaskOrderType>>>;
};


export type TaskQueryListArgs = {
    scope?: Maybe<Array<Maybe<Scalars['String']>>>;
    limit?: Maybe<Scalars['Int']>;
    where?: Maybe<Scalars['JSONType']>;
    offset?: Maybe<Scalars['Int']>;
    subQuery?: Maybe<Scalars['Boolean']>;
    having?: Maybe<Scalars['JSONType']>;
    order?: Maybe<Array<Maybe<TaskOrderType>>>;
    groupBy?: Maybe<Scalars['BasicType']>;
};


export type TaskQueryAggregateArgs = {
    fn: AggregateMenu;
    field: TaskFieldEnum;
    where?: Maybe<Scalars['JSONType']>;
};

export type TaskUpdateInput = {
    name?: Maybe<Scalars['String']>;
};

export enum TriggerEnum {
    Created = 'Created',
    Updated = 'Updated',
    Removed = 'Removed'
}

export type UserCreateInput = {
    name: Scalars['String'];
    projects?: Maybe<Array<Maybe<ProjectCreateInput>>>;
    tasks?: Maybe<Array<Maybe<TaskCreateInput>>>;
};

export enum UserFieldEnum {
    All = '_all',
    Id = 'id',
    Name = 'name',
    CreatedAt = 'createdAt',
    UpdatedAt = 'updatedAt'
}

export type UserMutation = {
    __typename?: 'UserMutation';
    create?: Maybe<User>;
    update?: Maybe<User>;
    remove?: Maybe<Scalars['Boolean']>;
};


export type UserMutationCreateArgs = {
    data: UserCreateInput;
};


export type UserMutationUpdateArgs = {
    data: UserUpdateInput;
    id: Scalars['ID'];
};


export type UserMutationRemoveArgs = {
    id: Scalars['ID'];
};

export type UserOrderType = {
    name: UserFieldEnum;
    sort?: Maybe<SortType>;
};

export type UserQuery = {
    __typename?: 'UserQuery';
    one?: Maybe<User>;
    list?: Maybe<Array<Maybe<User>>>;
    aggregate?: Maybe<Scalars['BasicType']>;
};


export type UserQueryOneArgs = {
    id?: Maybe<Scalars['Int']>;
    scope?: Maybe<Array<Maybe<Scalars['String']>>>;
    where?: Maybe<Scalars['JSONType']>;
    order?: Maybe<Array<Maybe<UserOrderType>>>;
};


export type UserQueryListArgs = {
    scope?: Maybe<Array<Maybe<Scalars['String']>>>;
    limit?: Maybe<Scalars['Int']>;
    where?: Maybe<Scalars['JSONType']>;
    offset?: Maybe<Scalars['Int']>;
    subQuery?: Maybe<Scalars['Boolean']>;
    having?: Maybe<Scalars['JSONType']>;
    order?: Maybe<Array<Maybe<UserOrderType>>>;
    groupBy?: Maybe<Scalars['BasicType']>;
};


export type UserQueryAggregateArgs = {
    fn: AggregateMenu;
    field: UserFieldEnum;
    where?: Maybe<Scalars['JSONType']>;
};

export type UserUpdateInput = {
    name?: Maybe<Scalars['String']>;
};
