# -*- mode: ruby -*-
# vi: set ft=ruby :

# the number of multichain nodes to create
number_of_nodes = ENV['MULTICHAIN_NODES'].to_i || 1

# the tld for the internal dns in the virtual network
tld = ENV['MULTICHAIN_TLD'] || 'local'

Vagrant.configure(2) do |config|

  config.vm.box = "ubuntu/trusty64"
  config.vm.network "private_network", type: "dhcp"

  # uncomment this line to use the default, insecure, vagrant key
  # DO NOT DO THIS ON INTERNET FACING SYSTEMS
  #config.ssh.insert_key = false

# use vagrant cachier to speed  up development.
  if Vagrant.has_plugin?("vagrant-cachier")
     # Configure cached packages to be shared between instances of the same base box.
     # More info on http://fgrehm.viewdocs.io/vagrant-cachier/usage
     config.cache.scope = :box

     # OPTIONAL: If you are using VirtualBox, you might want to use that to enable
     # NFS for shared folders. This is also very useful for vagrant-libvirt if you
     # want bi-directional sync
     config.cache.synced_folder_opts = {
       type: :nfs,
       # The nolock option can be useful for an NFSv3 client that wants to avoid the
       # NLM sideband protocol. Without this option, apt-get might hang if it tries
       # to lock files needed for /var/cache/* operations. All of this can be avoided
       # by using NFSv4 everywhere. Please note that the tcp option is not the default.
       mount_options: ['rw', 'vers=3', 'tcp', 'nolock']
     }
     # For more information please check http://docs.vagrantup.com/v2/synced-folders/basic_usage.html
   end
   config.vm.provider "virtualbox" do |vb|
     vb.customize ["modifyvm", :id, "--memory", "256"]
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
  end

  multichain_nodes = Array.new

  number_of_nodes.times do |i|
    # to avoid the machine having a name inconsistent with the chain number
    multichain_nodes.push("multichain-node-#{i}")
  end

  ansible.groups = {'multichain_nodes' => multichain_nodes}
  end
end
