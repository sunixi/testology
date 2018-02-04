import { Injectable } from '@angular/core';
import { QuestionBase, QuestionBaseOptions, QuestionBaseParams } from './base';
import { ModalController } from 'ionic-angular';

// import shared components
import { LocationAutocompleteComponent } from '../../../shared/components/locationAutocomplete/index';

@Injectable()
export class GoogleMapLocationQuestion extends QuestionBase {
    public controlType = 'googlemap_location';
    protected questionChanged = false;
    protected modalController: ModalController;

    /**
     * Constructor
     */
    constructor(options: QuestionBaseOptions, params?: QuestionBaseParams) {
        super(options, params);

        if (!this.value) {
            this.value = '';
        }
    }

    /**
     * Set modal
     */
    setModal(modalController: ModalController): void {
        this.modalController = modalController;
    }

    /**
     * Show address modal
     */
    showAddressModal(): void {
        let modal = this.modalController.create(LocationAutocompleteComponent, {
            q: this.getValue()
        });

        modal.onDidDismiss(location => {
            this.setValue(location);

            if (!this.questionChanged) {
                this.controlView.markAsDirty();
                this.controlView.markAsTouched();
                this.questionChanged = true;
            }

            // trigger manually about update in the question
            this.controlView.updateValueAndValidity();
        });

        modal.present();
    }

    /**
     * Get value
     */
    protected getValue(): any {
        return this.value;
    }

    /**
     * Set value
     */
    protected setValue(location: string): void {
        this.value = location;
        this.controlView.setValue(location);
    }
}
