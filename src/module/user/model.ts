import UserRole from './user-role';

export default class User {
    id: string;

    name: string;

    email: string;

    roles: UserRole[];

    token: string;
}
