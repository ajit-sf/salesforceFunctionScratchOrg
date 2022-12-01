/**
 * @description       : 
 * @author            : Ajitesh
 * @group             : 
 * @last modified on  : 12-01-2022
 * @last modified by  : Ajitesh
**/
public with sharing class OCRHelperFunctionCall {
    
    public class FlowInputVariable{
        @InvocableVariable public List<ContentDistribution> inputParams;
        @InvocableVariable
        public List<String> panCardName;
        @InvocableVariable
        public List<String> aadhaarCardNameHelper;
        @InvocableVariable
        public List<String> aadhaarCardNameHelper2;
    }

    public class SalesforceFunctionOutputVariable{
        @InvocableVariable public String aadhaarName;
        @InvocableVariable public String aadhaarNum;
        @InvocableVariable public String address;
        @InvocableVariable public String panNum;
        @InvocableVariable public String panName;
    }

    public class SalesforceFunctionInputVariable{
        public String aadhaarCardFrontUrl;
        public String aadhaarCardBackUrl;
        public String panCardUrl;
        public String username;
        public String privateKey;
    }

    @InvocableMethod(label = 'OCR Helper Function Call')
    public static List<SalesforceFunctionOutputVariable> ocrHelper(List<FlowInputVariable> inputVariable){
        List<ContentDistribution> conDistUrlList = inputVariable[0].inputParams;
        
        SalesforceFunctionInputVariable sfunVar = new SalesforceFunctionInputVariable();

        String panCardName =  inputVariable[0].panCardName[0];
        String aadhaarCardNameHelper = inputVariable[0].aadhaarCardNameHelper[0];
        String aadhaarCardNameHelper2 = inputVariable[0].aadhaarCardNameHelper2[0];

        System.debug('Pan card Name ' + panCardName);
        System.debug('Pan card Name ' + panCardName.split('.'));
        System.debug('aadhaarCardNameHelper Name ' + aadhaarCardNameHelper);
        System.debug('aadhaarCardNameHelper2 ' + panCardName);
        
        for(ContentDistribution conD : conDistUrlList){
            if(conD.Name ==panCardName.split('\\.')[0]){
                sfunVar.panCardUrl = conD.ContentDownloadUrl;
            }

            else if(conD.Name == aadhaarCardNameHelper.split('\\.')[0]){
                sfunVar.aadhaarCardFrontUrl = conD.ContentDownloadUrl;
            }

            else if(conD.Name == aadhaarCardNameHelper2.split('\\.')[0]){
                sfunVar.aadhaarCardBackUrl = conD.ContentDownloadUrl;
            }
        }

        for(OCR_Authentication__mdt authenticationVal : [SELECT DeveloperName, Value__c FROM OCR_Authentication__mdt]){
            if(authenticationVal.DeveloperName == 'PrivateKey'){
                sfunVar.privateKey = authenticationVal.Value__c;
            }
            if(authenticationVal.DeveloperName == 'Username'){
                sfunVar.username = authenticationVal.Value__c;
            }
        }

        System.debug(sfunVar);

        functions.Function fn = functions.Function.get('salesforceFunction.ocrfunction');
        functions.FunctionInvocation invocation = fn.invoke(JSON.serialize(sfunVar));

        if (invocation.getStatus() == functions.FunctionInvocationStatus.ERROR) {
            if(invocation.getError() != null)
                System.debug('Error ' + invocation.getError().getMessage());
            
            throw new CalloutException(
            (invocation.getError() != null
                ? invocation.getError().getMessage()
                : 'UNKNOWN')
            );
        }

        return (List<SalesforceFunctionOutputVariable>)(JSON.deserializeStrict(invocation.getResponse(),  List<SalesforceFunctionOutputVariable>.class));
    }
}