variable "aws_region" {
  type    = string
  default = "eu-central-1"
}

variable "project_name" {
  type    = string
  default = "workout-aws"
}

variable "db_password" {
  type      = string
  sensitive = true
}
