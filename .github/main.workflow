workflow "Testing" {
  on = "push"
  resolves = [
    "GitHub Action for Zeit",
  ]
}

action "GitHub Action for Zeit" {
  uses = "actions/zeit-now@5c51b26db987d15a0133e4c760924896b4f1512f"
  args = "--public --no-clipboard deploy ./site > $HOME/$GITHUB_ACTION.txt"
  secrets = ["INFRA_CLIENT_ID", "INFRA_CLIENT_SECRET", "INFRA_EMAIL", "INFRA_REFRESH_TOKEN"]
}
