workflow "Testing" {
  on = "push"
  resolves = ["deploy"]
}

action "GitHub Action for npm" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  runs = "npm install"
}

action "GitHub Action for npm-1" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["GitHub Action for npm"]
  runs = "npm run test"
  secrets = ["INFRA_EMAIL", "INFRA_CLIENT_ID", "INFRA_CLIENT_SECRET", "INFRA_REFRESH_TOKEN"]
}

action "deploy" {
  uses = "actions/zeit-now@5c51b26db987d15a0133e4c760924896b4f1512f"
  needs = ["GitHub Action for npm-1"]
  args = "--public --no-clipboard deploy ./site > $HOME/$GITHUB_ACTION.txt"
  secrets = ["INFRA_CLIENT_ID", "INFRA_CLIENT_SECRET", "INFRA_EMAIL", "INFRA_REFRESH_TOKEN"]
}
