
echo ""
echo "Authentication Salesforce function space:"
echo ""


echo "Logging into the Salesforce function space"
sf login functions


echo "Deleting Compute enviroment to save up space ..... "
sf env delete -e s3env

echo "Deleted sucessfully"

