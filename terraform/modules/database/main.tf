# Subnet Group — definiert in welchen Subnets RDS laufen darf
resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-db-subnet-group"
  subnet_ids = var.subnet_ids

  tags = {
    Name = "${var.project_name}-db-subnet-group"
  }
}

# RDS PostgreSQL Instanz
resource "aws_db_instance" "main" {
  identifier     = "${var.project_name}-db"
  engine         = "postgres"
  engine_version = "16"
  instance_class = "db.t3.micro"

  # Storage
  allocated_storage     = 20
  max_allocated_storage = 100
  storage_type          = "gp3"
  storage_encrypted     = true

  # Datenbank (RDS-db_name erlaubt keine Bindestriche)
  db_name  = replace(var.project_name, "-", "_")
  username = var.db_username
  password = var.db_password

  # Netzwerk
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [var.rds_security_group_id]
  publicly_accessible    = false

  # Verfügbarkeit
  multi_az = false

  # Backups
  backup_retention_period = 7
  backup_window           = "03:00-04:00"
  maintenance_window      = "Mon:04:00-Mon:05:00"

  # Einstieg: Deletion Protection aus
  deletion_protection = false

  # Beim Löschen keinen finalen Snapshot erstellen
  skip_final_snapshot = true

  tags = {
    Name = "${var.project_name}-db"
  }
}
