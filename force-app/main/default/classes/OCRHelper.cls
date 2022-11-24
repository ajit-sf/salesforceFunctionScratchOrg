/**
 * @description       : 
 * @author            : Ajitesh
 * @group             : 
 * @last modified on  : 11-24-2022
 * @last modified by  : Ajitesh
**/
public class OCRHelper {
    
    public class FlowInputVariable{
        @InvocableVariable
        public List<ContentDocumentLink> filesLink;
        @InvocableVariable
        public List<String> panCardName;
        @InvocableVariable
        public List<String> aadhaarCardNameHelper;
        @InvocableVariable
        public List<String> aadhaarCardNameHelper2;
    }

    public class SalesforceFunctionInputVariable{
        public String aadhaarCardFrontUrl;
        public String aadhaarCardBackUrl;
        public String panCardUrl;
        public String username;
        public String privateKey;
    }

    public class SalesforceFunctionOutputVariable{
        @InvocableVariable public String aadhaarName;
        @InvocableVariable public String aadhaarNum;
        @InvocableVariable public String address;
        @InvocableVariable public String panNum;
        @InvocableVariable public String panName;
    }


    @InvocableMethod(label = 'OCR Helper')
    public static List<SalesforceFunctionOutputVariable> ocrHelper(List<FlowInputVariable> inputVariable){
        String panCardName =  inputVariable[0].panCardName[0];
        String aadhaarCardNameHelper = inputVariable[0].aadhaarCardNameHelper[0];
        String aadhaarCardNameHelper2 = inputVariable[0].aadhaarCardNameHelper2[0];
        
        List<ContentDistribution> conDistUrlList = downloadableUrl(inputVariable[0].filesLink);

        SalesforceFunctionInputVariable sfunVar = new SalesforceFunctionInputVariable();

        for(ContentDistribution conD : conDistUrlList){
            if(conD.Name == panCardName){
                sfunVar.panCardUrl = conD.ContentDownloadUrl;
            }

            else if(conD.Name == aadhaarCardNameHelper){
                sfunVar.aadhaarCardFrontUrl = conD.ContentDownloadUrl;
            }

            else if(conD.Name == aadhaarCardNameHelper){
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

    public static List<ContentDistribution> downloadableUrl(List<ContentDocumentLink> filesLink){
        
        Map<Id,String> documentFileNameMap = getContentDocumentMap(filesLink);
        Map<Id,Id> contentDocumentMapVersion = new Map<Id,Id>();
        List<ContentDistribution> contentDist = new List<ContentDistribution>();
        Set<Id> contentDistributionIds = new Set<Id>();

        for(ContentVersion conV : [SELECT Id, ContentDocumentId FROM ContentVersion WHERE ContentDocumentId IN: documentFileNameMap.keySet()]){
            contentDocumentMapVersion.put(conV.ContentDocumentId, conV.Id);
        }

        for(Id contentD : contentDocumentMapVersion.keySet()){
            ContentDistribution conD = new ContentDistribution();
            conD.Name = documentFileNameMap.get(contentD);
            conD.ContentVersionId = contentDocumentMapVersion.get(contentD);
            conD.PreferencesAllowViewInBrowser = true;
            contentDist.add(conD);
        }

        Insert contentDist;

        for(ContentDistribution conD : contentDist){
            contentDistributionIds.add(conD.Id);
        }

        return [SELECT Name, ContentDownloadUrl FROM ContentDistribution WHERE Id IN: contentDistributionIds];

    }

    public static Map<Id, String> getContentDocumentMap(List<ContentDocumentLink> filesLink){
        
        Map<Id, String> documentFileNameMap = new Map<Id,String>();
        Set<Id> contentDocumentId = new Set<Id>();

        for(ContentDocumentLink conLink : filesLink){
            contentDocumentId.add(conLink.ContentDocumentId);
        }

        for(ContentDocument con : [SELECT Title, Id FROM ContentDocument WHERE Id IN: contentDocumentId]){
            documentFileNameMap.put(con.Id, con.Title);
        }

        return documentFileNameMap;
        
    }

}
