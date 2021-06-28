const config = {

  // Add information from your Google API between ''
  CLIENT_ID: '',
  CLIENT_SECRET: '',
  REDIRECT_URI: 'https://developers.google.com/oauthplayground',
  REFRESH_TOKEN: '',
  
  // To get the folder ID, go to the Google Drive folder where you'd like the templates to be uploaded.
  // Copy everything after /folders in the URL - this will be your ID to paste in below within ''.
  // e.g. https://drive.google.com/drive/folders/sfd67fd7sdf77s7d77 - the ID is 'sfd67fd7sdf77s7d77'
  folderId: '',

  // Add text.expert login information between ''
  username: 'your username',
  password: 'your password',

  // Here you can add whatever words or phrases you want to search for in the brief between '' (case insensitive search).
  // Stick to the same format below, including a comma at the end of the curly braces, e.g:
  // { searchFor: 'some word or phrase', printText: 'the text that will be outputted in your plan' },
  // If a word/phrase is found, it will print custom text in your template's plan.
  searchTerms: [
    { searchFor: 'pexels', printText: 'needs images from Pexels' },
    { searchFor: 'proposal', printText: 'include a proposal' },
    { searchFor: 'Lifehack', printText: 'include links from sites such as Lifehack' },
    { searchFor: 'bio', printText: 'include a bio' },
  ],

  // Optional feature - tries to find the "key phrase"
  // For me especially, the briefs usually say to put this in the description and in one subheading, so that's what this feature does.
  // After the colon write true to turn it on and false to turn it off.
  // e.g if it says 'The description should contain the following phrase: “Foo”' in the text, it will output Foo
  keywordSearcher: true

}

module.exports = { config }
