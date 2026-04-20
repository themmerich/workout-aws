variable "project_name" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "public_subnet_ids" {
  type = list(string)
}

variable "db_url" {
  type      = string
  sensitive = true
}

variable "db_password" {
  type      = string
  sensitive = true
}
