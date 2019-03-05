import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Inject } from "typedi";
import Logger from "../../../connector/logger";
import { Language, LanguageInput } from "./model";
import { LanguageService } from "./service";

@Resolver(Language)
export default class LanguageResolver {
    @Inject("LanguageService")
    public languageService: LanguageService;

    @Inject("Logger")
    public logger: Logger;

    @Query((returns) => [Language])
    public async getAllLanguages() {
        try {
            const result = await this.languageService.getAllLanguage();

            this.logger.info(`Successfully fetched all languages`);

            return result;
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    @Mutation((returns) => [Language])
    public addLanguage(@Arg("language") language: LanguageInput) {
        try {
            const result = this.languageService.addLanguage(language);

            this.logger.info(`Successfully added language with value: ${language.value}`);

            return result;
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }
}
