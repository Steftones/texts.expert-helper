const { google } = require('googleapis')
const { config } = require('./config')
const path = require('path')
const fs = require('fs')
const puppeteer = require('puppeteer')
const finalOutput = []

const oauth2Client = new google.auth.OAuth2(
  config.CLIENT_ID,
  config.CLIENT_SECRET,
  config.REDIRECT_URI
)

oauth2Client.setCredentials({ refresh_token: config.REFRESH_TOKEN })

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client
})

async function uploadFiles() {
  const filesToUpload = []
  fs.readdir('files/', (err, files) => {
    files.forEach(async file => {
      filesToUpload.push(file)
      try {
        await drive.files.create({
          requestBody: {
            name: `${file}`,
            parents: [config.folderId],
            mimeType: 'application/vnd.google-apps.document'
          },
          media: {
            mimeType: 'application/vnd.google-apps.document',
            body: fs.createReadStream(`files/${file}`)
          }
        })
        console.log(file + ' plan uploaded to Google Drive')
      } catch (error) {
        console.log(error.message)
      }
    })
  })  
}

const scrapeSite = async () => {
  
  const browser = await puppeteer.launch( { headless: true } )
  const page = await browser.newPage()
  await page.goto('https://texts.expert/')
  await page.click('[title="Sign In"]')
  console.log('Logging in...')
  await page.waitForTimeout(1000)
  await page.type('#loginform-username', config.username)
  await page.type('#loginform-password', config.password)
  await page.click('[name=login-button]')
  await page.waitForTimeout(1000)

  // include the URL where new tasks are shown
  await page.goto('https://texts.expert/writer/list?WriterTaskSearch%5Bstatus%5D=1')
  await page.waitForTimeout(1000)

  const data = await page.evaluate(() => {
    console.log('Finding new tasks...')
    const rows = Array.from(document.querySelectorAll('.u-t-left.u-wd-break > a'))
    return rows.map(e => e.href)
  })

  console.log(`${data.length} new tasks found`)

  for (let i = 0; i < data.length; i++){
    await page.goto(data[i])
    await page.waitForSelector('body')
    console.log(`Gathering information for task ${data[i].replace('https://texts.expert/writer/view?id=','')}...`)

    const textContent = await page.evaluate((config) => {

      const output = { title: '', subtitle: '', articleInfo: [], searches: [], resources: [], keyword: null }

      output.title = document.querySelector('body > div > section > div.o-unit > div > div.o-main-box.o-main-box--pad > div.o-main-box.o-main-box--pad.c-view-box > div.c-view-box-hd > div > div.like-h1.c-hd-group__el').innerText
      output.subtitle = document.querySelector('body > div > section > div.o-unit > div > div.o-main-box.o-main-box--pad > div.o-main-box.o-main-box--pad.c-view-box > div.c-view-box-hd > div > div.like-h3.c-hd-group__el').innerText

      const description = document.querySelector('.c-desc-box').children
      const keyWords = ['For', 'Subject', 'Word count']
      const resources = ['www', 'http', '.com']
      for (let z = 0; z < description.length; z++){
        if (keyWords.some(e => description[z].innerText.includes(e))) output['articleInfo'].push(description[z].innerText)
        if (resources.some(e => description[z].innerText.includes(e))) output['resources'].push(description[z].innerText)
      }

      const mainData = document.body.innerText

      if (config.keywordSearcher){
        output.keyword = mainData.match(/phrase:(.*)./)[1].split('').slice(2,-1).join('')
      }

      for (let k = 0; k < config.searchTerms.length; k++){
        // need checks to see if the searches don't come up in other parts e.g. keywords, title etc
        if (mainData.toLowerCase().includes(config.searchTerms[k].searchFor.toLowerCase())){
          output.searches.push(config.searchTerms[k]['printText'])
        }
      }

      let keywordTable = document.querySelectorAll('table:nth-child(3) > tbody > tr > td')
      let keywordTableOutput = []
      let tableRow = []

      for (let l = 1; l < keywordTable.length; l++){
        if (l % 4 === 0){
          keywordTableOutput.push(tableRow)
          tableRow = []
        } else {
          keywordTable[l].innerText === 'Anywhere' ? tableRow.push('') : tableRow.push(keywordTable[l].innerText)
        }
      }
      // bug? below it's saying if it's more than 1 line, output an array of arrays rather than 1 array
      keywordTable.length === 4 ? output.keywords = tableRow : output.keywords = keywordTableOutput

      keywordTable = document.querySelectorAll('table:nth-child(5) > tbody > tr > td')
      keywordTableOutput = []
      tableRow = []
      for (let m = 1; m < keywordTable.length; m++){
        if (m % 4 === 0){
          keywordTableOutput.push(tableRow)
          tableRow = []
        } else {
          tableRow.push(keywordTable[m].innerText)
        }
      }
      keywordTable.length === 4 ? output.urls = tableRow : output.urls = keywordTableOutput
      
      return output

    }, config)
    finalOutput.push(textContent)
  }
  await browser.close()
}

const makePage = async (i) => {

  const reducer = (acc, element) => acc + element + '<br>'

  const keywords = () => {
    const tab = '&nbsp;'.repeat(10)
    let output = ""

    // doesn't work if there's only one line of keywords!
    for (let j = 0; j < finalOutput[i].keywords.length; j++){
      for (let q = 0; q < finalOutput[i].keywords[j].length; q++){
        output = output + finalOutput[i].keywords[j][q] + tab
      }
      output += "<br>"
    }
    output += "<br>"
    for (let j = 0; j < finalOutput[i].urls.length; j++){
      for (let q = 0; q < finalOutput[i].urls[j].length; q++){
        output = output + finalOutput[i].urls[j][q] + tab
      }
      output += "<br>"
    }
    return output
  }

  function keywordSearcher(type){
    if (finalOutput[i].keyword){
      return type === 'description'
        ? `<u>${finalOutput[i].keyword}</u>`
        : `<br><br><h2><u>${finalOutput[i].keyword}</u></h2>`
    } else {
      return ''
    }
  }

  const templateOutput = `
--------------------------------------------<br>
<u>PLAN:</u><br>
${finalOutput[i].searches.reduce(reducer,[])}
<br><br>
<u>RESOURCES:</u><br>
${finalOutput[i].resources.reduce(reducer,[])}
--------------------------------------------
<br><br>
${finalOutput[i].title} - ${finalOutput[i].subtitle}<br>
${finalOutput[i].articleInfo.reduce(reducer,[])}
<br><br>
<b>Keywords:</b><br>
${keywords()}
<br><br>
<h1>${finalOutput[i].articleInfo[1].replace('Subject: ', '')}</h1>
Description: ${keywordSearcher('description')}
${keywordSearcher('')}
`
  const name = finalOutput[i].title

  // saves the file
  fs.writeFile(`files/${name}.docx`, '<div></div>', (err) => {
    if (err) return console.log(err)
  })

  // appends to the file
  fs.appendFile(`files/${name}.docx`, templateOutput, function (err) {
    if (err) throw err
    console.log(`${finalOutput[i].title} plan written`)
  })
}

const runApp = async () => {
  await scrapeSite()

  // if there are no new tasks
  if (finalOutput.length < 1){
    console.error('You have no new tasks at the moment')
    return
  }

  for (let i = 0; i < finalOutput.length; i++) await makePage(i)

  await uploadFiles()
  
}

// cleans up and deletes files already in the directory
fs.readdir('files/', (error, files) => {
  if (error) throw error
  for (const file of files) {
    fs.unlink(path.join('files/', file), error => {
      if (error) throw error
    })
  }
})

runApp()
