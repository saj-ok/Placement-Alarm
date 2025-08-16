Need improment:

1. Profile page slow loading problem :Convrt the user image into a url using any third party api then save the url in the database 
2. Add pagination to Company list on the table , at time only load 5 company for faster loading.
3. Status-update-model issue : Its Should independently update each filed withoout depending on the other filed , for example if we want to change the status field then it should not affect the other field like Date&time and Note , they should be keep same as it before until the user made any  changes in that fields and Do not make thier value null if there is no changes in those fields .
4. Notification timing issue :  The Two notication should send in time interval of 60 minutes.
5. 