import { Service } from "typedi";
import { getRepository, Repository} from "typeorm";
import { Category, CategoryInput } from "./model";

@Service()
export class CategoryService {
    private repository: Repository<Category> = getRepository(Category);

    public getCategory(value: string): Promise<Category> {
        return this.repository.findOne(value);
    }

    public getAllCategories(): Promise<Category[]> {
        return this.repository.find();
    }

    public addCategory(category: CategoryInput) {
        return this.repository.save(category);
    }
}
