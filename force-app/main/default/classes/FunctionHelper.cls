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
        public String aadharName;
    }

    public class FlowOutputVariable{
        @InvocableVariable
        public String state;
    }
    
    @InvocableMethod(label = 'Review Aadhaar')
    public static List<FlowOutputVariable> checkAadhaarDetails(List<FlowInputVariable> inputVariable){
        System.debug(' input variable ' + inputVariable[0]);
        return null;
    }
    
}
