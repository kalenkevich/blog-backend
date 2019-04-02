import { Service } from "typedi";
import { getRepository, Like, Repository } from "typeorm";
import { Category, CategoryInput } from "./model";

@Service()
export class CategoryService {
    private repository: Repository<Category> = getRepository(Category);

    public searchCategories(query: string): Promise<Category[]> {
        return this.repository.find({
            where: { title: Like(`%${query}%`) },
        });
    }

    public getAllCategories(): Promise<Category[]> {
        return this.repository.find();
    }

    public addCategory(category: CategoryInput) {
        return this.repository.save(category);
    }
}
