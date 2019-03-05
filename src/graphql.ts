import UserResolver from './module/user/resolver';
import PostResolver from './module/post/resolver';
import CategoryResolver from './module/static-data/category/resolver';
import LanguageResolver from './module/static-data/language/resolver';
import LocationResolver from './module/static-data/location/resolver';
import AuthorizationResolver from './module/authorization/resolver';

export const resolvers = [
    UserResolver,
    PostResolver,
    CategoryResolver,
    LanguageResolver,
    LocationResolver,
    AuthorizationResolver,
];
