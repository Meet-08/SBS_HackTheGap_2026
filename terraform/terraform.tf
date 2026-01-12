terraform {
  cloud {
    hostname     = "app.terraform.io"
    organization = "Meet-08"
    workspaces {
      name = "SBS_HackTheGap_2026"
    }
  }
}