NetWatcher not working for you? Make sure first that you followed the installation instructions in the readme step by step and that you meet the prerequisites listed there. If that it the case, maybe the following will help:

* [Web Interface](#web-interface)
     - [Access Forbiden error on every page](#access-forbiden)
     - [Only the first page loads, and any subsequent links fail](#mod-rewrite-issue)
     - [Translations not working](#translations-not-working)
* [FPGA Web Service](#fpga-web-service)
     - [FPGA Web Service does not start automatically after reboot](#reboot-issue)
     - [FPGA Web Service not accessible from anything but localhost](#port-issue)
     - [Every request to the FPGA Web Service fails, returning 'timeout'](#timeout-issue)
     - [FPGA Web Service does not reboot with HugePages selected](#hugepages-issue)
     - [Invalid sudoers file after updating the web service](#invalid-sudoers)
     - [FPGA Web Service unable to program the FPGA](#error-impact)
     - [RAID does not mount automatically after reboot](#mount-raid)

## <a name="web-interface"> </a>Web Interface
#### <a name="access-forbiden"> </a>Access Forbiden error on every page
File and directory permissions are likely to be not set up correctly. Run `./scripts/do_chmod.sh`

#### <a name="mod-rewrite-issue"> </a>Only the first page loads, and any subsequent links fail
There is a problem with mod_rewrite

* Check that you installed all dependencies via `./scripts/install_dependencies.sh`
* Open `/etc/apache2/apache2.conf`, and change the conf of the NetWatcher parent dir to `AllowOverride All`

#### <a name="translations-not-working"> </a>Translations not working

* Visit the status page and make sure GetText is enabled
* Install dependencies running `./scripts/intall_dependencies.sh`



## <a name="fpga-web-service"> </a>FPGA Web Service
#### <a name="reboot-issue"> </a>FPGA Web Service does not start automatically after reboot

* Make sure you installed the service via `./fpga-api/scripts/update_server.sh`
* Open `/etc/sudoers` and comment the line `# Defaults    requiretty`

#### <a name="port-issue"> </a>FPGA Web Service not accessible from anything but localhost
The port may be blocked by iptables. You need to open the port in iptables. For instance, if the service port is `1337`, edit `/etc/sysconfig/iptables` and add the line

`-A INPUT -m state --state NEW -m tcp -p tcp --dport 1337 -j ACCEPT`

#### <a name="timeout-issue"> </a>Every request to the FPGA Web Service fails, returning 'timeout'
NetWatcher Web Service rejects petitions with more than a fixed delay (set it in `./fpga-api/config.js`). Sync the clock of the PHP server, the FPGA Web Service and the client machine running `sudo ntpdate pool.ntp.org`

#### <a name="hugepages-issue"> </a>FPGA Web Service does not reboot with HugePages selected
NetWatcher requires HugePages to be the default grub option. To configure the grub this way:

* Open `/boot/grub/grub.cfg` and search for the name of the HugePages option.
* Edit `/etc/default/grub` and use the quoted name of the option or its index for the `GRUB_DEFAULT` option

#### <a name="sudoers-issue"> </a>Invalid sudoers file after updating the web service
Run `pkexec visudo` and fix the last lines that are causing the sintax error

#### <a name="error-impact"> </a>FPGA Web Service unable to program the FPGA
Make sure that `IMPACT_BIN` param in `./fpga-api/config.js` contains a valid call for Xilinx's impact binary

#### <a name="mount-raid"> </a>RAID does not mount automatically after reboot
Check that `/etc/fstab` contains a line with the RAID_DEV. For example, if `RAID_DEV` is set to `/dev/md0`, `cat /etc/fstab` should have one of its return lines like this:

`/dev/md0             /mnt/raid               xfs     defaults        1 2`