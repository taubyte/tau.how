# Taubyte Documentation

This is the documentation site for Taubyte, built with MkDocs Material.

## Local Development

### Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Serve locally:
```bash
mkdocs serve
```

3. Build the site:
```bash
mkdocs build
```

## Deployment

This site is automatically deployed to GitHub Pages using GitHub Actions when changes are pushed to the `main` branch.

### Manual Deployment (if needed)

If you need to manually deploy:

```bash
mkdocs gh-deploy
```

## Repository Structure

```
.
├── .github/
│   └── workflows/       # GitHub Actions workflows
├── docs/                # Documentation source files
├── site/                # Built site (generated, gitignored)
├── mkdocs.yml          # MkDocs configuration
└── requirements.txt    # Python dependencies
```

## Documentation

- Site: https://taubyte.github.io/tau.how/
- Repository: https://github.com/taubyte/tau.how

