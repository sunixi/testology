export interface IValidator {

    /**
     * Validate
     */
    validate(): Function;

    /**
     * Add params
     */
    addParams(params: {}): void;
}
