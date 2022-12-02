/**
 * @description       : Generate downloadable URL
 * @author            : Ajitesh
 * @group             : 
 * @last modified on  : 12-01-2022
 * @last modified by  : Ajitesh
**/
public class OCRHelper {
    
    public class FlowInputVariable{
        @InvocableVariable
        public List<ContentDocumentLink> filesLink;        
    }

    


    @InvocableMethod(label = 'OCR Helper')
    public static List<List<ContentDistribution>> ocrHelper(List<FlowInputVariable> inputVariable){
        
        List<List<ContentDistribution>> temp = new List<List<ContentDistribution>>();
        temp.add(downloadableUrl(inputVariable[0].filesLink));
        return temp;

       

        
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

        return [SELECT Name, ContentDownloadUrl, ContentDocumentId FROM ContentDistribution WHERE Id IN: contentDistributionIds];

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