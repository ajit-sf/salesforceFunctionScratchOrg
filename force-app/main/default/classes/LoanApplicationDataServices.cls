/**
 * @description       : Create downloadable url to share with OCR for values
 * @author            : Ajitesh
 * @group             : 
 * @last modified on  : 10-30-2022
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
    }

    /**
    * @description Pass download url to OCR
    * @author Ajitesh | 10-30-2022 
    * @param downloadableLink 
    * @return string 
    **/
    @AuraEnabled
    public static void fetchTextFromImages(String downloadableLink){
        try {
            
            WrapDownloadLink wDL = new WrapDownloadLink();
            wDL.downloadableUrl = downloadableLink;

            functions.Function fn = functions.Function.get('salesforceFunction.ocrfunction');
            functions.FunctionInvocation invocation = fn.invoke(JSON.serialize(wDL));


        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}
