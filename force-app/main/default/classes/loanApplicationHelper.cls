/**
 * @description       : 
 * @author            : Indu
 * @group             : 
 * @last modified on  : 11-02-2022
 * @last modified by  : Indu
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
}