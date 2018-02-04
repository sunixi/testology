import { IValidator } from './interface';

export abstract class BaseValidator implements IValidator {
    protected params: {};

    /**
     * Validate
     */
    abstract validate(): Function;

    /**
     * Add params
     */
    addParams(params: {}): any {
        this.params = params;
    }
}
