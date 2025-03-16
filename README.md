<h1>Project Name</h1>
Deploy next.js app on a VPS using digital ocean droplet using github actions workflow



<h2>Project Description</h2>
....

<h2>Motivation</h2>
i all ready have a solution for a simple CI\CD workflow which uses Github actions check <a href='#ref1'>[1]</a> but i have not used it with next.js. So here we will do it

<h2>Installation</h2>

<h3>Production server</h3>
<h4>make pm2 global (one point of truth)</h4>

1. Install pm2 Globally as Root
Ensure Node.js and npm are installed:

```bash
node -v
npm -v
```

Install pm2 globally:

```bash
sudo npm install -g pm2
```

Verify installation:

```bash
pm2 -v
```

2. Ensure Non-Root User Can Access pm2
Log in as the Non-Root User:

If you're currently logged in as root, switch to the non-root user:

```bash
su - <non-root-username>
```

Add /usr/local/bin (or wherever global npm binaries are installed , verify with 'npm config get prefix') to the non-root user's PATH:

```bash
echo 'export PATH=/usr/local/bin:$PATH' >> ~/.bashrc
source ~/.bashrc # reload changes immediately
```

Confirm the non-root user can invoke pm2:

```bash
su - <non-root-username>
pm2 -v
```

3. Grant Write Access to PM2 Files
Change ownership of pm2 directories to the non-root user:

```bash
sudo chown -R <non-root-username>:<non-root-username> /home/<non-root-username>/.pm2
```

Verify that the .pm2 directory for the user exists:

```bash
ls -l /home/<non-root-username>/.pm2
```

4. Test PM2 Commands as Non-Root User

```bash
su - <non-root-username>
```

Start an application (e.g., app.js):

```bash
pm2 start app.js --name "my-app"
pm2 list
```
you canalso use shell command e.g. ls instead of app.js

5. Configure CI/CD Pipeline to Use Non-Root User

Update your CI/CD pipeline's ssh commands to switch to the non-root user. For example:

```bash
ssh non-root-user@VPS_IP "pm2 restart my-app"
```

6. Set Up Autostart for PM2 (Optional for Production), need to be invoked once
While logged in as the non-root user, configure autostart for the system:

```bash
pm2 startup
```

Follow the generated instructions, which may include running a sudo command to finalize the setup.


Once done you can check the status as follows
```bash
sudo systemctl status pm2-<non-root-username>
```


7. Save PM2 Processes (Optional)
Save the current list of processes so they can be restored after a reboot:

```bash
pm2 save
```

<h4>Configure Nginx</h4>
<ul>
  <li>
    <strong>Create the file in your GitHub repository:</strong> Store the <code>my-app.conf</code> file in your project's <code>config/nginx</code> directory.
    <pre>
      <code>
server {
    listen 80;

    location / {
        proxy_pass http://localhost:3000; # Adjust port if needed
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
      </code>
    </pre>
  </li>
  <li>
    <strong>Move and link the file via SSH:</strong> In your GitHub Actions workflow, after the code is checked out, use <code>ssh</code> to execute the following commands on your DigitalOcean droplet:
    <pre>
      <code>
sudo mv ./config/nginx/my-app.conf /etc/nginx/sites-available/my-app.conf
sudo ln -sf /etc/nginx/sites-available/my-app.conf /etc/nginx/sites-enabled/my-app.conf
      </code>
    </pre>
    <p>Note: <code>./config/nginx/my-app.conf</code> refers to the file in the <code>config/nginx</code> directory of your cloned repository.</p>
  </li>
  <li>
    <strong>Reload Nginx:</strong> Immediately after the move and link commands, use <code>ssh</code> to reload the Nginx configuration:
    <pre>
      <code>
sudo systemctl reload nginx
      </code>
    </pre>
  </li>
</ul>


<h4>setup domain in digital ocean droplet</h4>
<ol>
<li>purchase a domain</li>
<li>add the domain to digital ocean .navigate to mangae->networking->domains 
Enter domain - posttoyoutube.xyx, choose project - post 2 youtube and click 'Add domain' 
<img src='./figs/add-domain-to-do-droplet.png'/>
</li>
<li>create droplet :
hostname : @
will direct to : add here your doplet
click on the button create record

as shown in the following image
<img src='./figs/create-record.png'/>

create also record for hostname www with the same 'will direct to'

the resulted created records appear in the follwoing image where the @ record appears in brown and www record appears in blue 
<img src='./figs/created-records.png'/>
</li>
</ol>

<h4>setup domain in namecheap</h4>
Here we will tell namecheap about digital ocean
from the dashboard choose the domain post2youtube.xyz and click Manage
scroll down and for Nameservers choose "custom DNS' and enter what was written in digitl ocean : ns1.digitalocean.com. ns2.digitalocean.com. ns3.digitalocean.com. as follows

<img  src='./figs/nameservers-on-namechaep.png'/>

This might take time to tkae effect

if you try to access it immidiately you might not be able to see the page

<img src='./figs/page-can-not-be-displayed.png'/>


but after few minutes you will getthe default nginx page but with the correct domain post2youtube.xyz 

<img src='./figs/with-domain-show-default-nginx-page.png'/>

you can can access the next.js app using the domain but still need the 3000 port 

<img src='./figs/use-domain-but-still-need-port-for-next.js'/>


<h4>now i want to access next.js app without port</h4>
add     server_name post2youtube.xyz www.post2youtube.xyz; under server {
    listen 80; in config/nginx/my-app.conf

    ```bash
  sudo nginx -t # test configuration
  sudo systemctl reload nginx # reload Nginx to apply changes:
    ```
---------->it is not working because the default nginx get in the way so i reomve the symbolic link 

```bash
sudo rm /etc/nginx/sites-enabled/default

```
but it still exist in /etc/nginx/sites-available/ (yet not active because link removed from sites-enabled)

after this

```bash
sudo nginx -t  # Test the configuration for syntax errors
sudo systemctl reload nginx
```

now access http://post2youtube.xyz will access the next.js app without need for the port but still the connection is not secured because http is used - not https

<h4>now i want to access next.js app without 'Not Secure' -> need https and certificate</h4>
    <strong>1. Install Certbot</strong>
    <ul>
        <li>Update the package list:
            <pre><code>sudo apt update</code></pre>
        </li>
        <li>Install Certbot and the Nginx plugin:
            <pre><code>sudo apt install certbot python3-certbot-nginx</code></pre>
        </li>
    </ul>

  <strong>2. Obtain an SSL Certificate</strong>
    <ul>
        <li>Run Certbot to get a certificate and configure Nginx:
            <pre><code>sudo certbot --nginx -d post2youtube.xyz -d www.post2youtube.xyz</code></pre>
        </li>
        <li>Certbot will automatically configure SSL and set up redirection.</li>
    </ul>

  <strong>3. Verify Certificate Renewal</strong>
    <ul>
        <li>Test automatic renewal:
            <pre><code>sudo certbot renew --dry-run</code></pre>
        </li>
    </ul>

  <strong>4. Review Nginx Configuration</strong>
    <p>The Nginx configuration file will look like this:</p>
    <pre><code>
server {
    listen 80;
    server_name post2youtube.xyz www.post2youtube.xyz;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name post2youtube.xyz www.post2youtube.xyz;

    ssl_certificate /etc/letsencrypt/live/post2youtube.xyz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/post2youtube.xyz/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
    </code></pre>

  <strong>5. Restart Nginx</strong>
    <ul>
        <li>Test and reload Nginx:
            <pre><code>
sudo nginx -t
sudo systemctl reload nginx
            </code></pre>
        </li>
    </ul>

  <strong>6. Verify HTTPS</strong>
    <ul>
        <li>Visit: <a href="https://post2youtube.xyz" target="_blank">https://post2youtube.xyz</a></li>
        <li>Ensure your site is accessible over HTTPS.</li>
    </ul>


<h3>Development</h3>


<h3>CI\CD</h3>
<ul>
<li>copy the workflow file from <a href='#ref1'>[1]</a></li>
<li>set VPS_IP ip and VPS_CICD_PRIVATE_KEY in the repo secrets part as in <a href='#ref1'>[1]</a></li>
<li>tweak runs-on to fit your production server operating system version (change from ubuntu-latest to ubuntu-24.04 which best match y production server version which is ubuntu 24.10</li>
<li>.env.production : tweak the workflow file to load the env variables ,currently we have

```yml
      echo 'API_KEY_1=${{ secrets.API_KEY_1 }}' > $NEW_WORKING_FOLDER/.env.production
```

</li>
</ul>


<h2>Usage</h2>
....


<h2>Technologies Used</h2>

<h3>Production server</h3>
<ul>
  <li>Nginx</li>
  <li>Domain \ https ???<li>
  <li>Linux on VPS - Ubuntu</li>
  <li>Digital Ocean - VPS provider via droplet</li>
  <li>PM2</li>
</ul>


<h3>Development</h3>
<ul>
  <li>Next.js TypeScript project</li>
  <li>Vitest</li>
  <li>.env.production</li>
</ul>

<h3>CI\CD</h3>
<ul>
  <li>GitHub Actions</li>
  <li>GitHub</li>
  <li>Act</li>
</ul>


<h2>Design</h2>

<h3>.env.production chalange</h3>

I want the workflow to support .env.local file. It is supported by next.js out of the box in development mode and if you use vercel you need to load the content of .env.local to your project on vercel. But here i dont use vercel and its not development so what to do ??

<h3>Does next.js load local .env.local on production ?</h3>
The answer is no , but it load .env.production.

<h3>Bad solution</h3>
next.js can load the .env.production file if it exist on the production server. But how he get there ? .env.local appears in .gitignore and you do want to remove it from there and expose it. This for sure is not recommended if the repo is public but even if the repo is private it is good practice to keep .env.local in .gitignore anyway

<h3>Good solution</h3>
keep the content of the .env.production as github action secret variable and create the .env.production by the workflow


<h3>grep non zero exit code chalange</h3>

```yml

set +e
...
set -e

```


<h2>Code Structure</h2>

```yml
    - name: Create .env.production on VPS
      run: |
        ssh $USER@$VPS_IP "
          echo 'API_KEY_1=${{ secrets.API_KEY_1 }}' > $WORKING_FOLDER/.env.production
        "
```

<h2>Demo</h2>
....

<h2>Points of Interest</h2>
<ul>
    <li>on: workflow_dispatch  --> may be usefull during workflow development for manuall workflow run . go to workflow file on github. click 'View Runs' and then click 'Run workflow'</li>
    <li>push to main trigegr deploy, to protect this you can allow it only via pull request , this can be done via .git\hooks\pre-push (.git/hooks directory is not tracked by Git)

```bash
#!/bin/bash

branch_name=$(git rev-parse --abbrev-ref HEAD)

if [ "$branch_name" = "main" ]; then
  echo "Direct pushes to the 'main' branch are not allowed. Please create a pull request."
  exit 1
fi
```
  </li>
</ul>


<h2>References</h2>
<ul>
    <li id='ref1'><a href='https://youtu.be/sEBGmPZh75U?si=wUANX2Pu-Sk6iQxI'>Simplified CI/CD Workflow with GitHub Actions </a></li>
</ul>

