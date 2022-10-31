import { LightningElement, api, track } from 'lwc';

import createPublicDistributionLink from '@salesforce/apex/LoanApplicationDataServices.createPublicDistributionLink';
import fetchTextFromImages from '@salesforce/apex/LoanApplicationDataServices.fetchTextFromImages';

export default class LoanApplication extends LightningElement {
    currentValue = '2';
    isFormFill = true;
    isDocUploaded = false;
    @track cibilScore = 75;

    
    pathHandler(event) {
        let targetValue = event.currentTarget.value;
        let selectedvalue = event.currentTarget.label;
        this.currentValue = targetValue;
        if(selectedvalue == "Login"){
            this.isFormFill = false;
            this.isDocUploaded = false;
        }
        if(selectedvalue == "Form Fill"){
            this.isFormFill = true;
            this.isDocUploaded = false;
        }
        if(selectedvalue == "Upload Documents"){
            this.isFormFill = false;
            this.isDocUploaded = true;
        }
        if(selectedvalue == "Verify"){
            this.isFormFill = false;
            this.isDocUploaded = false;
        }
        if(selectedvalue == "Submit"){
            this.isFormFill = false;
            this.isDocUploaded = false;
        }
    }
    handleClick(event){
        console.log('Click button '+event.target.name+' current value '+this.currentValue);
        if(event.target.name == "saveNext" && this.currentValue == '2'){
            this.isFormFill = false;
            this.isDocUploaded = true;
            this.currentValue = '3';
        }
        if(event.target.name == "back" && this.currentValue == '3'){
            this.isFormFill = true;
            this.isDocUploaded = false;
            this.currentValue = '2';
        }
        if(event.target.name == "saveNextOnUpload" && this.currentValue == '3'){
            this.isFormFill = false;
            this.isDocUploaded = false;
            this.currentValue = '4';
        }
    }

    @api panRecordId;
    @api aadharRecordId;

    get acceptedFormats() {
        return ['.png', '.jpg', '.jpeg'];
    }

    async handleUploadFinished(event) {
        // Get the list of uploaded files
        const uploadedFiles = event.detail.files;
        
        let downloadableUrl = await createPublicDistributionLink({
            fileName : uploadedFiles[0].name,
            contentVersionId : uploadedFiles[0].contentVersionId,
        });

        await fetchTextFromImages({downloadableLink : downloadableUrl});
        
    }


    @api recordId;
    panFileData
    aadharFileData
    openPanfileUpload(event) {
        console.log('File '+event.target.name);
        const file = event.target.files[0]
        var reader = new FileReader()
        reader.onload = () => {
            var base64 = reader.result.split(',')[1]
            this.panFileData = {
                'filename': file.name,
                'base64': base64,
                //'recordId': this.recordId
            }
            console.log(this.panFileData)
        }
        reader.readAsDataURL(file)
    }

    openAddharfileUpload(event) {
        console.log('File '+event.target.name);
        const file = event.target.files[0]
        var reader = new FileReader()
        reader.onload = () => {
            var base64 = reader.result.split(',')[1]
            this.aadharFileData = {
                'filename': file.name,
                'base64': base64,
                //'recordId': this.recordId
            }
            console.log(this.aadharFileData)
        }
        reader.readAsDataURL(file)
    }

    toast(title){
        const toastEvent = new ShowToastEvent({
            title, 
            variant:"success"
        })
        this.dispatchEvent(toastEvent)
    }
/*
    @track ringColor = 'Blue';
    @track percentage = 60;
    @track title1 = 'Excellent Credit Score';
    @track title2 = 'Know what changed in your report?';
    @track animation =  true;
    @track percentageVal;
    @track titlePlacement = 'Header';
    @track remainingRingColour= '#8080807a';
    @track source;
    @track target;
    @track textInsideRing = 'Score';
    @track showBothTextAndPercentage = true;

    connectedCallback(){
        if(this.percentage>100){
            this.percentageVal = this.percentage+'%';
            this.percentage = 100;
        }
        else {
            this.percentageVal = this.percentage+'%';
        }

        if(this.showBothTextAndPercentage){
            if(this.textInsideRing !=null && this.textInsideRing!= '')
                this.percentageVal = this.textInsideRing+' '+this.percentageVal;
        }
        else if(this.textInsideRing !=null && this.textInsideRing!= ''){
            this.percentageVal = this.textInsideRing;
        }
        this.styleOfBar();
    }

    styleOfBar(){
        var circle = this.template.querySelector('circle');
        var radius = circle.r.baseVal.value;
        var circumference = radius * 2 * Math.PI;

        console.log('Radius '+radius+' circumference '+circumference);
        
        const offset = circumference - this.percentage / 100 * circumference;
        console.log('offset '+offset);
        this.template.querySelector('svg circle').style.stroke = this.ringColor;
        this.template.querySelector('.bar').style.backgroundColor = this.remainingRingColour;
        
            if(this.animation == true){
                circle.style.strokeDashoffset = offset;
                circle.classList.add('addAnimation');
            }
            else{
                circle.style.strokeDashoffset = offset;
            }
            

                if(this.titlePlacement == 'Header'){
                    this.template.querySelector(".heading2").style.display = "none";
                    this.template.querySelector(".heading").style.display = "block";
                }
                else if(this.titlePlacement == 'Footer'){
                    this.template.querySelector(".heading").style.display = "none";
                    this.template.querySelector(".heading2").style.display = "block";
                }
                this.template.querySelector(".percentageVal").style.display = "block";
                
    }*/
}