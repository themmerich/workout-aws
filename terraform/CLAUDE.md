# Terraform

AWS-Infrastruktur für workout-aws. Terraform ≥ 1.10, AWS Provider `~> 6.0`, Region `eu-central-1`.

## Struktur

- `main.tf` — Root: Provider-Pin, S3-Backend mit `use_lockfile = true` (natives State-Locking, Terraform ≥ 1.10), Modul-Verdrahtung, `default_tags` (`Project`, `ManagedBy`).
- `variables.tf`, `outputs.tf` — Root-Ein-/Ausgänge.
- `terraform.tfvars.example` — Vorlage. Die echte `terraform.tfvars` ist gitignored; dort landet mindestens `db_password`.
- `modules/`:
  - `networking/` — VPC 10.0.0.0/16 über 2 AZs, Public Subnets (ALB + ECS) und Private Subnets (RDS), 3 Security Groups, neutralisierte Default-SG. ECS-SG-Egress explizit gepflegt (HTTPS, RDS, DNS/UDP+TCP); RDS-SG ohne Egress. **Kein NAT Gateway**: ECS läuft im Public Subnet mit `map_public_ip_on_launch` — spart ~30 €/Monat, kostet ~3 €/Task IPv4-Gebühr.
  - `database/` — RDS PostgreSQL 16 auf `db.t3.micro`, gp3 20–100 GiB, `storage_encrypted = true`, Private Subnets. `db_name` via `replace("-", "_")` (RDS erlaubt keine Bindestriche).
  - `backend/` — ECR + Lifecycle, CloudWatch Logs, ECS Fargate (Cluster/Task/Service, `desired_count = 1`, `assign_public_ip = true`), ALB + Target Group (`deregistration_delay = 30`) + HTTP-Listener, `deployment_circuit_breaker { rollback = true }`.
  - `frontend/` — S3-Bucket (global-unique via Account-ID-Suffix), CloudFront mit Origin Access Control, zwei Origins: S3 für Assets und ALB für `/api/*` (Managed Cache Policies, `CachingDisabled` + `AllViewerExceptHostHeader`). Angular trifft `/api/*` same-origin — kein CORS nötig.

## Commands

Aus `terraform/`:

```bash
terraform init       # Backend + Provider; braucht AWS-Credentials
terraform fmt -recursive
terraform validate
terraform plan
terraform apply      # kostet laufend — erst wenn das Setup wirklich live soll
```

## Voraussetzungen

- **AWS-Credentials** im Terminal (Env-Vars oder `AWS_PROFILE`). Mindestrechte: VPC, RDS, ECS, ECR, ELB, CloudFront, S3, IAM, CloudWatch.
- **State-Bucket** `workout-aws-202533533588-terraform-state` in `eu-central-1` muss existieren — wird bewusst **nicht** von Terraform selbst verwaltet (Bootstrapping-Problem). Einmalig manuell anlegen (Versioning empfohlen).

### IPv6-Workaround für die HashiCorp-Registry

Wenn `terraform init` mit `wsarecv: An existing connection was forcibly closed` scheitert (passiert hier in Netzen mit brüchiger IPv6-Route zu Fastly/CloudFront), Provider manuell holen und lokalen Plugin-Dir nutzen:

```bash
# 1. Einmalig: Zip von https://releases.hashicorp.com/terraform-provider-aws/<version>/
#    nach %APPDATA%/terraform.d/plugins/registry.terraform.io/hashicorp/aws/<version>/windows_amd64/
#    entpacken (nur die .exe, nicht die Zip selbst — beide liegen lassen führt zu
#    "%1 is not a valid Win32 application").

# 2. Init mit explizitem Plugin-Dir (umgeht die Registry-Query komplett):
terraform init -plugin-dir="$APPDATA/terraform.d/plugins"
```

Folge-`init`s/`plan`s brauchen `-plugin-dir` nicht mehr — der Provider liegt dann im `.terraform/providers/`-Cache.

## Deployment-Reihenfolge (erstes Apply)

1. `terraform apply` — legt ECR, RDS, ALB, CloudFront, leerer S3-Bucket an (~10–15 Min wegen RDS + CloudFront).
2. Backend-Image bauen und pushen: `docker build -t <ecr-url>:latest backend/` → `docker push <ecr-url>:latest`. **Dockerfile muss `curl` enthalten** — der ECS-Container-Healthcheck ruft `curl -f http://localhost:8080/api/actuator/health` auf.
3. Angular bauen und in den Frontend-Bucket syncen: `cd frontend && npm run build && aws s3 sync dist/frontend/browser/ s3://<bucket>/ --delete`.
4. Optional CloudFront-Cache invalidieren: `aws cloudfront create-invalidation --distribution-id <id> --paths '/*'`.
5. ECS-Service pullt automatisch; Domain-Propagation dauert ~10 Min.

## Offene Punkte / Follow-ups

### Security (vor Prod-Rollout)

- **DB-Credentials** liegen aktuell als Klartext-Env-Vars in der ECS-Task-Definition → Umstieg auf `secrets`-Block + AWS Secrets Manager, Lesezugriff am `task_role_arn`.
- **HTTPS am ALB**: ACM-Cert + 443-Listener, Port 80 → 301 auf 443 redirecten.
- **CloudFront → ALB via HTTPS**: nach HTTPS am ALB `origin_protocol_policy = "https-only"` in `modules/frontend/main.tf` setzen.
- **`task_role_arn`** an die Task-Def, sobald die App AWS-APIs direkt aufruft (Secrets Manager, S3, …).
- **WAF** am CloudFront (`aws_wafv2_web_acl` → `web_acl_id`).
- **RDS härten**: `deletion_protection = true`, `skip_final_snapshot = false` + `final_snapshot_identifier`.

### Operability

- **Custom Domain am CloudFront**: Route-53-Zone + ACM-Cert in **`us-east-1`** (CloudFront-Pflicht) + `aliases` + `viewer_certificate.acm_certificate_arn`.
- **S3 Versioning** am Frontend-Bucket (`aws_s3_bucket_versioning`) für Deploy-Rollback.
- **Immutable Images**: `image_tag_mutability = "IMMUTABLE"` + Git-SHA-Tags statt `:latest`; ECS-Task-Def pro Deploy aktualisieren (z. B. via `aws ecs update-service --force-new-deployment`).
- **Performance Insights** (`performance_insights_enabled = true`) an RDS — kostenlos auf `db.t3.micro` mit 7-Tage-Retention.

### CI / Dev

- `terraform fmt -check` + `terraform validate` als GitHub-Action-Job.
- `tflint` / `tfsec` für Style- und Security-Checks.
- `Environment`-Tag (`dev` / `prod`) zusätzlich zu `Project`/`ManagedBy` in `default_tags`, sobald weitere Umgebungen dazukommen.
