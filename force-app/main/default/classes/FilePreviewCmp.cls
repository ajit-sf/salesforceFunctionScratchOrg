/**
 * @description       : 
 * @author            : Ajitesh
 * @group             : 
 * @last modified on  : 11-22-2022
 * @last modified by  : Ajitesh
**/
public class FilePreviewCmp {
    
    @AuraEnabled
    public static wrapper[] getLinkedFiles(String recordId,String sObjectName,String lookupFieldAPIName,String fileName,String fileExtensionsCSV,integer recordLimit,string contentDocumentId) {
        wrapper[] wrappers = new wrapper[]{};
            
        //get related id of linked entity
        Id linkedEntityId = recordId;
        if(lookupFieldAPIName.length()>0) {
            try {
                string queryString = 'SELECT Id, '+lookupFieldAPIName+' FROM '+sObjectName+' WHERE Id = \''+recordId+'\'';
                system.debug(queryString);
                sObject sObj = database.query(queryString);
                linkedEntityId = getRelationshipId(lookupFieldAPIName,sObj);
            } catch(exception e){
                System.Debug(LoggingLevel.ERROR,e);
            }
            
        }
        
        ContentDocumentLink[] ContentDocumentLinks;
        
        if(contentDocumentId.length()>0){
			ContentDocumentLinks = [SELECT ContentDocumentId, ContentDocument.FileExtension, ContentDocument.Title, ContentDocument.Description, ContentDocument.LatestPublishedVersionId, ContentDocument.LatestPublishedVersion.VersionData FROM ContentDocumentLink WHERE ContentDocumentId = :contentDocumentId];            
        }
        else if(fileName.length()>0){
			ContentDocumentLinks = [SELECT ContentDocumentId, ContentDocument.FileExtension, ContentDocument.Title, ContentDocument.Description, ContentDocument.LatestPublishedVersionId, ContentDocument.LatestPublishedVersion.VersionData FROM ContentDocumentLink WHERE LinkedEntityId = :linkedEntityId AND ContentDocument.Title = :fileName LIMIT :recordLimit];            
        }
        else if(fileExtensionsCSV.length()>0){
			ContentDocumentLinks = [SELECT ContentDocumentId, ContentDocument.FileExtension, ContentDocument.Title, ContentDocument.Description, ContentDocument.LatestPublishedVersionId, ContentDocument.LatestPublishedVersion.VersionData FROM ContentDocumentLink WHERE LinkedEntityId = :linkedEntityId AND ContentDocument.FileExtension IN :(fileExtensionsCSV.split(',')) LIMIT :recordLimit];            
        } else {
            ContentDocumentLinks = [SELECT ContentDocumentId, ContentDocument.FileExtension, ContentDocument.Title, ContentDocument.Description, ContentDocument.LatestPublishedVersionId, ContentDocument.LatestPublishedVersion.VersionData FROM ContentDocumentLink WHERE LinkedEntityId = :linkedEntityId LIMIT :recordLimit];
        }
            
        
        for(ContentDocumentLink cdl:ContentDocumentLinks){
            wrapper wrapper = new wrapper();
            wrapper.contentDocLink = cdl;
            wrapper.imageSRC = 'https://'+URL.getSalesforceBaseUrl().getHost()+'/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId='+cdl.ContentDocument.LatestPublishedVersionId;
            wrapper.downloadURL = 'https://'+URL.getSalesforceBaseUrl().getHost()+'/sfc/servlet.shepherd/document/download/'+cdl.ContentDocumentId;
            wrappers.add(wrapper);
        }

        return wrappers;
    }
    
    public static string getRelationshipId(string fieldPath,sObject sobj){
        if(fieldPath.indexOf('.')>0){
			string relationshipField = fieldPath.substringBefore('.');
            sObject relatedSObject = sobj.getSObject(relationshipField);
            return getRelationshipId(fieldPath.substringAfter('.'),relatedSObject);
        } else {
            return String.ValueOf(sObj.get(fieldPath));
        }
    }
    
    public class wrapper {
        @AuraEnabled
        public ContentDocumentLink contentDocLink;
        @AuraEnabled
        public string imageSRC;
        @AuraEnabled
        public string downloadURL;
    }

}