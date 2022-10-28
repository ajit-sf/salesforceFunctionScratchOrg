/**
 * @description       : Check Aadhaar from 3rd party database
 * @author            : Ajitesh
 * @group             : 
 * @last modified on  : 10-14-2022
 * @last modified by  : Ajitesh
**/
public class AadhaarValidationHelper {

    public class FlowInputVariable{
        @InvocableVariable
        public String aadhaar;
    }

    public class FlowOutputVariable{
        @InvocableVariable
        public String state;
    }
    
    /**
    * @description Validate aadhaar input from flow
    * @author Ajitesh | 10-14-2022 
    * @param inputVariable 
    * @return List<FlowOutputVariable> 
    **/
    @InvocableMethod(label = 'Validate Aadhaar')
    public static List<FlowOutputVariable> checkAadhaarDetails(List<FlowInputVariable> inputVariable){
        
        functions.Function fn = functions.Function.get('salesforceFunction.aadhaarvalidation');
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