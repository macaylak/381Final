# add your get-obituaries function here
import json
import boto3

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("Obituary-30086612")

def lambda_handler(event, context):
    # email = event["queryStringParameters"]["email"]

    try:
        res = table.scan()
        return {
            "statusCode": 200,
            "body": json.dumps(res["Items"])
        }
    except Exception as exp:
        print(exp)
        return {
            "statusCode": 500,
            "body":json.dumps({
                "message":str(exp)
        })
}