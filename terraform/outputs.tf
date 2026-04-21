output "backend_alb_dns_name" {
  value = module.backend.alb_dns_name
}

output "backend_api_url" {
  value = module.backend.api_url
}

output "frontend_url" {
  value = module.frontend.cloudfront_domain
}

output "db_endpoint" {
  value     = module.database.db_endpoint
  sensitive = true
}
