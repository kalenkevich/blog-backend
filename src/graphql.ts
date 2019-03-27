import UserResolver from './module/user/resolver';
import PostResolver from './module/post/resolver';
import CommentResolver from './module/comment/resolver';
import CategoryResolver from './module/category/resolver';
import AuthorizationResolver from './module/authorization/resolver';

export const resolvers = [
    UserResolver,
    PostResolver,
    CommentResolver,
    CategoryResolver,
    AuthorizationResolver,
];
