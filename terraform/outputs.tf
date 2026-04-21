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

output "ecs_cluster_name" {
  value       = module.backend.ecs_cluster_name
  description = "ECS-Cluster-Name für CI (aws ecs update-service --cluster)"
}

output "ecs_service_name" {
  value       = module.backend.ecs_service_name
  description = "ECS-Service-Name für CI (aws ecs update-service --service)"
}

output "frontend_bucket_name" {
  value       = module.frontend.s3_bucket_name
  description = "S3-Bucket-Name für Frontend-Deploy (aws s3 sync)"
}

output "cloudfront_distribution_id" {
  value       = module.frontend.cloudfront_distribution_id
  description = "CloudFront-Distribution-ID für Cache-Invalidation"
}

output "ci_deploy_role_arn" {
  value       = module.ci.deploy_role_arn
  description = "ARN der IAM-Role für GitHub Actions OIDC (role-to-assume)"
}

