/**
 * @description       : 
 * @author            : Indu
 * @group             : 
 * @last modified on  : 10-28-2022
 * @last modified by  : Indu
**/
public class CibilScoreHelper {
     @AuraEnabled
    public static string checkCibilScore(){
            functions.Function fn = functions.Function.get('salesforceFunction.cibilscorefunction');
            functions.FunctionInvocation invocation = fn.invoke('');
    
            // Check if there is any error during the invocation
            if (invocation.getStatus() == functions.FunctionInvocationStatus.ERROR) {
                throw new CalloutException(
                (invocation.getError() != null
                    ? invocation.getError().getMessage()
                    : 'UNKNOWN')
                );
            }
            String response = invocation.getResponse();
        	System.debug('Response '+response);
        return response;
    }
}