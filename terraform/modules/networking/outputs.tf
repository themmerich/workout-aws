output "vpc_id" {
  value       = aws_vpc.main.id
  description = "ID der VPC"
}

output "public_subnet_ids" {
  value       = aws_subnet.public[*].id
  description = "IDs der Public Subnets (ALB + ECS)"
}

output "private_subnet_ids" {
  value       = aws_subnet.private[*].id
  description = "IDs der Private Subnets (nur RDS)"
}

output "alb_security_group_id" {
  value       = aws_security_group.alb.id
  description = "Security Group ID des Load Balancers"
}

output "ecs_security_group_id" {
  value       = aws_security_group.ecs.id
  description = "Security Group ID der ECS Container"
}

output "rds_security_group_id" {
  value       = aws_security_group.rds.id
  description = "Security Group ID der Datenbank"
}
