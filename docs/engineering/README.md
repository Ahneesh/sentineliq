# SentinelIQ Engineering Handbook

## Purpose

This document defines engineering standards for SentinelIQ.

SentinelIQ is an AI-native trade surveillance and market abuse detection platform.

---

# Engineering Principles

## 1. Security First

Financial compliance software handles sensitive information.

Security requirements:

- Secure authentication
- Least privilege access
- Audit logging
- Data protection

---

## 2. Clean Architecture

Code should be:

- Modular
- Testable
- Maintainable
- Easy to extend

---

## 3. Documentation

Important architectural decisions must be documented.

---

## 4. Testing

Critical functionality requires automated tests.

---

# Git Workflow

## Branches

### main

Production-ready code.

### develop

Integration branch.

### feature/\*

Individual feature development.

Examples:
feature/authentication
feature/trade-upload
feature/spoofing-detector

---

# Commit Convention

Format:
type(scope): description

Examples:
feat(auth): add JWT authentication

fix(api): handle invalid trade upload

docs(readme): update installation guide

Allowed types:

- feat
- fix
- docs
- test
- refactor
- chore

---

# Code Quality Requirements

Before merging:

- Code formatting
- Static analysis
- Automated tests

must pass.

---

# Pull Request Requirements

Every pull request should include:

- Description
- Reason for change
- Testing performed
- Screenshots where relevant

---

# Architecture Decisions

Major technical decisions should be recorded as Architecture Decision Records (ADRs).

Location:
docs/architecture/

---

# Development Philosophy

Build simple solutions first.

Avoid unnecessary complexity.

Prefer:

- Clear code over clever code
- Maintainability over speed
- Reliability over shortcuts
