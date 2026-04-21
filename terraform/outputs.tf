output "backend_alb_dns_name" {
  value = module.backend.alb_dns_name
}

output "backend_api_url" {
  value = module.backend.api_url
}

output "frontend_url" {
  value       = module.frontend.cloudfront_domain
  description = "URL deiner Angular App"
}

output "db_endpoint" {
  value     = module.database.db_endpoint
  sensitive = true
}

output "ecr_repository_url" {
  value       = module.backend.ecr_repository_url
  description = "ECR Repository URL für Docker Push"
}

output "ci_deploy_role_arn" {
  value       = module.ci.deploy_role_arn
  description = "ARN der IAM-Role für GitHub Actions OIDC (role-to-assume)"
}

