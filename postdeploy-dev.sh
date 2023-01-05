

echo ""
echo "Authentication Salesforce function space:"
echo ""


echo "Logging into the Salesforce function space"
sf login functions


echo "Creating compute enviroment to deploy function"
sf env create compute --alias s3env --connected-org s3  


echo "Deploying function......"
sf deploy functions -o s3

echo "Deployment sucess"

echo "You are ready to go!"