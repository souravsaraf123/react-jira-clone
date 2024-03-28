Ref Article 1 : https://stackoverflow.com/questions/56824788/how-to-connect-to-windows-postgres-database-from-wsl

Ref Arcicle 2 : https://serverfault.com/questions/1064916/connect-to-postgres-running-on-the-windows-host-from-wsl2

# How to access Postgres database running in Windows from WSL2 : 

Think of the scenario as 2 comnputers, one is Windows machine and the other is WSL2 machine.

### 1. First, the postgres server need to allow incoming connections from the WSL2 machine.


- To do this, you need the IP address of the WSL2 machine.

- You can get this by firing the command `ip address show eth0` on wsl terminal.

- In my case, the IP address of the WSL2 machine is 172.19.111.203/20 (here /20 is the subnet mask)

- Now you need to add this IP address to the pg_hba.conf file in the postgres server.

- The pg_hba.conf file is located in the data directory of the postgres server.

- In my case, the data directory is located at "C:/Program Files/PostgreSQL/14/data/pg_hba.conf"

- Open the pg_hba.conf file and add the following line at the end of the file.

```
host    all             all             172.19.111.203/20         md5
```

### 2. Now postgres is allowing incoming connections from an external machine , but Firewall may block the incoming connections.


- To allow incoming connections from the WSL2 machine via Firewall, you need to add an inbound rule in the Windows Firewall.

- Go to Control Panel -> System and Security -> Windows Defender Firewall -> Advanced settings

- In the Windows Defender Firewall with Advanced Security window, click on Inbound Rules in the left pane.

- In the right pane, click on New Rule.

- In the New Inbound Rule Wizard, select Port and click Next.

- Select TCP and specify the port number used by the postgres server (default is 5432) and click Next.

- Select Allow the connection and click Next.

- Select the network type and click Next.

- Give a name to the rule and click Finish.

### 3. Now, Windows machine is ready

### 4. Now, you need to configure the WSL2 machine to connect to the postgres server running on the Windows machine.

- You need to know the IP address of the Windows machine which WSL2 can use to connect to the Windows machine.
- To get the IP address of your Windows machine inside WSL : Fire the command `grep nameserver /etc/resolv.conf` on wsl terminal)
- In my case, the IP address of the Windows machine is : 172.19.96.1
- In theory, you can use this IP address to connect to the postgres server running on the Windows machine.
- Example : `psql -h 172.19.96.1 -p 5432 -U postgres`
- Above will work
- But, this IP address may change after a restart.
- So, it is better to setup a DNS entry for Windows host in the WSL2 machine on startup via the bashrc file.
- In Linux, the /etc/hosts file is used to map IP addresses to hostnames.
- We will use the below script to add this ever changing IP to the /etc/hosts file on every startup : 
- Add the below script to the ~/.bashrc file in the WSL2 machine : 

```
#Add DNS entry for Windows host
#if ! $(cat /etc/hosts | grep -q 'winhost'); then
#  echo 'Adding DNS entry for Windows host in /etc/hosts'
#  echo '\n# Windows host - added via ~/.bashhrc' | sudo tee -a /etc/hosts
#  echo -e "$(grep nameserver /etc/resolv.conf | awk '{print $2, "   winhost"}')" | sudo tee -a /etc/hosts
#fi
```

- Now, you can use the hostname "winhost" to connect to the postgres server running on the Windows machine.
- Example : `psql -h winhost -p 5432 -U postgres`