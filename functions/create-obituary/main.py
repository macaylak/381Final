# add your create-obituary function here
import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Obituaries-30122680')

def lambda_handler(event, context):
    obituary = json.loads(event["body"])
    try:
        table.put_item(Item=obituary)
        return {
            "statusCode": 201,
            "body": "success"
        }
    except Exception as exp:
        print(f"exception: {exp}")
        return{
            "statusCode": 500,
            "body": json.dumps({
                "message": str(exp)
            })
        }