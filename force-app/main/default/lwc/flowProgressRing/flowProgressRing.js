import { LightningElement } from 'lwc';
import checkCibilScore from '@salesforce/apex/CibilScoreHelper.checkCibilScore';

export default class FlowProgressRing extends LightningElement {
    
    cibilScore;
    
    connectedCallback(){
        this.handlecibilScore();
    }

    handlecibilScore(){
        checkCibilScore({})
            .then(data => {
                console.log('record Updated '+data/1000);
                this.cibilScore = data/1000;
            })
            .catch(error => {
                console.log(error);
            });
    }
}