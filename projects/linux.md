---
layout: project
type: project
image: img/linux.png
title: "Linux System Administration"
date: 2023
published: true
labels:
  - Cyber Security
  - Database
  - Domain/DNS
  - Email
  - Hardware
  - Networking
summary: "Linux System Administration"
---

I started my Linux journey after needing to reinstall Windows on the computer for the umpteenth time. After that, I resolved to find something other than Windows, and after searching I found Linux. Starting with Ubuntu 10.04 started learning more about how Linux works.

While wrapping up my Schooling for my associate degree at Baker College I started working at the Michigan-based hosting provider named Liquid Web. The below examples are from that time:

<details><summary><strong>Cyber Security Sample</strong></summary>
    <ul>
        <li><strong>Situation</strong> – Customer reaches out because their website appears to be compromised.</li>
        <li><strong>Task</strong> – Find and Determine how far the malware has spread and the best way to resolve the issue.</li>
        <li><strong>Action</strong> – After getting logged into the server I get an AV scan started. While that is running I take a look at some of the known malware and look for commonalities that can be used to search for it. I find injections and web shells all over this website. Checking on the scan it appears we have indications of malware across many sites hosted on the server. Due to this, I started looking for signs that the malware or hacker gained access to the root account on the server. Though looking at the logs and running processes there is no clear indication that is the case. In that case, I am assuming that the sites were compromised by the same group. By now the scan has finished and I have a list of affected sites hosted on this server. Looking at a few of the sites it seems they use wordpress and have one plugin in common. Searching the plugin confirms there was a patch released recently but it was never installed.</li>
        <li><strong>Results</strong> – Websites we hacked due to an exploit in one plugin which caused many sites to get compromised. The recommended solution is to make sure WordPress and plugins get updated as soon as security fixes are released. Then restore and patch the compromised websites.</li>
    </ul>
</details>

<details><summary><strong>Database Sample</strong></summary>
     <ul>
        <li><strong>Situation</strong> – Customer reached out because their website is slow. My fellow technician looked at the issue but was unable to make any headway. They reached out to me looking for assistance in determining the cause.</li>
        <li><strong>Task</strong> – Determine why the customer's website is slow, determine how this can be fixed, and clearly explain it to everyone involved.</li>
        <li><strong>Action</strong> – I need to load the site and confirm this behavior. From there I need to investigate resource usage, web server performance, and PHP (if separate from web server). After looking through all these I was able to confirm none of these are the issue. This then leads me to wonder what the code is doing to cause the slowness. Based on experience, I take a look at MySQL which appears to be the cause of the issue due to there being many waiting MySQL queries that belong to the database for this website. From here we get permission to restart MySQL and things return to normal.</li>
        <li><strong>Results</strong> – Queries that were being made in MySQL ended up causing performance issues with their site. This is passed along to the customer so they can make an informed decision on how to prevent the issue from happening again.</li>
    </ul>
</details>

    
<details>
<summary><strong>Domain/DNS Sample</strong></summary>
    <ul>
        <li><strong>Situation</strong> – Customer contacts support and I answer their call. They are frantic and sound to be on the verge of a panic attack while stating they are 
losing thousands of dollars every second their site can't be accessed. </li>
        <li><strong>Task</strong> – The task is twofold, calm the customer down and determine the cause of their site being inaccessible.</li>
        <li>
            <strong>Action</strong> – I first check the domain status using the whois command, with a command like this:
            <pre><code>
            whois cjthedj97.me | grep -i 'Expiration Date\|Domain status'
            </code></pre>
             The Results show the domain isn't expired or on a hold status.
            <pre><code>
            Domain Status: clientTransferProhibited https://icann.org/epp#clientTransferProhibited
            Registrar Registration Expiration Date: 2024-07-17T17:48:12Z
            Domain Status: clienttransferprohibited https://icann.org/epp#clienttransferprohibited
            </code></pre>
            Moving on to DNS we do a lookup for the domain for the common DNS types using a handy shell script to speed up the lookup time and eliminate a cause of potential mistakes.
            <pre><code>
            DNS Summary: cjthedj97.me
            --------------------------------------------------------------------------------
            www.cjthedj97.me.	300	IN	CNAME	cjthedj97.me.
            cjthedj97.me.		300	IN	AAAA	2001:DB8:169c:67ac:34b2:25ec:cda9:f189
            cjthedj97.me.		300	IN	AAAA	2001:DB8:981c:3e80:14a1:fa70:e46d:9d5
            cjthedj97.me.		86400	IN	NS	terry.ns.cloudflare.com. -> 108.162.193.237 173.245.59.237 172.64.33.237
            cjthedj97.me.		86400	IN	NS	wanda.ns.cloudflare.com. -> 108.162.192.240 172.64.32.240 173.245.58.240
            cjthedj97.me.		1800	IN	SOA	terry.ns.cloudflare.com. dns.cloudflare.com. 2343679133 10000 2400 604800 1800
            </code></pre>
            Well, there's the issue we are missing an A record for the root domain. From there if we have access to the name servers we can make the change. If we don't have access to them I will explain what needs to be changed at the domain name servers.
        </li>
        <li><strong>Results</strong> – The domain seems to be missing an A record, so anyone visiting the site using IPv4 would be unable to access the site. To solve the issue please create that record and point it to the IP of your server which is 203.0.113.202.</li>
    </ul>
</details>


<details><summary><strong>Email Sample</strong></summary>

* **Situation** – Customer reaches out because their server seems a bit sluggish and they have yet to receive a password reset from their website. Typically these would almost immediately show up in the destination email inbox.

* **Task** – Investigate the cause for the server being sluggish and determine if the email issue is related or a seprate issue.

* **Action** – You notice the slowness right away when you attempt to log in. After waiting a bit you can get logged in but patience is going to be key on this one. You try and get load numbers and you see they are rather high and disk IO is also rather high. However, it isn't immediately apparent what is causing the load. From experience, I know Exim can cause these symptoms when spamming is occurring. I then run `exim -bpc` and the first thing I notice is this is taking even longer to run than anything else so far. That is a good sign we are on the right train of thought. After a bit, we get the following results:
    
    ```bash
    exim -bpc
    69051054
    ```
    Well at this point it is rather clear that there is almost certainly spamming occuring from this server.

    To determine the source of the spam we need to generate a list of all the messages in the email queue. We will use

    `exim -bp | grep @ | uniq -c`    
    
    
    > 69051000           john@example.com
    
    This indicates almost all the messages in the mail queue appear to be from this email address. After searching `/var/log/exim_mainlog` you find a sample message of what is going on with this account
    
    > 2024-06-15 11:44:31 1sIXS3-000000069nP-2yYi <= john@example.com U=example P=local S=404 T="You won!" for victim@example.net
    > 2024-06-15 11:44:31 cwd=/var/spool/exim 4 args: /usr/sbin/exim -odi -Mc 1sIXS3-000000069nP-2yYi
    > 2024-06-15 11:44:39 1sIXS3-000000069nP-2yYi => victim@example.net R=lookuphost T=remote_smtp H=mail.example.com [203.0.113.217] X=TLS1.3:TLS_AES_256_GCM_SHA384:256 CV=dane C="250 2.0.0 Ok: queued as 4W1k6v0P0Rz3hhcd"
    > 2024-06-15 11:44:39 1sIXS3-000000069nP-2yYi Completed

    From what you are seeing it looks like they are sending out "You won! messages to many different email addresses.
    
    To clean things up we first need to reset the password on the john@example.com email address. After that is done we need to clear out the messages being sent by this address using:
    
    ```bash
    exiqgrep -i -f john@example.com | xargs exim -Mf
    exiqgrep -z -i | xargs exim -Mrm
    ```
    
    This freezes the message and after that is done it will remove frozen messages. But it seems to be taking forever so you decide to cancel that and run the following instead.
    
    ```bash
        find /var/spool/exim/input -name '*-H' | xargs grep 'auth_id' | grep john@example.com | cut -d: -f1 | cut -d/ -f7 | cut -d- -f1-3 | xargs -n 1 -P  $(nproc) exim -Mrm
    ```
    
    This will remove them in parallel with the number of cores seen with nproc, which will be much faster than.
    
* **Results** – The email account john@example was spamming and causing all kinds of issues. The solution was to change the account password and clear out all the messages from the Exim queue.
</details>


<details><summary><strong>Hardware Sample</strong></summary>
   
* **Situation** – Customer opens a ticket because they got an alert from their dedicated server about one of the disks. 

* **Task** – Determine what the cause of the alert was and determine what if anything needs to be done.

* **Action** – After getting logged the first thing I do is to determine if software or hardware raid is being used. To do so I run the following commands.
    
    ```bash
    lspci | grep -i raid
    cat /proc/mdstat
    ```
    Looking at the results it appears this particular server has an Adaptec card.
    
    > 04:00.0 RAID bus controller: Adaptec AAC-RAID (rev 09)

    So I run the following command to pull information from the controller
    
    `arcconf GETCONFIG 1`
    
    ```

    Controllers found: 1
    ----------------------------------------------------------------------
    Controller information
    ----------------------------------------------------------------------
       Controller Status                        : Optimal
       Channel description                      : SAS/SATA
       Controller Model                         : Adaptec RAID 7805
       Controller Serial Number                 : 1A23BC45D67
       Physical Slot                            : 4
       Temperature                              : 55 C/ 131 F (Normal)
       Installed memory                         : 1024 MB
       Copyback                                 : Disabled
       Background consistency check             : Disabled
       Automatic Failover                       : Enabled
       Global task priority                     : High
       Performance Mode                         : Default/Dynamic
       Host bus type                            : PCIe
       Host bus speed                           : 8.0 Gbps
       Write cache                              : Enabled
       BIOS                                     : 5.2-0 (16834)
       Firmware                                 : 5.2-0 (16834)
       Driver                                   : 1.2-0 (30501)
       Boot Flash                               : 5.2-0 (16834)
       Maximum Physical Devices                 : 256
       Maximum Parallel Commands                : 1008
       MaxIQ depth                              : 512
       NCQ status                               : Enabled

    ----------------------------------------------------------------------
    Logical device information
    ----------------------------------------------------------------------
    Logical device number 0
       Logical device name                      : RAID1_Volume
       RAID level                               : 1
       Status of logical device                 : Optimal
       Size                                     : 476 GB
       Stripe-unit size                         : 256 KB
       Read-cache setting                       : Enabled
       Write-cache setting                      : Enabled (write-back)
       Partitioned                              : Yes
       Protected by Hot-Spare                   : No
       Bootable                                 : Yes
       Failed stripes                           : No
       Power settings                           : Disabled
       --------------------------------------------------------
       Logical device segment information
       --------------------------------------------------------
       Segment 0                                : Present (0,0)
       Segment 1                                : Present (0,1)

    ----------------------------------------------------------------------
    Physical device information
    ----------------------------------------------------------------------
          Device #0
             Device is a Hard drive
             State                              : Online
             Supported                          : Yes
             Transfer speed                     : 6.0 Gbps
             Reported channel,Device(T:L)       : 0,0
             Reported Location                  : Enclosure 0, Slot 0
             Vendor                             : SEAGATE
             Model                              : ST500DM002
             Firmware                           : 0001
             Serial number                      : Z4Y1A4YT
             World-wide name                    : 5000C50046A7A49B
             Size                               : 476 GB
             Write-cache                        : Enabled
             S.M.A.R.T.                         : Yes
             Sector Format                      : 512B
             Device Speed                       : 6.0 Gbps
             Link Speed                         : 6.0 Gbps
             NCQ Status                         : Enabled

          Device #1
             Device is a Hard drive
             State                              : Online
             Supported                          : Yes
             Transfer speed                     : 6.0 Gbps
             Reported channel,Device(T:L)       : 0,1
             Reported Location                  : Enclosure 0, Slot 1
             Vendor                             : SEAGATE
             Model                              : ST500DM002
             Firmware                           : 0001
             Serial number                      : Z4Y1A4YU
             World-wide name                    : 5000C50046A7A49C
             Size                               : 476 GB
             Write-cache                        : Enabled
             S.M.A.R.T.                         : Yes
             Sector Format                      : 512B
             Device Speed                       : 6.0 Gbps
             Link Speed                         : 6.0 Gbps
             NCQ Status                         : Enabled

    ```
    Sadly this says everything is fine so we are going to need to pull information about the disks making up this array.
    
    To do that I need to 
    

    > /dev/sg0: scsi0 channel=0 id=0 lun=0
    >     ATA     ST500DM002-1BD14   CC45  [rmb=0 cmdq=1 pqual=0 pdev=0x0] 
    >     vendor: ATA     product: ST500DM002-1BD14  revision: CC45
    >     Peripheral device type: disk
    >     Attached to: scsi0, channel 0, id 0, lun 0
    > 
    > /dev/sg1: scsi0 channel=0 id=1 lun=0
    >     ATA     ST500DM002-1BD14   CC45  [rmb=0 cmdq=1 pqual=0 pdev=0x0]
    >     vendor: ATA     product: ST500DM002-1BD14  revision: CC45
    >     Peripheral device type: disk
    >     Attached to: scsi0, channel 0, id 1, lun 0

    From there I run 
    
    ```
    smartctl -a /dev/sg0
    smartctl -a /dev/sg1
    ```
    
    For sg1 we see signs of old age 

    ```    
    SMART Attributes Data Structure revision number: 10
    Vendor Specific SMART Attributes with Thresholds:
    ID# ATTRIBUTE_NAME          FLAG     VALUE WORST THRESH TYPE      UPDATED  WHEN_FAILED RAW_VALUE
      1 Raw_Read_Error_Rate     0x000f   113   099   006    Pre-fail  Always       -       123456789
      3 Spin_Up_Time            0x0003   091   091   000    Pre-fail  Always       -       0
      4 Start_Stop_Count        0x0032   099   099   020    Old_age   Always       -       1234
      5 Reallocated_Sector_Ct   0x0033   100   100   036    Pre-fail  Always       -       1
      7 Seek_Error_Rate         0x000f   073   060   045    Pre-fail  Always       -       1234567
      9 Power_On_Hours          0x0032   091   091   000    Old_age   Always       -       8765
     10 Spin_Retry_Count        0x0013   100   100   097    Pre-fail  Always       -       0
     12 Power_Cycle_Count       0x0032   099   099   020    Old_age   Always       -       567
    183 Runtime_Bad_Block       0x0032   100   100   000    Old_age   Always       -       0
    184 End-to-End_Error        0x0032   100   100   099    Old_age   Always       -       0
    187 Reported_Uncorrect      0x0032   100   100   000    Old_age   Always       -       0
    188 Command_Timeout         0x0032   100   100   000    Old_age   Always       -       0
    189 High_Fly_Writes         0x003a   100   100   000    Old_age   Always       -       0
    190 Airflow_Temperature_Cel 0x0022   067   052   040    Old_age   Always       -       33 (Min/Max 23/38)
    191 G-Sense_Error_Rate      0x0032   100   100   000    Old_age   Always       -       0
    192 Power-Off_Retract_Count 0x0032   100   100   000    Old_age   Always       -       0
    193 Load_Cycle_Count        0x0032   099   099   000    Old_age   Always       -       12345
    194 Temperature_Celsius     0x0022   033   048   000    Old_age   Always       -       33 (0 16 0 0 0)
    197 Current_Pending_Sector  0x0012   100   100   000    Old_age   Always       -       1
    198 Offline_Uncorrectable   0x0010   100   100   000    Old_age   Offline      -       0
    199 UDMA_CRC_Error_Count    0x003e   200   200   000    Old_age   Always       -       0
    240 Head_Flying_Hours       0x0000   100   253   000    Old_age   Offline      -       12345h+00m+00.000s
    241 Total_LBAs_Written      0x0000   100   253   000    Old_age   Offline      -       1234567890
    242 Total_LBAs_Read         0x0000   100   253   000    Old_age   Offline      -       1234567890
    ```
    
    From here we can refer to the disk spec sheet to check but with as many errors as this drive is showing I would likely recommend replacement either way.
    
* **Results** – One of the two disks backing the hardware raid is showing signs of issues even though the raid controller isn't aware. I would recommend replacing the drive more due to the errors than anything else.  
</details>


<details><summary><strong>Networking Sample</strong></summary>
    <ul>
        <li><strong>Situation</strong> – Customer reaches out because they are unable to reach their servers. They have dedicated hardware including their servers and firewall but everything appears to be down.</li>
        <li><strong>Task</strong> – Determine if the customer's infiltrate is down or if something is causing it to be unreachable.</li>
        <li><strong>Action</strong> – First I start by trying to reach one of the servers myself. I also am unable to reach the server by its IP. Next, I pulled up IPMI for the same server that I was unable to connect to and confirmed it was responsive. From there there is likely an issue between the server and us connecting to it. From here we will want to start by investigating the firewall. In our case, I log into NOC and have the ability to pull up the specific firewall configuration. Upon looking at the max connections it app others may be others may be can search for the firewalls that the connections are not going above a certain number. This is likely an indication that the device is unable to handle any more connections caused by either licensing or a device limitation. It appears that the firewall is at max connections. From here I reach out to the networking team to see if this licensing limit or get more information as to what is holding open those connections. It was determined that there was nothing wrong with the traffic and they raised the license limit.</li>
        <li><strong>Results</strong> – The firewall was at Max connections and after investigating it was determined that the license limit just needed to be increased.</li>
    </ul>
</details>
