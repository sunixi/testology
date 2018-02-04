import { BaseValidator } from './baseValidator';
import { Events } from 'ionic-angular';
import { DataStore } from 'js-data';

// import services
import { SecureHttpService } from '../../../services/http/index';

export abstract class BaseAsyncValidator extends BaseValidator {
    protected timer: any;
    protected baseValidationDelay: number = 1000;

    /**
     * Constructor
     */
    constructor(
        protected api: DataStore,
        protected http: SecureHttpService,
        protected events: Events)
    {
        super();
    }

    /**
     * Fire event
     */
    protected fireEvent(validatorName: string, value: string, isValid: boolean): void {
        this.events.publish('asyncValidator:finished', {
            name: validatorName,
            value: value,
            isValid: isValid
        });
    }

    /**
     * Get validation delay
     */
    protected getValidationDelay(): number {
        let apiValidationDelay: any = this.api.get('configs', 'validationDelay');
        let validationDelay: number = apiValidationDelay
            ? parseInt(apiValidationDelay.value)
            : this.baseValidationDelay;

        return validationDelay;
    }
}
