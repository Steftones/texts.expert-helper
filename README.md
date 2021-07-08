# texts.expert-helper
An automation tool for copywriters receiving work via the site [texts.expert](https://texts.expert)

This program reads your copywriting briefs and generates a .docx file (template) for every new task you've been assigned. Each template contains all the information you'd have to manually copy over such as titles, keywords and so on. The program can also find any specific instrutions, e.g. if a brief tells you to 'add images from sites such as Pexels', and these will be included within a "plan" section in the template.

There is also an option to link up to your Google Drive folder, but this requires additional configuration (see below).

## Installation instructions
* Clone this program onto your computer either by going to Code > Clone <i>OR</i> Code > Download ZIP.
* Make sure you have Node installed on your computer. You can download it at https://nodejs.org/en/.
* Open `config.js` where you will find instructions to input information such as your texts.expert username and login details.
* Navigate to the program folder in your terminal and run `npm install`.

## Using the tool
* After installation, navigate to the program folder in your terminal and run `npm run app`.
* When the program has finished, look in the `files` folder to find your templates. You can upload these to your Google Drive.
* Optionally, instead of uploading the templates manually, the program can do it for you by leveraging the Google Drive API. This will require some additional configuration - follow the instructions in `googleDriveInstructions.html`.

<b>N.B. when you notice you've been assigned new tasks on your texts.expert dashboard, always run this tool before you click 'New', otherwise the tool won't be able to find new tasks!</b>



