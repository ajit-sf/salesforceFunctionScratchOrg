/**
 * @description       : 
 * @author            : Ajitesh
 * @group             : 
 * @last modified on  : 10-13-2022
 * @last modified by  : Ajitesh
**/
public class FunctionHelper {

    public class FlowInputVariable{
        @InvocableVariable
        public String aadhaar;
    }

    public class FlowOutputVariable{
        @InvocableVariable
        public String state;
    }
    
    @InvocableMethod(label = 'Review Aadhaar')
    public static List<FlowOutputVariable> checkAadhaarDetails(List<FlowInputVariable> inputVariable){
        
        functions.Function fn = functions.Function.get('salesforceFunction.myfunction');
        functions.FunctionInvocation invocation = fn.invoke(JSON.serialize(inputVariable[0]));

        // Check if there is any error during the invocation
        if (invocation.getStatus() == functions.FunctionInvocationStatus.ERROR) {
            throw new CalloutException(
            (invocation.getError() != null
                ? invocation.getError().getMessage()
                : 'UNKNOWN')
            );
        }
  
        String response = invocation.getResponse();

        FlowOutputVariable output = (FlowOutputVariable) JSON.deserialize(response, FlowOutputVariable.class);

        return new List<FlowOutputVariable>{output};
    }
    
}