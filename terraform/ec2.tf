resource "aws_key_pair" "sbs_key" {
  key_name   = "sbs-key"
  public_key = file("sbs-key.pem.pub")
}

resource "aws_default_subnet" "default_az1" {
  availability_zone = "ap-south-1a"
}

module "sbs_ec2" {
  source  = "terraform-aws-modules/ec2-instance/aws"
  version = "6.2.0"

  ami                   = "ami-02b8269d5e85954ef"
  count                 = 1
  instance_type         = "t3.micro"
  key_name              = aws_key_pair.sbs_key.key_name
  subnet_id             = aws_default_subnet.default_az1.id
  create_security_group = true
  root_block_device = {
    encrypted = true
    type      = "gp3"
    size      = 20
  }
  security_group_ingress_rules = {
    "allow_ssh_internal" = {
      cidr_ipv4   = "0.0.0.0/0"
      description = "Allow SSH from internal VPC"
      from_port   = 22
      to_port     = 22
    }
  }


  instance_tags = {
    Name = "SBS_HackTheGap_2026"
  }
}

resource "local_file" "ansible_inventory" {
  content = templatefile("${path.module}/inventory.tftpl",
    {
      server_ips = module.sbs_ec2[*].public_ip
    }
  )
  filename = "${path.module}/../ansible/inventory.ini"
}