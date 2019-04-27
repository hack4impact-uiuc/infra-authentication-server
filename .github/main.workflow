# workflow "Testing" {
#   on = "push"
#   resolves = ["GitHub Action for Zeit-1"]
# }

# action "GitHub Action for Zeit" {
#   uses = "actions/zeit-now@5c51b26db987d15a0133e4c760924896b4f1512f"
#   args = "--public --no-clipboard deploy ./site > $HOME/$GITHUB_ACTION.txt"
#   secrets = ["INFRA_CLIENT_ID", "INFRA_CLIENT_SECRET", "INFRA_EMAIL", "INFRA_REFRESH_TOKEN"]
# }

# action "GitHub Action for Zeit-1" {
#   uses = "actions/zeit-now@5c51b26db987d15a0133e4c760924896b4f1512f"
#   needs = ["GitHub Action for Zeit"]
#   runs = "now login"
# }

workflow "Deploy on Now" {
  on = "push"
  resolves = ["release"]
}

# Deploy, and write deployment to file
action "deploy" {
  uses = "actions/zeit-now@master"
  args = "--public --no-clipboard deploy ./site > $HOME/$GITHUB_ACTION.txt"
  secrets = ["INFRA_CLIENT_ID", "INFRA_CLIENT_SECRET", "INFRA_EMAIL", "INFRA_REFRESH_TOKEN"]
  secrets = ["ZEIT_TOKEN"]
}

# Always create an alias using the SHA
action "alias" {
  needs = "deploy"
  uses = "actions/zeit-now@master"
  args = "alias `cat /github/home/deploy.txt` $GITHUB_SHA"
  secrets = ["ZEIT_TOKEN"]
}

# Filter for master branch
action "master-branch-filter" {
  needs = "alias"
  uses = "actions/bin/filter@master"
  args = "branch master"
}

# Requires now.json in repository
action "release" {
  needs = "master-branch-filter"
  uses = "actions/zeit-now@master"
  secrets = ["ZEIT_TOKEN"]
  args = "alias --local-config=./site/now.json"
}
