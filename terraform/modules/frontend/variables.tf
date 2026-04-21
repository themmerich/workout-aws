variable "project_name" {
  type = string
}

variable "api_host" {
  type        = string
  description = "ALB-DNS ohne Schema (wird als CloudFront-Origin fuer /api/* genutzt)"
}
