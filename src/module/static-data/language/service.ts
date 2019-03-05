import { Inject, Service } from "typedi";
import { EntityManager } from "typeorm";
import { Language, LanguageInput } from "./model";

@Service()
export class LanguageService {
    @Inject("EntityManager")
    public entityManager: EntityManager;

    public getLanguage(languageInput: LanguageInput): Promise<Language> {
        return this.entityManager.findOne(Language, { value: languageInput.value });
    }

    public getAllLanguage(): Promise<Language[]> {
        return this.entityManager.find(Language);
    }

    public addLanguage(language: LanguageInput) {
        return this.entityManager.save(LanguageInput, language);
    }
}
