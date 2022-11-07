import { LightningElement, api, track } from 'lwc';

import createPublicDistributionLink from '@salesforce/apex/LoanApplicationDataServices.createPublicDistributionLink';
import fetchTextFromImages from '@salesforce/apex/LoanApplicationDataServices.fetchTextFromImages';
import insertLead from '@salesforce/apex/loanApplicationHelper.insertLead';
import updateLead from '@salesforce/apex/loanApplicationHelper.updateLead';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import Fail from '@salesforce/resourceUrl/fail';
import Success from '@salesforce/resourceUrl/success';
import Validated from '@salesforce/resourceUrl/validated';
import workInProgress from '@salesforce/resourceUrl/workInProgress';

export default class LoanApplication extends LightningElement {
    currentValue = '2';
    isFormFill = true;
    isDocUploaded = false;
    isVerify = false;
    isSubmit = false;

    isSuccess = false;
    isError = false;
    isValidating = true;
    Success = Success;
    Validated = Validated;
    Fail = Fail;
    workInProgress = workInProgress;
    
    @track cibilScore = 75;
    leadObject = {
        aadhaarCardName : '',
        aadhaarNum : '',
        aadhaarAdd : '',
        panNum : '',
        panCardName : ''
    };
    recordId;

    // Spinner loader
    isLoading = false;

    connectedCallback(){
        this.handleInit();
    }
    
    handleInit(){
        this.leadObject.FirstName = null;
        this.leadObject.LastName = null;
        this.leadObject.Email = null;
        this.leadObject.Lead_Address__c = null;
        this.leadObject.Phone = null;
        this.leadObject.Occupation__c = null;
        this.leadObject.fatherName__c = null;
        this.leadObject.motherName__c = false;
        this.leadObject.fatherOccupation__c = null;
        this.leadObject.motherOccupation__c = null;
        this.leadObject.fatherPhoneNo__c = null;
        this.leadObject.motherPhoneNo__c = null;
        this.leadObject.Company = null;
        this.leadObject.Id = null;
    }

   /* pathHandler(event) {
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
    }*/
    isInputValid() {
        let isValid = true;
        const allValid = [...this.template.querySelectorAll('lightning-input')]
            .reduce((validSoFar, inputCmp) => {
                        inputCmp.reportValidity();
                        return validSoFar && inputCmp.checkValidity();
            }, true);
        if (allValid) {
            console.log('Successful');
            isValid = true;
        } else {
            isValid = false;
        }
        return isValid;
    }

    handleSave(event){
        console.log('Create - Lead ' +this.isInputValid());
        this.isLoading = true;
        if(this.recordId == null && this.isInputValid()){
            insertLead({
                jsonOfLead: JSON.stringify(this.leadObject)
            })
            .then(data => {
                console.log('record inserted '+data);
                this.recordId = data;
                this.leadObject.Id = data;
                let event = new ShowToastEvent({
                    message: "Lead successfully created!",
                    variant: "success",
                    duration: 2000
                });
                this.dispatchEvent(event);
                this.isLoading = false;
            })
            .catch(error => {
                console.log(error);
                this.isLoading = false;
            });
        }
        if(this.isInputValid() == false){
            this.isLoading = false;
            let event = new ShowToastEvent({
                message: "Please fill in the required details",
                variant: "error",
                duration: 2000
            });
            this.dispatchEvent(event);
        }
        if(this.recordId != null && this.isInputValid() && event.target.name == "saveNext"){
            console.log('Update lead');
            updateLead({
                jsonOfLead: JSON.stringify(this.leadObject)
            })
            .then(data => {
                console.log('record Updated '+data);
                this.recordId = data;
                this.leadObject.Id = data;
                let event = new ShowToastEvent({
                    message: "Lead successfully Updated!",
                    variant: "success",
                    duration: 2000
                });
                this.dispatchEvent(event);
                this.isLoading = false;
            })
            .catch(error => {
                console.log(error);
                this.isLoading = false;
            });
        }
        console.log('Click button '+event.target.name+' current value '+this.currentValue);
        if(event.target.name == "saveNext" && this.currentValue == '2' && this.isInputValid()){
            this.isLoading = false;
            this.isFormFill = false;
            this.isDocUploaded = true;
            this.isVerify = false;
            this.isSubmit = false;
            this.currentValue = '3';
        }
        if(event.target.name == "back" && this.currentValue == '3'){
            this.isLoading = false;
            this.isFormFill = true;
            this.isDocUploaded = false;
            this.isVerify = false;
            this.isSubmit = false;
            this.currentValue = '2';
        }
        if(event.target.name == "saveNextOnUpload" && this.currentValue == '3'){
            console.log(this.isValidating+' Validating '+this.isError+' Success '+this.isSuccess);
            window.setTimeout(() => { 
                this.isValidating = false;
                this.validateAadhar();}, 2000);
            this.isLoading = false;
            this.isFormFill = false;
            this.isDocUploaded = false;
            this.isVerify = true;
            this.isSubmit = false;
            this.currentValue = '4';
        }
        if(event.target.name == "saveNextOnSucess" && this.currentValue == '4'){
            this.isLoading = false;
            this.isFormFill = false;
            this.isDocUploaded = false;
            this.isVerify = false;
            this.isSubmit = true;
            this.currentValue = '5';
        }
        if(event.target.name == "backToUpload" && this.currentValue == '4'){
            this.isValidating = true;
            this.isSuccess = false;
            this.isError = false;
            this.isLoading = false;
            this.isFormFill = false;
            this.isDocUploaded = true;
            this.isVerify = false;
            this.isSubmit = false;
            this.currentValue = '3';
        }
        
    }

    validateAadhar(){
        console.log('Aadhar Number '+this.leadObject.aadhaarNum+' Name '+this.leadObject.aadhaarCardName);
        let name = this.leadObject.FirstName.concat(" ", this.leadObject.LastName);
        let aadharName = this.leadObject.aadhaarCardName;
        console.log(name+' First Name '+this.leadObject.FirstName+' Last Name '+this.leadObject.LastName);
        if(name.toUpperCase() == aadharName.toUpperCase()){
            console.log('Matched');
            this.isSuccess = true;
            this.isError = false;
        }else{
            console.log('Name mismatched');
            this.isSuccess = false;
            this.isError = true;
        }
    }

    @api panRecordId;
    @api aadharRecordId;

    get acceptedFormats() {
        return ['.png', '.jpg', '.jpeg'];
    }

    async handleUploadFinishedAadhaarFront(event) {
        this.isLoading = true;
        // Get the list of uploaded files
        const uploadedFiles = event.detail.files;
        
        let downloadableUrl = await createPublicDistributionLink({
            fileName : uploadedFiles[0].name,
            contentVersionId : uploadedFiles[0].contentVersionId,
        });

        let response = await fetchTextFromImages({downloadableLink : downloadableUrl, type : 'aadhaarFront'});
        let responseCopy = JSON.parse((JSON.parse(JSON.stringify(response))));
        this.leadObject.aadhaarCardName = responseCopy.nameVal;
        this.leadObject.aadhaarNum = responseCopy.aadhaarNum;
        this.isLoading = false;
    }

    async handleUploadFinishedAadhaarBack(event) {
        this.isLoading = true;
        // Get the list of uploaded files
        const uploadedFiles = event.detail.files;
        
        let downloadableUrl = await createPublicDistributionLink({
            fileName : uploadedFiles[0].name,
            contentVersionId : uploadedFiles[0].contentVersionId,
        });

        let response = await fetchTextFromImages({downloadableLink : downloadableUrl, type : 'aadhaarBack'});
        let responseCopy = JSON.parse((JSON.parse(JSON.stringify(response))));
        this.leadObject.aadhaarAdd = responseCopy.address;
        this.isLoading = false;
    }

    async handleUploadFinishedPanCard(event) {
        this.isLoading = true;
        // Get the list of uploaded files
        const uploadedFiles = event.detail.files;
        
        let downloadableUrl = await createPublicDistributionLink({
            fileName : uploadedFiles[0].name,
            contentVersionId : uploadedFiles[0].contentVersionId,
        });

        let response = await fetchTextFromImages({downloadableLink : downloadableUrl, type : 'panCard'});
        let responseCopy = JSON.parse((JSON.parse(JSON.stringify(response))));
        this.leadObject.panNum = responseCopy.panNum;
        this.leadObject.panCardName = responseCopy.name;
        this.isLoading = false;
    }


    //@api recordId;
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

    handleInputChange(event) {
        console.log(event.target.value+' Handle change value -- Name '+event.target.name);
        let fieldName = event.target.name;
        let value = event.target.value;
        if(fieldName == 'name'){
            this.leadObject.FirstName = value;
        }
        else if(fieldName == 'lastName'){
            this.leadObject.LastName = value;
        }
        else if(fieldName == 'occupation'){
            this.leadObject.Occupation__c = value;
        }
        else if(fieldName == 'phoneNo'){
            this.leadObject.Phone = value;
        }
        else if(fieldName == 'email'){
            this.leadObject.Email = value;
        }
        else if(fieldName == 'address'){
            this.leadObject.Lead_Address__c = value;
        }
        else if(fieldName == 'fatherName'){
            this.leadObject.fatherName__c = value;
        }
        else if(fieldName == 'motherName'){
            this.leadObject.motherName__c = value;
        }
        else if(fieldName == 'fatherOccupation'){
            this.leadObject.fatherOccupation__c = value;
        }
        else if(fieldName == 'motherOccupation'){
            this.leadObject.motherOccupation__c = value;
        }
        else if(fieldName == 'fatherPhoneNo'){
            this.leadObject.fatherPhoneNo__c = value;
        }
        else if(fieldName == 'motherPhoneNo'){
            this.leadObject.motherPhoneNo__c = value;
        }
        this.leadObject.Company = 'xyz';
        console.log('Handle change  '+JSON.stringify(this.leadObject));
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