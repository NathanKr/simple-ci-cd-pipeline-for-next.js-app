<h1>Project Name</h1>
Deploy next.js app on a VPS using digital ocean droplet using github actions workflow



<h2>Project Description</h2>
....

<h2>Motivation</h2>
i all ready have a solution for a simple CI\CD workflow which uses Github actions check <a href='#ref1'>[1]</a> but i have not used it with next.js. So here we will do it

<h2>Installation</h2>

<h3>Production server</h3>
- configure nginx
- setup domain and http

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

<h3>The chalange</h3>
I want the workflow to support .env.local file. It is supported by next.js out of the box in development mode and if you use vercel you need to load the content of .env.local to your project on vercel. But here i dont use vercel and its not development so what to do ??

<h3>Does next.js load local .env.local on production ?</h3>
The answer is yes if you invoke npm start , you can check this locally.

<h3>Bad solution</h3>
next.js can load the .env.local file if it exist on the production server. But how he get there ? .env.local appears in .gitignore and you do do not to remove it from there and expose it. This for sure is not recommended if the repo is public but even if the repo is private it is good practice to keep .env.local in .gitignore anyway

<h3>Good solution</h3>
keep the content of the .env.local as github action secret variable and create the .env.local by the workflow



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
    <li>...</li>
   
</ul>

<h2>References</h2>
<ul>
    <li id='ref1'><a href='https://youtu.be/sEBGmPZh75U?si=wUANX2Pu-Sk6iQxI'>Simplified CI/CD Workflow with GitHub Actions </a></li>
</ul>

