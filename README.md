# texts.expert-helper
An automation tool for copywriters receiving work via the site [texts.expert](https://texts.expert)

This tool scans to see if you have any new tasks and then generates starting templates for each task, uploading them to your Google Drive folder. Why waste your time creating files and copying over information? Generate all the templates you need to get started on your tasks in seconds.

## Template features
* A customisable "plan", based on words and phrases that you want to find in copywriting briefs.
* All keywords and URL's that need to be included in a copywriting task.
* Titles and subtitles formatted in H1 and H2 styles.
* An optional "keyword tool"

## Installation instructions
* Clone this repository onto your computer either by going to Code > Clone OR Code > Download ZIP.
* Make sure you have Node installed on your computer. You can download it at [https://nodejs.org/en/](https://nodejs.org/en/).
* Get your Google Drive API information (see below).
* Customise your starting templates (see below).
* Navigate to the texts.expert-helper folder in your terminal and run `npm install`.

After installation you can navigate to the texts.expert-helper folder in your terminal and run `npm run app` to use the tool.

## Getting Google Drive API information
To use this tool you will need to get free access to the Google Drive API.

Once you have access, you will have a 'Client ID', 'Client Secret' and 'Refresh token'. You can then navigate to wherever you copied this project on your computer, open up `config.js` in a text editor, input the information and save the file.

Follow the steps below to get all the information you need - it should take about 10 minutes. If you get stuck, Google the subheadings.

### Get Google Drive API OAuth2 credentials
* Go to [console.cloud.google.com](console.cloud.google.com)
* Click on the navbar to create a new project
* Click ‘create a new project’
* Add a project name and click create
* Select your new project in the navbar
* Click ‘APIs & Services’ in the sidebar on the left
* Click ‘Enable APIs and Services’
* Search and click ‘Google Drive API’
* Click to enable the API

* Go to ‘Credentials’ on the left
* Click ‘create credentials’ near the top and select ‘OAuth client ID’
* Click to configure the consent screen
* Under ‘User Type’ click external and click ‘Create’
* Provide any app name
* Choose your email for the support email
* Do not provide an app logo
* Provide your email under ‘Developer contact information’
* Click ‘Save and continue’ a few times
* When you see it displayed, click ‘Back to dashboard’ 

* Go to ‘Credentials’ on the left
* Click ‘Create Credentials’ near the top and select ‘OAuth client ID’
* Choose ‘web application’ under application type
* Provide any app name
* Under ‘Authorized redirect URIs’, click ‘Add URI’ and provide ‘https://developers.google.com/oauthplayground’ - n.b. Do not put a forward slash at the end.
* <b>Now you have your Client ID and Client Secret. Open up `config.js` in your text editor, paste the information in the fields and save the file.</b>
* Back in the browser, click ok

### Get Google Drive API refresh token
* Go to console.cloud.google.com 
* Search ‘OAuth consent screen’ in the navbar
* Go to ‘Test Users’, add in your Google Drive email address and click ‘Save’
* Go to https://developers.google.com/oauthplayground’
* Scroll down to ‘Drive API’ and check where it says https://www.googleapis.com/auth/drive
* At the top right of the page, click ‘Settings’ and when a window pops up check the box ‘Use your own OAuth credentials
* Provide the Client ID and Client secret
* Close the window
* Click ‘Authorise APIs’ in the sidebar on the left
* Choose your Google account
* If an error screen says ‘Google hasn’t verified this app’, you can click ‘Advanced’ and click ‘Go to app (unsafe)’. 
* When it prompts to grant permissions, click ‘Allow’ a couple of times until you go back to the Google Developers OAuth Playground
* To to ‘Exchange authorization code for tokens’ in the sidebar on the left
* Click ‘Exchange authorization code for tokens’
* <b>Now you have the refresh token. Just like before, open up `config.js` in your text editor, paste the information into the `REFRESH_TOKEN` field and save the file.</b>


## Customise templates
Open `config.js` and edit the fields to tweak your custom task template.
You will see instructions written in the file itself.