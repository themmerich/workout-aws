output "cloudfront_domain" {
  value = aws_cloudfront_distribution.main.domain_name
}

output "s3_bucket_name" {
  value = aws_s3_bucket.main.bucket
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.main.id
}

output "s3_bucket_arn" {
  value = aws_s3_bucket.main.arn
}

output "cloudfront_distribution_arn" {
  value = aws_cloudfront_distribution.main.arn
}
