terraform {
  required_version = ">= 1.6"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket = "workout-aws-202533533588-terraform-state"
    key    = "prod/terraform.tfstate"
    region = "eu-central-1"
  }
}

provider "aws" {
  region = var.aws_region
}

module "networking" {
  source = "./modules/networking"
  project_name = var.project_name
}

module "database" {
  source       = "./modules/database"
  project_name = var.project_name
  vpc_id       = module.networking.vpc_id
  subnet_ids   = module.networking.private_subnet_ids
  db_password  = var.db_password
}

module "backend" {
  source            = "./modules/backend"
  project_name      = var.project_name
  vpc_id            = module.networking.vpc_id
  public_subnet_ids = module.networking.public_subnet_ids
  db_url            = module.database.db_url
  db_password       = var.db_password
}

module "frontend" {
  source       = "./modules/frontend"
  project_name = var.project_name
  api_url      = module.backend.alb_dns_name
}
