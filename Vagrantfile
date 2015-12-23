# -*- mode: ruby -*-
# vi: set ft=ruby :

# the number of multichain nodes to create
number_of_nodes = ENV['MULTICHAIN_NODES'].to_i

if number_of_nodes < 1
  number_of_nodes = 2
end

# the tld for the internal dns in the virtual network
tld = ENV['MULTICHAIN_TLD'] || 'local'

Vagrant.configure(2) do |config|

  config.vm.box = "ubuntu/trusty64"
  config.vm.network "private_network", type: "dhcp"

  # uncomment this line to use the default, insecure, vagrant key
  # DO NOT DO THIS ON INTERNET FACING SYSTEMS
  #config.ssh.insert_key = false

   config.vm.provider "virtualbox" do |vb|
     vb.customize ["modifyvm", :id, "--memory", "512"]
     vb.customize ["modifyvm", :id, "--cpus", 1]
   end

   # Enable the landrush module to provide dynamic dns inside the vm network
   if Vagrant.has_plugin?("landrush")
     config.landrush.enabled = true
     config.landrush.tld = tld.to_s
   end

  # disable the vbguest module as it's not detecting virtualbox 5 correctly
   if Vagrant.has_plugin?("vbguest")
     config.vbguest.auto_update = false
  end

  # use ansible provisioner.  This will run on all of the
  # machines in the file before any provisioners specified in their local block
  config.vm.provision "ansible" do |ansible|
  	ansible.playbook = "ansible_provision/site.yml"
    ansible.verbose = "v"

  number_of_nodes.times do |i|

      config.vm.define "multichain-node-#{i}" do |node|
        node.vm.hostname = "multichain-node-#{i}.#{tld}"
      end

   i += 1
  end

  multichain_nodes = Array.new

  number_of_nodes.times do |i|
    multichain_nodes.push("multichain-node-#{i}")
  end

  ansible.groups = {'multichain_nodes' => multichain_nodes}

end

end
