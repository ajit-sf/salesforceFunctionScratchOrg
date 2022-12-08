/**
 * @description       : 
 * @author            : Ajitesh
 * @group             : 
 * @last modified on  : 12-08-2022
 * @last modified by  : Ajitesh
**/
public with sharing class KYCValidatorFunctionCall {

    public class FlowInputVariable{
        @InvocableVariable
        public String panCardNo;
        @InvocableVariable
        public String aadhaarNo;
        @InvocableVariable
        public String aadhaarName;
        @InvocableVariable
        public String firstName;
        @InvocableVariable
        public String lastName;
    }

    public class PostgressCreds{
        public String databaseUri;
    }

    public class SalesforcefunctionInput{
        public String panCardNo;
        public String aadhaarNo;
        public String aadhaarName;
        public String firstName;
        public String lastName;
        public PostgressCreds creds;
        public String transactionType;
    }

    public class SalesforceFunctionOutputVariable{
        @InvocableVariable public Boolean isAddharVerfied;
        @InvocableVariable public Boolean isPanVerfied;
        @InvocableVariable public Double cibilScore;
        @InvocableVariable public Double matchingProbability;
    }

    @InvocableMethod(label = 'KYC Validation Function Call')
    public static List<SalesforceFunctionOutputVariable> KYCValidatorFunctionCall(List<FlowInputVariable> flowInput) {
        KYC_Validator_Postgress_cred__mdt kycValidatorRec = [SELECT Creds_URL__c FROM KYC_Validator_Postgress_cred__mdt LIMIT 1];

        PostgressCreds creds = new PostgressCreds();
        creds.databaseUri = kycValidatorRec.Creds_URL__c;
        
        SalesforcefunctionInput funcinputs = new SalesforcefunctionInput();
        funcinputs.transactionType = 'kycvalidator';
        funcinputs.aadhaarNo = flowInput[0].aadhaarNo.replaceAll( '\\s+', '');
        funcinputs.panCardNo = flowInput[0].panCardNo.replaceAll( '\\s+', '');
        funcinputs.aadhaarName = flowInput[0].aadhaarName;
        funcinputs.firstName = flowInput[0].firstName;
        funcinputs.lastName = flowInput[0].lastName;
        funcinputs.creds = creds;

        functions.Function fn = functions.Function.get('salesforceFunction.kycusecase');
        functions.FunctionInvocation invocation = fn.invoke(JSON.serialize(funcinputs));
        if (invocation.getStatus() == functions.FunctionInvocationStatus.ERROR) {
            if(invocation.getError() != null)
                System.debug('Error ' + invocation.getError().getMessage());
        
            throw new CalloutException(
            (invocation.getError() != null
                ? invocation.getError().getMessage()
                : 'UNKNOWN')
            );
        }

        

        SalesforceFunctionOutputVariable temp = (SalesforceFunctionOutputVariable)(JSON.deserialize(invocation.getResponse(),  SalesforceFunctionOutputVariable.class));
        System.debug(temp);
        return new List<SalesforceFunctionOutputVariable>{temp};
    }
}