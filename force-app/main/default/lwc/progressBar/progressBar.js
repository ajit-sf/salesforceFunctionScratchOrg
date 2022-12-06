import { LightningElement,api, track  } from 'lwc';

export default class ProgressBar extends LightningElement {
    @api progressIndicator = '1';
    @track isFinalStep = false;

//Status - upcoming, Current, Complete
    @track stepsArray;

    connectedCallback() {
        let stepsArrayTemp = [];
        if(this.progressIndicator == '1'){
            stepsArrayTemp = [
                {'label': 'Form Fill', 'status': 'Current', 'showCurrent' : true, 'showComplete' : false, 'showUpcoming' : false,'finalStep' : false},
                {'label': 'Preview & Verify', 'status': 'Upcoming', 'showCurrent' : false, 'showComplete' : false, 'showUpcoming' : true,'finalStep' : false},
                {'label': 'Submit', 'status': 'Upcoming', 'showCurrent' : false, 'showComplete' : false, 'showUpcoming' : true,'finalStep' : false}
            ];
        }else if(this.progressIndicator == '2'){
            stepsArrayTemp = [
                {'label': 'Form Fill', 'status': 'Complete', 'showCurrent' : false, 'showComplete' : true, 'showUpcoming' : false,'finalStep' : false},
                {'label': 'Preview & Verify', 'status': 'Current', 'showCurrent' : true, 'showComplete' : false, 'showUpcoming' : false,'finalStep' : false},
                {'label': 'Submit', 'status': 'Upcoming', 'showCurrent' : false, 'showComplete' : false, 'showUpcoming' : true,'finalStep' : false}
            ];
        }else if(this.progressIndicator == '3'){
            stepsArrayTemp = [
                {'label': 'Form Fill', 'status': 'Complete', 'showCurrent' : false, 'showComplete' : true, 'showUpcoming' : false,'finalStep' : false},
                {'label': 'Preview & Verify', 'status': 'Complete', 'showCurrent' : false, 'showComplete' : true, 'showUpcoming' : false,'finalStep' : false},
                {'label': 'Submit', 'status': 'Current', 'showCurrent' : true, 'showComplete' : false, 'showUpcoming' : false,'finalStep' : true}
            ];
        }
        this.stepsArray = stepsArrayTemp;
    }
}