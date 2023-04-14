#this is the actual one
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

# the locals block is used to declare constants that
# you can use throughout your code
locals {
  get_obituaries_30086612_function_name = "get-obituary-30086612"
  get_obituaries_30086612_handler_name  = "main.lambda_handler"
  get_obituaries_30086612_artifact_name = "artifact_get_obituaries.zip"

  create_obituary_30086612_function_name = "create-obituary-30086612"
  create_obituary_30086612_handler_name  = "main.lambda_handler"
  create_obituary_30086612_artifact_name = "artifact_create_obituary.zip"

}

# created iam role lambda
resource "aws_iam_role" "lambda" {
  name = "iam-for-lambda-${local.get_obituaries_30086612_function_name}"
<<<<<<< HEAD
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Effect = "Allow"
        Sid    = ""
      }
    ]
  })
=======
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
>>>>>>> 21fd22e02b165a619c790354dc0698689f999cf1
}

# create archive file from main.py
data "archive_file" "lambda_create_obituary_30086612" {
  type        = "zip"
<<<<<<< HEAD
  source_dir = "functions/create-obituary-30086612"  ####***PROF CHANGED THIS TO source_dir = "../functions/create-obituary-30086612"#### then ranexec terraform apply command credentail one this showed the request toolbelt librarires in dynamodb inline
=======
  source_dir = "../functions/create-obituary"  ####***PROF CHANGED THIS TO source_dir = "../functions/create-obituary-30086612"#### then ranexec terraform apply command credentail one this showed the request toolbelt librarires in dynamodb inline
>>>>>>> 21fd22e02b165a619c790354dc0698689f999cf1
  output_path = local.create_obituary_30086612_artifact_name
}

data "archive_file" "lambda_get_obituaries_30086612" {
  type        = "zip"
<<<<<<< HEAD
  source_file = "functions/get-obituaries-30086612/main.py"
=======
  source_file = "../functions/get-obituaries/main.py"
>>>>>>> 21fd22e02b165a619c790354dc0698689f999cf1
  output_path = local.get_obituaries_30086612_artifact_name
}

# two lambda functions w/ function url
# create a Function URL for Lambda
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function_url
resource "aws_lambda_function_url" "get_obituaries" {
  function_name      = aws_lambda_function.lambda_get_obituaries_30086612.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["GET"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}

resource "aws_lambda_function_url" "create_obituary" {
  function_name      = aws_lambda_function.lambda_create_obituary_30086612.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["POST"]
<<<<<<< HEAD
    allow_headers     = ["*"]
=======
    allow_headers     = ["Content-Type"]
>>>>>>> 21fd22e02b165a619c790354dc0698689f999cf1
    expose_headers    = ["keep-alive", "date"]
  }
}

# show the Function URL after creation
#502 Bad Gateway error fix this
output "lambda_get_obituaries_30086612_url" {
  value = aws_lambda_function_url.get_obituaries.function_url
}

#502 Bad Gateway error fix this
output "lambda_create_obituary_30086612_url" {
  value = aws_lambda_function_url.create_obituary.function_url
}

# create a Lambda function
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function
resource "aws_lambda_function" "lambda_get_obituaries_30086612" {
  role             = aws_iam_role.lambda.arn                     #this lambda doesnt change i think
  function_name    = local.get_obituaries_30086612_function_name #same change to others
  handler          = local.get_obituaries_30086612_handler_name
  filename         = local.get_obituaries_30086612_artifact_name
  source_code_hash = data.archive_file.lambda_get_obituaries_30086612.output_base64sha256 #is this right****

  # see all available runtimes here: https://docs.aws.amazon.com/lambda/latest/dg/API_CreateFunction.html#SSS-CreateFunction-request-Runtime
  runtime = "python3.9"
}

resource "aws_lambda_function" "lambda_create_obituary_30086612" {
  role             = aws_iam_role.lambda.arn
  function_name    = local.create_obituary_30086612_function_name
  handler          = local.create_obituary_30086612_handler_name
  filename         = local.create_obituary_30086612_artifact_name
<<<<<<< HEAD
  source_code_hash = data.archive_file.lambda_create_obituary_30086612.output_base64sha256
=======
  source_code_hash = "50c333e444458be2fd31c96df437c5ee3e40b6e2b4bb35f2d0c3b482cbbbd8b9" # is this right****
>>>>>>> 21fd22e02b165a619c790354dc0698689f999cf1

  # see all available runtimes here: https://docs.aws.amazon.com/lambda/latest/dg/API_CreateFunction.html#SSS-CreateFunction-request-Runtime
  runtime = "python3.9"
}



# one dynamodb table



# roles and policies as needed

# create a policy for publishing logs to CloudWatch
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy
resource "aws_iam_policy" "logs" {
<<<<<<< HEAD
  name        = "lambda-logging-${local.get_obituaries_30086612_function_name}"
=======
  name        = "lambda-logging-${local.create_obituary_30086612_function_name}"
>>>>>>> 21fd22e02b165a619c790354dc0698689f999cf1
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
        "dynamodb:Query",
        "dynamodb:DeleteItem"
      ],
      "Resource": ["arn:aws:logs:::*",
<<<<<<< HEAD
"${aws_dynamodb_table.Obituaries_table_test.arn}"],
=======
"${aws_dynamodb_table.Obituaries-30122680.arn}"],
>>>>>>> 21fd22e02b165a619c790354dc0698689f999cf1
      "Effect": "Allow"
    }
  ]
}
EOF
}


# attach the above policy to the function role
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment
resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda.name # not sure if the name here is right
  policy_arn = aws_iam_policy.logs.arn
}





# read the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/dynamodb_table
<<<<<<< HEAD
resource "aws_dynamodb_table" "Obituaries_table_test" {
  name         = "Obituaries_table_test"
=======
resource "aws_dynamodb_table" "Obituaries-30122680" {
  name         = "Obituaries-30122680"
>>>>>>> 21fd22e02b165a619c790354dc0698689f999cf1
  billing_mode = "PROVISIONED"

  # up to 8KB read per second (eventually consistent)
  read_capacity = 1

  # up to 1KB per second
  write_capacity = 1

  # we only need a name to find an item in the table; therefore, we
  # don't need a range key here
<<<<<<< HEAD
  hash_key = "id"   #diff for each obituray 
=======
  range_key = "id"   #diff for each obituray 
  hash_key =  "name"
>>>>>>> 21fd22e02b165a619c790354dc0698689f999cf1

  # the hash_key data type is string
  attribute {
    name = "id"
    type = "S"
  }

<<<<<<< HEAD


=======
  attribute {
    name = "name"
    type = "S"
  }
>>>>>>> 21fd22e02b165a619c790354dc0698689f999cf1
}

# step functions (if you're going for the bonus marks)

