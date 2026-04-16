# 🚀 End-to-End DevOps Automation Project (AWS EKS)

## 📌 Project Overview

This project demonstrates a complete, production-ready DevOps pipeline that automates infrastructure provisioning, application deployment, secure secret management, and monitoring using modern DevOps tools and AWS services.

---

## 🧱 Project Components

* **Infrastructure as Code:** Terraform (VPC, EKS, ECR)
* **CI/CD Automation:** Jenkins (Infra & Application Pipelines)
* **Containerization:** Docker
* **Container Registry:** AWS ECR
* **Orchestration:** Kubernetes (EKS)
* **Secrets Management:** AWS Secrets Manager + External Secrets Operator
* **Monitoring:** Prometheus & Grafana
* **Security & Scanning:** SonarQube (SAST), Trivy (Image Scanning), Checkov (IaC Scanning)

---

## 🔄 End-to-End Workflow

1. Developer pushes code to GitHub
2. Jenkins triggers CI/CD pipeline
3. Checkov scans Terraform code for misconfigurations
4. Terraform provisions AWS infrastructure (EKS, VPC)
5. SonarQube performs SAST on Application Code
6. Docker builds the application image
7. Trivy scans the Docker image for vulnerabilities
8. Image is pushed to AWS ECR
9. Kubernetes deploys the application
10. External Secrets fetch credentials securely
11. Prometheus collects metrics and Grafana visualizes them

---

## ⚙️ Pre-requisites

Before execution, ensure:

* AWS CLI configured (`aws configure`)
* Terraform installed
* Docker installed
* kubectl configured
* Helm installed
* Jenkins setup with required credentials

---

## 🚀 Execution Steps

### 1. Push Code to GitHub Repository

### 2. Run Infrastructure Pipeline (Terraform)

* Infrastructure Code is scanned using Checkov
* Initializes and provisions AWS resources (EKS, VPC, ECR)

### 3. Run Application Pipeline

* SonarQube scans Application Code (SAST)
* Builds Docker image
* Trivy scans Docker image for vulnerabilities
* Pushes image to ECR
* Deploys application to Kubernetes

### 4. Configure Secrets

* Store credentials in AWS Secrets Manager
* Sync using External Secrets Operator

### 5. Setup Monitoring

* Install Prometheus & Grafana using Helm
* Access dashboards for cluster and application metrics

---

## 🔐 Security Best Practices

* No hardcoded credentials
* Secrets managed via AWS Secrets Manager
* IAM roles used for secure access
* Kubernetes secrets dynamically injected

---

## 🎯 Key Features

* Fully automated CI/CD pipeline
* Scalable Kubernetes deployment
* Secure secret management
* Infrastructure automation using Terraform
* Real-time monitoring and observability

---

## 🎤 Interview Explanation

This project implements an end-to-end DevOps workflow where infrastructure is provisioned using Terraform, application delivery is automated via Jenkins CI/CD pipelines, containerization is handled using Docker, and deployment is managed through Kubernetes on AWS EKS. Secure credential handling is achieved using AWS Secrets Manager integrated with External Secrets, and system monitoring is implemented using Prometheus and Grafana.

---

## 🚀 Final Outcome

* Automated deployments with zero downtime
* Secure and scalable architecture
* Industry-level DevOps implementation
* Ready for real-world production scenarios

---

## 📖 Complete Step-by-Step Guide

### Step 1: Git Repository Setup & Push
First, initialize your local project as a Git repository and push it to GitHub:
```bash
# Initialize git in the root of your project
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit of DevOps Automation Project"

# Create a repository on GitHub, then link it:
# git branch -M main
# git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
# git push -u origin main
```

### Step 2: Install Prerequisites
> [!NOTE]
> The commands below are for a **Linux-based Jenkins Server (Ubuntu/Debian)**. If you are running this locally on **Windows**, please install Docker Desktop for Windows, use the HashiCorp installer for Terraform, and the official Windows MSI for AWS CLI.

Make sure your Jenkins Server (or local agent) has the necessary tools installed globally:
1. **AWS CLI:** `sudo apt install awscli` (For Windows: Download the AWS CLI MSI installer)
2. **Terraform:** Follow the official HashiCorp installation guide for your OS.
3. **Docker:** `sudo apt install docker.io` (For Windows: Install Docker Desktop) - *Important for Linux: Ensure the `jenkins` user is given permissions by adding it to the `docker` group*
4. **kubectl:** Follow the Kubernetes official installation guide.
5. **Helm:** Follow the Helm official installation guide.
6. **Security Scanners:** Install `sonar-scanner`, `trivy`, and `checkov` binaries on the server.

### Step 3: Create AWS Secrets Object (For Application)
You need an AWS Secrets Manager secret for the application to magically consume via the External Secrets Operator.
```bash
aws secretsmanager create-secret \
    --name prod/devops-app/secrets \
    --secret-string '{"MY_APP_SECRET":"my-super-secret-value"}'
```

### Step 4: Configure Jenkins Plugins
Navigate to **Jenkins Dashboard** -> **Manage Jenkins** -> **Plugins** -> **Available plugins**. 
Ensure these are installed (and restart Jenkins if required):
* **Pipeline** (Core pipeline components)
* **AWS Credentials** (Required for binding AWS keys in your pipelines)
* **GitHub Integration Plugin** (Required for Webhook triggers)
* **Docker Pipeline** (Allows Jenkins pipeline to run `docker build`)

### Step 5: Configure Jenkins Credentials
Navigate to **Manage Jenkins** -> **Credentials** -> **System** -> **Global credentials**.
* Add a new credential.
* **Kind (Type):** AWS Credentials.
* **ID:** `aws-credentials` *(This EXACT string is mapped in the Jenkinsfiles, do not change it!)*
* **Access Key ID:** *Your AWS IAM Access Key*
* **Secret Access Key:** *Your AWS IAM Secret Key*

### Step 6: Create the Jenkins Pipelines
You will create two separate pipeline jobs in Jenkins to segregate infrastructure and application concerns:

**Pipeline 1: Infrastructure Pipeline**
1. Click **New Item** -> Name it `Infra-Pipeline` -> Select **Pipeline** -> OK.
2. Under the "Pipeline" section, select **Pipeline script from SCM**.
3. SCM: **Git**. Enter your GitHub Repository URL.
4. Script Path: `Jenkinsfile.infra`
5. Save.

**Pipeline 2: Application Pipeline**
1. Click **New Item** -> Name it `App-Pipeline` -> Select **Pipeline** -> OK.
2. Under the "Build Triggers" section, check **GitHub hook trigger for GITScm polling**.
3. Under the "Pipeline" section, select **Pipeline script from SCM**.
4. SCM: **Git**. Enter your GitHub Repository URL.
5. Script Path: `Jenkinsfile.app`
6. Save.

### Step 7: Configure GitHub Webhook
This is necessary to trigger the Application Pipeline automatically when code is pushed to the repository:
1. Go to your GitHub Repository -> **Settings** -> **Webhooks**.
2. Click **Add webhook**.
3. **Payload URL:** `http://<YOUR_JENKINS_URL>:8080/github-webhook/`
4. **Content type:** `application/json`
5. Select **Just the push event**, ensure it is checked as Active, and save.

### Step 8: Build and Run!
1. Manually trigger **Build Now** on the `Infra-Pipeline` to provision the AWS EKS cluster, Networking, and ECR repository. *(Be sure to check the logs and input "Yes" when it pauses for Terraform approval).*
2. Once infrastructure is ready, push a code change to your GitHub repo to test the webhook, or manually trigger **Build Now** on the `App-Pipeline`.
3. The App-Pipeline will:
   - Perform SAST analysis with SonarQube
   - Build the Docker container
   - Run a Trivy vulnerability scan
   - Push the vetted image to AWS ECR
   - Deploy your application safely to EKS!
