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
<li>tweak simple-ci-cd.yml :    runs-on: ubuntu-latest to fit production server</li>
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
</ul>

<h3>CI\CD</h3>
<ul>
  <li>GitHub Actions</li>
  <li>Act</li>
</ul>


<h2>Design</h2>
....



<h2>Code Structure</h2>
....

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

