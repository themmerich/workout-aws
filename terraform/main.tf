terraform {
  required_version = ">= 1.10"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }

  backend "s3" {
    bucket       = "workout-aws-202533533588-terraform-state"
    key          = "prod/terraform.tfstate"
    region       = "eu-central-1"
    use_lockfile = true
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project   = var.project_name
      ManagedBy = "terraform"
    }
  }
}

module "networking" {
  source       = "./modules/networking"
  project_name = var.project_name
}

module "database" {
  source                = "./modules/database"
  project_name          = var.project_name
  subnet_ids            = module.networking.private_subnet_ids
  rds_security_group_id = module.networking.rds_security_group_id
  db_username           = var.db_username
  db_password           = var.db_password
}

module "backend" {
  source                = "./modules/backend"
  project_name          = var.project_name
  aws_region            = var.aws_region
  vpc_id                = module.networking.vpc_id
  public_subnet_ids     = module.networking.public_subnet_ids
  alb_security_group_id = module.networking.alb_security_group_id
  ecs_security_group_id = module.networking.ecs_security_group_id
  db_endpoint           = module.database.db_endpoint
  db_name               = module.database.db_name
  db_username           = var.db_username
  db_password           = var.db_password
}

module "frontend" {
  source       = "./modules/frontend"
  project_name = var.project_name
  api_url      = module.backend.api_url
}
