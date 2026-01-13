output "server_ip" {
  value = module.sbs_ec2[*].public_ip
}