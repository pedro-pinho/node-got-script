// @ts-nocheck
const { getThronesApi, getGotQuotes } = require('./extResources/index.js');
const { getAll, deleteAll, createCharacter } = require('./api/index.js');
const { handleErrors } = require('./utils.js')


/**
 * Get resources from external sources
 * @returns {Promise}
 */
function getGotData() {
  return new Promise((resolve, reject) => {
    const start = new Date()
    console.log('Getting Game of Thrones data...')
    Promise.all([getThronesApi(), getGotQuotes()])
      .then(function (results) {
        const characters = results[0].data;
        const quotes = results[1].data;
        console.log(`Got ${characters.length} characters and ${quotes.length} quotes in ${new Date() - start}ms`);
        const response = formatData(characters, quotes)
        resolve(response)
      }).catch(function (error) {
        reject(error)
      })
  })
}
/**
 * Merge and format data in order to be used in the backend
 * @param {array} characters 
 * @param {array} quotes
 * @returns {array} 
 */
function formatData(characters, quotes) {
  const merged = characters.map(char => {
    const quote = quotes.find(q => q.name === char.fullName);
    const response = {
      name: char.fullName,
      image_url: char.imageUrl,
    }
    if (quote) {
      const quotesData = quote.quotes.map(q => ({ text: q}))
      response.Quotes = {
        data: quotesData
      }
    }
    return response
  })
  //unique values based on name
  return [...new Map(merged.map(v => [v.name, v])).values()]
}

Promise.all([getGotData(), deleteAll()])
  .then(function (results) {
    const gotData = results[0];
    let start = new Date()
    console.log(`Inserting ${gotData.length} characters...`);
    createCharacter(gotData).then(response => {
      const inserted = response.data.data.insert_Character.returning.length;
      console.log(`Successfully inserted ${inserted} characters in ${new Date() - start}ms`);
      console.log('Validating...')
      start = new Date()
      getAll()
        .then(data => {
          if (data.data.data.Character.length === inserted){
            console.log(`Successfully validated in ${new Date() - start}ms`);
          } else {
            console.error('Validation failed');
          }
        })
        .catch(error => handleErrors('Error getting all', error))
    }).catch(error => handleErrors('Error creating characters', error))
  }).catch(error => handleErrors('Error getting the data or deleting all', error))

