# **App Name**: CloakDash

## Core Features:

- User Authentication: Authentication page (sign up / login) with Firebase Auth (email and password). After login, redirect to the user dashboard. Protect all app routes, except the landing page.
- Dashboard Screen: Dashboard screen to list all cloak routes created by the user, displaying the slug, real URL, fake URL, and current status (active/forcing clean). It includes an "Emergency Button" to force redirection to the fake URL and a link to "View Logs".
- New Route Form: Form to create a new cloaker route, including fields for route slug, real URL, fake URL, a list of blocked IPs and user-agents (text areas), allowed or blocked countries (multi-select), and a checkbox to enable the "Emergency Button."
- Redirection with Cloaking: A Firebase Cloud Function (running at /cloak/:slug) that receives external visits and decides where to redirect the visitor (real or fake URL). This tool checks the visitor's IP, user-agent, and referrer, verifies if the IP or UA is blacklisted, and considers whether the emergency button is activated.
- Logs Screen (per slug): Display the latest 100 accesses for a route, showing IP, country (using GeoIP), date and time, and whether the redirection was to the real or fake lander. Includes a search field by IP.
- Landing Page: Landing page explaining what CloakDash is: cloaking tool for affiliates and aggressive traffic. Show sections such as Hero, Benefits, How it works (flowchart), Plans and pricing, and CTA to sign up or log in.

## Style Guidelines:

- Primary color: Dark purple (#624CAB) to reflect underground tech and security.
- Background color: Very dark gray (#222222), nearly black, complements the dark theme and focuses attention on content.
- Accent color: Cyan (#00FFFF) as an analogous color to provide stark contrast on a dark theme for highlighting and interactive elements.
- Body and headline font: 'Inter', a grotesque-style sans-serif, will be used in both the body and the headers.
- Code font: 'Source Code Pro' for displaying code snippets.
- Simple line icons in cyan for a minimalist look.
- Responsive layout optimized for both desktop and mobile devices.  Use of TailwindCSS to help provide clean look