import { LightningElement, api, track } from 'lwc';
export default class CustomFieldDisplay extends LightningElement {
    @api label;
    @api fieldType;
    @api value;
    @api formatter;
    @api isInputTypeText = false;
    @api isRadio = false;

    @track options = [];

    connectedCallback() {
        if(this.isRadio == true){
            if(this.value == 'Male'){
                this.options = [
                    {label:'Male', value:'Male', selected:true},
                    {label:'Female', value:'Female', selected:false}];
            }else{
                this.options = [
                    {label:'Male', value:'Male', selected:false},
                    {label:'Female', value:'Female', selected:true}];
            }
        }
    }

}