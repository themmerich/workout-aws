output "deploy_role_arn" {
  value       = aws_iam_role.deploy.arn
  description = "ARN der IAM-Role, die GitHub Actions via OIDC assumiert"
}
