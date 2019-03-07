import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Inject } from "typedi";
import Logger from "../../connector/logger";
import { Category, CategoryInput } from "./model";
import { CategoryService } from "./service";

@Resolver(Category)
export default class CategoryResolver {
    @Inject()
    public categoryService: CategoryService;

    @Inject()
    public logger: Logger;

    @Query((returns) => Category)
    public async getCategory(@Arg("value") value: string) {
        try {
            const result = await this.categoryService.getCategory(value);

            this.logger.info(`Successfully fetched category with value: ${value}`);

            return result;
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    @Query((returns) => [Category])
    public async getAllCategories() {
        try {
            const result = await this.categoryService.getAllCategories();

            this.logger.info(`Successfully fetched all categories`);

            return result;
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    @Mutation((returns) => [Category])
    public async addCategory(@Arg("category") category: CategoryInput) {
        try {
            const result = await this.categoryService.addCategory(category);

            this.logger.info(`Successfully added new category with value: ${result.value}`);

            return result;
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }
}
