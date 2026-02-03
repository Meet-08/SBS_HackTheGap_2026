# Pipeline Plug-and-Play Guide

This guide details how to drop this CI/CD pipeline into a **NEW** project and configure it in under 10 minutes.

## 1. Copy Files

Copy the following folders/files from this repository to your new project root:

- `/.github/` (Workflows and Actions)
- `/terraform/` (Infrastructure)
- `/ansible/` (Configuration)
- `docker-compose.yml` (Orchestration)

## 2. Global Find & Replace

Perform a global find and replace in your **entire project workspace** (specifically in the copied `terraform`, `ansible`, and `.github` folders).

| Find                  | Replace With                |
| :-------------------- | :-------------------------- |
| `SBS_HackTheGap_2026` | `YourNewProjectName`        |
| `sbs-key`             | `your-project-key-name`     |
| `Meet-08`             | `YourTerraformCloudOrgName` |

> **Verify:** check `ansible/playbook.yml`, `terraform/ec2.tf`, and `.github/workflows/infra.yml` to ensure these values are updated.

## 3. Infrastructure Config (`/terraform`)

1.  **Generate SSH Key**:
    Run this command inside the `terraform/` folder:

    ```bash
    ssh-keygen -t rsa -b 4096 -f your-project-key-name.pem
    ```

    _Ensure `_.pem`is added to your`.gitignore`.\*

2.  **Update `ec2.tf`**:
    - Verify `key_name` matches your new key (should be updated by Step 2).
    - Update `ami` if you need a different OS or Region (default is `ap-south-1` Ubuntu).

## 4. GitHub Configuration

Go to **Settings > Secrets and variables > Actions** in your new repository.

### 4.1 Secrets

| Secret Name       | Value                                                   |
| :---------------- | :------------------------------------------------------ |
| `TF_API_TOKEN`    | Your Terraform Cloud User Token.                        |
| `AWS_ROLE_ARN`    | The ARN of your AWS IAM Role for GitHub Actions.        |
| `SSH_KEY_B64`     | Run: `base64 -w 0 terraform/your-project-key-name.pem`  |
| `DOCKERHUB_TOKEN` | Your DockerHub Access Token.                            |
| `APP_SECRETS`     | Any other env vars your app needs (e.g. `DB_PASSWORD`). |

### 4.2 Variables

| Variable Name        | Value                       |
| :------------------- | :-------------------------- |
| `SSH_KEY_NAME`       | `your-project-key-name.pem` |
| `DOCKERHUB_USERNAME` | Your DockerHub Username.    |
| `APP_VARS`           | Any public env vars.        |

## 5. Application Config

1.  **Docker Compose**: Update `docker-compose.yml` with your actual services.
2.  **Ansible Templates**:
    - Go to `ansible/roles/create_env/templates/`.
    - Rename `.env.j2` if needed.
    - **Crucial**: Update the content to matching your new project's environment variables.
3.  **Workflow Matrix**:
    - Open `.github/workflows/deploy.yml`.
    - Update the `matrix` services list (e.g., `backend=src/api`, `frontend=src/web`).

## 6. Deploy

1.  **Push Code**: Commit and push the `terraform` folder first to trigger infrastructure creation.
2.  **Check Actions**: Go to the "Actions" tab to watch the `Infrastructure & Deploy` workflow.

## 7. adapting for Non-Docker Projects (e.g., Go, Node.js)

This pipeline is **runtime-agnostic**. While the default setup uses Docker, the core workflow (Terraform -> GitHub Actions -> Ansible) remains the same for any technology.

To use something else (e.g., a raw Go binary or PM2) instead of Docker:

1.  **GitHub Actions (`deploy.yml`)**:
    - Replace the `build-and-push` job (which makes Docker images) with your specific build steps (e.g., `go build`).
    - Upload the binary as a GitHub Action Artifact or push it to S3/SCP it to the server.

2.  **Ansible (`playbook.yml` / roles)**:
    - Remove the `docker` dependencies.
    - Update tasks to:
      - Download your binary/code.
      - Manage the service (e.g., using `systemd` to start the Go binary).

The infrastructure (Terraform) and orchestration (GitOps flow) work exactly the same way.
