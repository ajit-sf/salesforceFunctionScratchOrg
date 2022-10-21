import { LightningElement } from 'lwc';

export default class LoanApplication extends LightningElement {
    currentvalue = '1';
    pathHandler(event) {
        let targetValue = event.currentTarget.value;
        let selectedvalue = event.currentTarget.label;
        this.currentvalue = targetValue;
    }
}