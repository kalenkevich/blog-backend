import { Inject, Service } from "typedi";
import { EntityManager } from "typeorm";
import { Category, CategoryInput } from "./model";

@Service("CategoryService")
export class CategoryService {
    @Inject("EntityManager")
    public entityManager: EntityManager;

    public getCategory(value: string): Promise<Category> {
        return this.entityManager.findOne(Category, { value });
    }

    public getAllCategories(): Promise<Category[]> {
        return this.entityManager.find(Category);
    }

    public addCategory(category: CategoryInput) {
        return this.entityManager.save(Category, category);
    }
}
