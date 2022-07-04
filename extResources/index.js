const axios = require('axios').default

function getThronesApi(id) {
  let url = `https://thronesapi.com/api/v2/Characters`;
  if (typeof id !== 'undefined') {
    url = `${url}/${id}`;
  }
  return axios.get(url);
}

function getGotQuotes(character) {
  let url = `https://api.gameofthronesquotes.xyz/v1/character`;
  if (typeof character !== 'undefined') {
    url = `${url}/${character}`;
  } else {
    url = `${url}s`;
  }
  return axios.get(url);
}

module.exports = { getThronesApi, getGotQuotes }