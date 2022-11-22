/**
 * @description       : 
 * @author            : Indu
 * @group             : 
 * @last modified on  : 11-22-2022
 * @last modified by  : Ajitesh
**/
public class loanApplicationHelper {
    @AuraEnabled
    public static Id insertLead(String jsonOfLead) 
	{        
        Lead leadRecord = (Lead) JSON.deserialize(jsonOfLead, Lead.class);
        System.debug(jsonOfLead+' Lead '+leadRecord);
        Insert leadRecord;
        system.debug('Lead records '+leadRecord.Id);
        return leadRecord.Id;
    }
    @AuraEnabled
    public static Id updateLead(String jsonOfLead) 
	{        
        Lead leadRecord = (Lead) JSON.deserialize(jsonOfLead, Lead.class);
        System.debug(jsonOfLead+' Lead '+leadRecord);
        update leadRecord;
        system.debug('Lead records '+leadRecord.Id);
        return leadRecord.Id;
    }
}