import { MissingTranslationHandler, MissingTranslationHandlerParams } from 'ng2-translate/ng2-translate';

export class CustomMissingTranslationHandler implements MissingTranslationHandler {
    handle(params: MissingTranslationHandlerParams) {
        console.warn(`Translation is missing for key: ${params.key}`);
    }
}
