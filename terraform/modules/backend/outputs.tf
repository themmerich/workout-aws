output "ecr_repository_url" {
  value = aws_ecr_repository.main.repository_url
}

output "ecr_repository_arn" {
  value = aws_ecr_repository.main.arn
}

output "alb_dns_name" {
  value = aws_lb.main.dns_name
}

output "api_url" {
  value = "http://${aws_lb.main.dns_name}"
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.main.name
}

output "ecs_cluster_arn" {
  value = aws_ecs_cluster.main.arn
}

output "ecs_service_name" {
  value = aws_ecs_service.main.name
}

output "ecs_service_arn" {
  value = aws_ecs_service.main.id
}

output "ecs_task_execution_role_arn" {
  value = aws_iam_role.ecs_execution.arn
}
