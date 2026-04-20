variable "aws_region" {
  default = "eu-central-1"
}

variable "project_name" {
  default = "myproject"
}

variable "db_password" {
  sensitive = true
}
