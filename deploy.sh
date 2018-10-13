#aws s3 mb s3://trellomatic-bucket

sam package \
--template-file template.yaml \
--output-template-file packaged.yaml \
--s3-bucket trellomatic-bucket

sam deploy \
--template-file packaged.yaml \
--stack-name trellomatic \
--capabilities CAPABILITY_IAM