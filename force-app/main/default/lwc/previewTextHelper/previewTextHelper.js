import { api, LightningElement } from 'lwc';

export default class PreviewTextHelper extends LightningElement {
    @api aadhaarName = 'Vijender Singh';
    @api aadhaarNum = '337972036560';
    @api aadhaarAddress = '277001 Hanumanganj Ballia UttarP.O. Box No.1947.';

    @api panCardName = 'KOCHERLA SRIKANTH';
    @api panCardNum = 'GQBPK8700C';

    @api type;

    get isAadhaar(){
        return this.type === 'aadhaar';
    }

    get isPAN(){
        return this.type === 'PAN';
    }
    get isAadhaarBack(){
        return this.type === 'aadhaarback';
    }

    
}