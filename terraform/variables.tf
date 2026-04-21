variable "aws_region" {
  type    = string
  default = "eu-central-1"
}

variable "project_name" {
  type    = string
  default = "workout-aws"
}

variable "db_username" {
  type    = string
  default = "dbadmin"
}

variable "db_password" {
  type      = string
  sensitive = true
}

variable "github_repository" {
  type        = string
  default     = "themmerich/workout-aws"
  description = "GitHub-Repo (owner/name) für OIDC-Trust"
}
