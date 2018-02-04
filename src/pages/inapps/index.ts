import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';

@Component({
    selector: 'inapps',
    templateUrl: 'index.html',
    providers: [
    ]
})

export class InappsPage {
    @ViewChild('inappsSlider') slider: Slides;
    private targetPage: string = 'Memberships'; // id

    /**
     * Select tab
     */
    select(index): void {
        this.slider.slideTo(index);
    }
}
