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

<h4>configure nginx</h4>


<h4>setup domain and http</h4>

<h3>Development</h3>


<h3>CI\CD</h3>
<ul>
<li>copy the workflow file from <a href='#ref1'>[1]</a></li>
<li>set VPS_IP ip and VPS_CICD_PRIVATE_KEY in the repo secrets part as in <a href='#ref1'>[1]</a></li>
<li>tweak runs-on to fit your production server operating system version (change from ubuntu-latest to ubuntu-24.04 which best match y production server version which is ubuntu 24.10</li>
<li>load .env.local</li>
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
  <li>.env.local</li>
</ul>

<h3>CI\CD</h3>
<ul>
  <li>GitHub Actions</li>
  <li>GitHub</li>
  <li>Act</li>
</ul>


<h2>Design</h2>

<h3>.env.local chalange</h3>

I want the workflow to support .env.local file. It is supported by next.js out of the box in development mode and if you use vercel you need to load the content of .env.local to your project on vercel. But here i dont use vercel and its not development so what to do ??

<h3>Does next.js load local .env.local on production ?</h3>
The answer is yes if you invoke npm start , you can check this locally.

<h3>Bad solution</h3>
next.js can load the .env.local file if it exist on the production server. But how he get there ? .env.local appears in .gitignore and you do do not to remove it from there and expose it. This for sure is not recommended if the repo is public but even if the repo is private it is good practice to keep .env.local in .gitignore anyway

<h3>Good solution</h3>
keep the content of the .env.local as github action secret variable and create the .env.local by the workflow


<h3>grep non zero exit code chalange</h3>

```yml

set +e
...
set -e

```


<h2>Code Structure</h2>

```yml
    - name: Create .env.local on VPS
      run: |
        ssh $USER@$VPS_IP "
          echo 'API_KEY_1=${{ secrets.API_KEY_1 }}' > $WORKING_FOLDER/.env.local
        "
```

<h2>Demo</h2>
....

<h2>Points of Interest</h2>
<ul>
    <li>on: workflow_dispatch  --> may be usefull during workflow development for manuall workflow run . go to workflow file on github. click 'View Runs' and then click 'Run workflow'</li>
    <li>push to main trigegr deploy, to protect this you can allow it only via pull request , this can be done via .git\hooks\pre-push (.git/hooks directory is not tracked by Git)

```bash
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
    <li>the prev instand of the app is not deleted</li>
</ul>    

<h2>References</h2>
<ul>
    <li id='ref1'><a href='https://youtu.be/sEBGmPZh75U?si=wUANX2Pu-Sk6iQxI'>Simplified CI/CD Workflow with GitHub Actions </a></li>
</ul>

