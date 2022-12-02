/**
 * @description       : 
 * @author            : Ajitesh
 * @group             : 
 * @last modified on  : 12-02-2022
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
        public String host;
        public String database;
        public String user;
        public String port;
        public String password;
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
    public KYCValidatorFunctionCall(List<FlowInputVariable> flowInput) {
        KYC_Validator_Postgress_cred__mdt kycValidatorRec = [SELECT Database__c, Host__c, Password__c, Port__c, User__c FROM KYC_Validator_Postgress_cred__mdt LIMIT 1];

        PostgressCreds creds = new PostgressCreds();
        creds.host = kycValidatorRec.Host__c;
        creds.database = kycValidatorRec.Database__c;
        creds.password = kycValidatorRec.Password__c;
        creds.port = kycValidatorRec.Port__c;
        creds.user = kycValidatorRec.User__c;

        SalesforcefunctionInput funcinputs = new SalesforcefunctionInput();
        funcinputs.aadhaarNo = flowInput[0].aadhaarNo;
        funcinputs.panCardNo = flowInput[0].panCardNo;
        funcinputs.creds = creds;

        

    }
}
