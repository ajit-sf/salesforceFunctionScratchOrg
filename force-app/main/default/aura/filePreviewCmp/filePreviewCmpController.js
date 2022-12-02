({
	doInit : function(component, event, helper) {
        
        console.log(component.get('v.recordId'));
        console.log(component.get('v.sObjectName'));
        
		var action = component.get('c.getLinkedFiles');
        action.setParams({
            recordId:component.get('v.recordId'),
            sObjectName:component.get('v.sObjectName'),
            lookupFieldAPIName:component.get('v.lookupFieldAPIName'),
            fileName:component.get('v.fileName'),
            fileExtensionsCSV:component.get('v.fileExtensionsCSV'),
            recordLimit:component.get('v.recordLimit'),
            contentDocumentId:component.get('v.contentDocumentId')
        });
        
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                console.log(response.getReturnValue())
                component.set('v.files',response.getReturnValue()[0])
            } else {
                console.error('State:' + state);
            }
        })
        
        $A.getCallback(function() {
            $A.enqueueAction(action);
        })();
    }
})