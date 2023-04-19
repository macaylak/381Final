import json
import base64
import boto3
import time
import hashlib
import requests
from requests_toolbelt.multipart import decoder
import os


client = boto3.client("polly")

dynamodb_resource = boto3.resource("dynamodb")
table = dynamodb_resource.Table("Obituary-30086612")

ssm_client = boto3.client("ssm")
response = ssm_client.get_parameters_by_path(
    Path='/the-last-show/',
    Recursive=True,
    WithDecryption=True,
)

keys = {item['Name']: item['Value'] for item in response['Parameters']}
"""
{
    "/the-last-show/cloudinary" : "the value",
    "/the-last-show/cloudinary-api" : "the value",
    "/the-last-show/chat" : "the value",
}
"""

def get_parameter(parameter_name):
    return keys.get(parameter_name, None)
    

def gpt_response(prompt):
    GPT_key = get_parameter("/the-last-show/chat-gpt-key") 
    url = "https://api.openai.com/v1/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {GPT_key}"
    }
    body = {
        "model": "text-davinci-003",
        "prompt": prompt,
        "max_tokens": 600,
        "temperature": 0.2
    }
    res = requests.post(url, headers=headers, json=body)
    response_json = json.loads(res.text)
    return response_json["choices"][0]["text"]


def upload_to_cloudinary(filename, resource_type):
    cloudinary_api_secret = get_parameter("/the-last-show/cloudinary-api-secret")
    cloudinary_api_key = get_parameter("/the-last-show/cloudinary-api-key")
    print(cloudinary_api_secret, cloudinary_api_key)
    cloud_name = "dxvulzhvt"

    body = {
        "api_key": cloudinary_api_key,
    }

    files = {
        "file": open(filename, "rb")
    }

    body["signature"] = create_signature(body, cloudinary_api_secret)
    url = f"https://api.cloudinary.com/v1_1/{cloud_name}/{resource_type}/upload"
    res = requests.post(url, files=files, data=body)
    print(res.json())
    return res.json()

def create_signature(body, secret_key):
    exclude = ["api_key", "resource_type", "cloud_name"]
    timestamp = int(time.time())
    body["timestamp"] = timestamp

    sorted_body = sort_dict(body, exclude)
    query_string = query_string_create(sorted_body)

    query_string_appended = f"{query_string}{secret_key}"
    hashed = hashlib.sha1(query_string_appended.encode())
    return hashed.hexdigest()

def sort_dict(dictionary, exclude):
    return {k: v for k, v in sorted(dictionary.items(), key=lambda item: item[0]) if k not in exclude}

def query_string_create(body):
    q_string = ""
    for idx, (k,v) in enumerate(body.items()):
        if idx == 0:
            q_string = f"{k}={v}"
        else:
            q_string = f"{q_string}&{k}={v}"

    return q_string

def polly_speech(prompt):
    response = client.synthesize_speech(
        Engine='standard',
        LanguageCode='en-US',
        OutputFormat='mp3',
        Text = prompt,
        TextType = 'text',
        VoiceId = 'Joanna'
    )

    filename = "/tmp/polly.mp3"
    with open(filename, "wb") as f:
        f.write(response["AudioStream"].read())
    
    return filename

def lambda_handler(event, context):
    body = event["body"]
    if event["isBase64Encoded"]:
        body = base64.b64decode(body)

    content_type = event["headers"]["content-type"]
    data = decoder.MultipartDecoder(body, content_type)

    binary_data = [part.content for part in data.parts]
    name = binary_data[1].decode()
    born_year = binary_data[2].decode()
    died_year = binary_data[3].decode()
    id = binary_data[4].decode()

    key = "/tmp/obituary.png"
    with open(key, "wb") as f:
        f.write(binary_data[0])

    res_img = upload_to_cloudinary(key, resource_type="image")
    chatgpt_prompt = gpt_response(
        f"write a funny obituary about a fictional character named {name} who was born on {born_year} and died on {died_year}."
    )

    voice_prompt = polly_speech(chatgpt_prompt)
    res_mp3 = upload_to_cloudinary(voice_prompt, resource_type="raw")

    item = {
        "id":id,
        "name":name,
        "born_year":born_year,
        "died_year":died_year,
        "img_resp": res_img["secure_url"],
        "chatgpt":chatgpt_prompt,
        "polly_resp": res_mp3["secure_url"],
    }

    try:
        table.put_item(Item=item)
        return {
            "statusCode": 200,
            "body": json.dumps(item)
        }
    except Exception as ex:
        print(f"Exception: {ex}")
        return {
            "statusCode": 500,
            "body": json.dumps({
                "message": str(ex)
            })
        }