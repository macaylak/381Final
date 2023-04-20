terraform {
  required_providers {
    aws = {
      version = ">= 4.0.0"
      source  = "hashicorp/aws"
    }
  }
}

provider "aws" {
  region = "ca-central-1"
}

## Lambda functions 
locals {
  function_name = "get-obituaries-30122680"
  get_obituaries_handler_name = "main.lambda_handler"
  get_obituaries_artifact_name = "get-obituaries-30122680-artifact.zip" 
}

locals {
  function_name1 = "create-obituary-30122680"
  create_obituary_handler_name = "main.lambda_handler"
  create_obituary_artifact_name = "create-obituary-30122680-artifact.zip" 
}

#Create a role for the get-obituaries-30122680 lambda function 
resource "aws_iam_role" "get_obituaries_lambda" {
  name = "iam-for-lambda-${local.function_name}"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

#Create a role for the create-obituary-30122680 lambda function 
resource "aws_iam_role" "create_obituary_lambda" {
  name = "iam-for-lambda-${local.function_name1}"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

#create archive file from main.py for get-obituaries-30122680
data "archive_file" "get_obituaries_lambda" {
  type = "zip"
  source_file = "../functions/get-obituaries-30122680/main.py"
  output_path = "get-obituaries-30122680-artifact.zip"
}

#create archive file from main.py for create-obituary-30122680
data "archive_file" "create_obituary_lambda" {
  type = "zip"
  source_dir = "../functions/create-obituary-30122680"
  output_path = local.create_obituary_artifact_name
}

# create a Lambda function get-obituaries-30122680
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function
resource "aws_lambda_function" "get_obituaries_lambda" {
  role          = aws_iam_role.get_obituaries_lambda.arn
  function_name = local.function_name
  handler       = local.get_obituaries_handler_name
  filename      = local.get_obituaries_artifact_name
  source_code_hash = data.archive_file.get_obituaries_lambda.output_base64sha256     
  runtime       = "python3.9"
  }

  # create a Lambda function create-obituary-30122680
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function
resource "aws_lambda_function" "create_obituary_lambda" {
  role          = aws_iam_role.create_obituary_lambda.arn
  function_name = local.function_name1
  handler       = local.create_obituary_handler_name
  filename      = local.create_obituary_artifact_name
  source_code_hash = data.archive_file.create_obituary_lambda.output_base64sha256   
  runtime       = "python3.9"
  timeout       = 20
  }

# create a policy for publishing logs to CloudWatch for get-obituaries-30122680 
resource "aws_iam_policy" "logs_get" {
  name        = "lambda-logging-${local.function_name}"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "dynamodb:Scan"
      ],
      "Resource": ["arn:aws:logs:*:*:*", "${aws_dynamodb_table.Obituary-30086612.arn}"],
      "Effect": "Allow"
    }
  ]
}
EOF
}

# create a policy for publishing logs to CloudWatch for create-obituary-30122680 
resource "aws_iam_policy" "logs_create" {
  name        = "lambda-logging-${local.function_name1}"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "dynamodb:PutItem",
        "ssm:GetParametersByPath",
        "polly:SynthesizeSpeech"
      ],
      "Resource": ["arn:aws:logs:*:*:*", "${aws_dynamodb_table.Obituary-30086612.arn}", "*", "*"],
      "Effect": "Allow"
    }
  ]
}
EOF
}

# attach the above policy to the function role
resource "aws_iam_role_policy_attachment" "lambda_logs_get" {
  role       = aws_iam_role.get_obituaries_lambda.name
  policy_arn = aws_iam_policy.logs_get.arn
}

# attach the above policy to the function role
resource "aws_iam_role_policy_attachment" "lambda_logs_create" {
  role       = aws_iam_role.create_obituary_lambda.name
  policy_arn = aws_iam_policy.logs_create.arn
}

# Create Lambda function URLs
resource "aws_lambda_function_url" "url_get" {
  function_name      = aws_lambda_function.get_obituaries_lambda.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["GET"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}

# Create Lambda function URLs
resource "aws_lambda_function_url" "url_create" {
  function_name      = aws_lambda_function.create_obituary_lambda.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["POST"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}

#Show the function url for get-obituaries-30122680 
output "get_obituaries_lambda_url" {
  value = aws_lambda_function_url.url_get.function_url
}

#Show the function url for create-obituary-30122680-30122680
output "create_obituary_lambda_url" {
  value = aws_lambda_function_url.url_create.function_url
}

# Creating DynamosDB table
resource "aws_dynamodb_table" "Obituary-30086612" {
  name         = "Obituary-30086612"
  billing_mode = "PROVISIONED"

  # up to 8KB read per second (eventually consistent)
  read_capacity = 1

  # up to 1KB per second
  write_capacity = 1

  # we only need a student id to find an item in the table; therefore, we
  # don't need a sort key here
  hash_key = "id"

  # the hash_key data type is string
  attribute {
    name = "id"
    type = "S"
  }
}