import bcrypt from "bcrypt-nodejs";
import { Inject, Service } from "typedi";
import { EntityManager, UpdateResult } from "typeorm";
import { UserRole } from "./role";
import { User, UserInput } from "./model";

@Service()
export class UserService {
    @Inject("EntityManager")
    public entityManager: EntityManager;

    public async getUser(selectOptions: any): Promise<User> {
        return this.entityManager.findOne(User, selectOptions);
    }

    public getAllUsers() {
        return this.entityManager.find(User);
    }

    public createUser(userData: any): Promise<User> {
        const createdUser = this.entityManager.create(User, {
            ...userData,
            role: UserRole[userData.role],
        });

        return this.entityManager.save(createdUser);
    }

    public updateUser(user: UserInput): Promise<UpdateResult> {
        return this.entityManager.update(User, user.id, {...user});
    }

    public removeToken(userId: string): Promise<UpdateResult> {
        return this.entityManager.update(User, userId, {token: null});
    }

    public async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<UpdateResult | boolean> {
        const user = await this.getUser({ id: userId });
        const isValidPassword = bcrypt.compareSync(oldPassword, user.password);

        if (isValidPassword) {
            return this.entityManager.update(User, userId, { password: newPassword });
        }

        return false;
    }

    public changePhone(userId: string, phone: string): Promise<UpdateResult> {
        return this.entityManager.update(User, userId, { phone });
    }
}
