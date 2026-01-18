output "ec2_instance_ids" {
  value = module.sbs_ec2[*].id
}

output "ec2_public_ips" {
  value = module.sbs_ec2[*].public_ip
}

output "ec2_tags" {
  value = module.sbs_ec2[*].tags_all
}
