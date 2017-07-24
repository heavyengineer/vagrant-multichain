# Vagrant multichain
This project creates multiple multichains on multiple Vagrant instances using ansible for configuration management.

## Pre-requisites

### Vagrant plugins
We recommend installing the following plugins using this syntax:
* vagrant plugin install vagrant-cachier

## Multichain configuration
* Runs as user called 'multichain'
* Only has rights to run multichain binaries
* The version of multichain to install is specified in the ansible configuration

## How to use
* Clone the repo
* cd into the repo
* run vagrant up

## Important!
When you reboot, the services won't start (unless this has been added to the code in which case this should be removed).
Change user to multichain and add this to crontab.

```bash
$ sudo su multichain
$ cd
$ crontab -e
```
and then add this as the last line, will cause the chain to start on boot (remember to select the correct version in the path)

```bash
@reboot /home/multichain/multichain-1.0-beta-2/multichaind presence -daemon executable=/bin/bash chdir=/home/multichain/
```
### RPC for remote connections
if connecting to the rpc port from a remote machine (most probable for testing).  then the multichain.conf file needs to be altered to allow your network or host to access:

```bash
rpcallowip=192.168.0.0/24
```

# How to test
Run 'vagrant status' and you should see two servers:

```bash
$ vagrant status
Current machine states:

multichain-node-0             running (virtualbox)
multichain-node-1             running (virtualbox)

This environment represents multiple VMs. The VMs are all listed
above with their current state. For more information about a specific
VM, run `vagrant status NAME`.
```

connect to multichain-node-0 and check multichain is running.

```bash
$ vagrant ssh multichain-node-0
$ ps -ef | grep multi
multich+  2790     1  0 19:52 ?        00:00:03 /home/multichain/multichain-1.0-alpha-13/multichaind multichain-node-0 -daemon

```

TODO: Doing this individually is laborious, so need a script to do it automatically.

get the rpc password for the server

```bash
less /home/multichain/.multichain/multichain.conf
```
