/**
 * @description       : 
 * @author            : Ajitesh
 * @group             : 
 * @last modified on  : 12-04-2022
 * @last modified by  : Ajitesh
**/
public with sharing class KYCValidatorFunctionCall {

    public class FlowInputVariable{
        @InvocableVariable
        public String panCardNo;
        @InvocableVariable
        public String aadhaarNo;
    }

    public class PostgressCreds{
        public String databaseUri;
    }

    public class SalesforcefunctionInput{
        public String panCardNo;
        public String aadhaarNo;
        public PostgressCreds creds;
    }

    public class SalesforceFunctionOutputVariable{
        @InvocableVariable public Boolean isAadhaarValidated;
        @InvocableVariable public Boolean isPanValidated;
    }

    @InvocableMethod(label = 'OCR Helper Function Call')
    public static void KYCValidatorFunctionCall(List<FlowInputVariable> flowInput) {
        KYC_Validator_Postgress_cred__mdt kycValidatorRec = [SELECT Creds_URL__c FROM KYC_Validator_Postgress_cred__mdt LIMIT 1];

        PostgressCreds creds = new PostgressCreds();
        creds.databaseUri = kycValidatorRec.Creds_URL__c;
        
        SalesforcefunctionInput funcinputs = new SalesforcefunctionInput();
        funcinputs.aadhaarNo = flowInput[0].aadhaarNo;
        funcinputs.panCardNo = flowInput[0].panCardNo;
        funcinputs.creds = creds;



    }
}
