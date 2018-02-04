import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
    selector: 'custom-page',
    templateUrl: './index.html'
})
export class CustomPageComponent {
    private title: string;
    private pageName: string;

    /**
     * Constructor
     */
    constructor(
        private viewCtrl: ViewController,
        private navParams: NavParams)
    {
        this.title = this.navParams.get('title');
        this.pageName = this.navParams.get('pageName');
    }

    /**
     * Close
     */
    close(): void {
        this.viewCtrl.dismiss();
    }
}
