variable "project_name" {
  type = string
}

variable "github_repository" {
  type        = string
  description = "GitHub-Repo (owner/name) für OIDC-Trust, z. B. themmerich/workout-aws"
}

variable "ecr_repository_arn" {
  type = string
}

variable "ecs_cluster_arn" {
  type = string
}

variable "ecs_service_arn" {
  type = string
}

variable "ecs_task_execution_role_arn" {
  type = string
}

variable "frontend_bucket_arn" {
  type = string
}

variable "cloudfront_distribution_arn" {
  type = string
}
