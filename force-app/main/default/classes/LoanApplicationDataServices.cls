/**
 * @description       : Create downloadable url to share with OCR for values
 * @author            : Ajitesh
 * @group             : 
 * @last modified on  : 11-06-2022
 * @last modified by  : Ajitesh
**/
public without sharing class LoanApplicationDataServices {
    

    /**
    * @description create downloadable url 
    * @author Ajitesh | 10-30-2022 
    * @param contentVersionId 
    * @param fileName 
    * @return string 
    **/
    @AuraEnabled
    public static string createPublicDistributionLink(Id contentVersionId, String fileName){
        try {

            ContentDistribution conD = new ContentDistribution();
            
            conD.Name = fileName;
            conD.ContentVersionId = contentVersionId;
            conD.PreferencesAllowViewInBrowser = true;

            Insert conD;

            return [SELECT ContentDownloadUrl FROM ContentDistribution WHERE Id=: conD.Id].ContentDownloadUrl;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public class WrapDownloadLink{
        public String downloadableUrl;
        public String type;
        public String username;
        public String privateKey;
    }

    /**
    * @description Pass download url to OCR
    * @author Ajitesh | 10-30-2022 
    * @param downloadableLink 
    * @return string 
    **/
    @AuraEnabled
    public static Object fetchTextFromImages(String downloadableLink, String type){
        try {
            
            WrapDownloadLink wDL = new WrapDownloadLink();

            wDL.downloadableUrl = downloadableLink;
            wDL.type = type;

            for(OCR_Authentication__mdt authenticationVal : [SELECT DeveloperName, Value__c FROM OCR_Authentication__mdt]){
                if(authenticationVal.DeveloperName == 'PrivateKey'){
                    wDL.privateKey = authenticationVal.Value__c;
                }
                if(authenticationVal.DeveloperName == 'Username'){
                    wDL.username = authenticationVal.Value__c;
                }
            }

            functions.Function fn = functions.Function.get('salesforceFunction.ocrfunction');
            functions.FunctionInvocation invocation = fn.invoke(JSON.serialize(wDL));
            // Check if there is any error during the invocation
            if (invocation.getStatus() == functions.FunctionInvocationStatus.ERROR) {
                if(invocation.getError() != null)
                    System.debug('Error ' + invocation.getError().getMessage());
                
                throw new CalloutException(
                (invocation.getError() != null
                    ? invocation.getError().getMessage()
                    : 'UNKNOWN')
                );
            }

            return invocation.getResponse();

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}