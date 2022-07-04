const axios = require('axios').default; 

let backendClient = axios.create({
  baseURL: 'https://backend-challenge.hasura.app/',
  timeout: 25000,
  headers: {'x-hasura-admin-secret': 'uALQXDLUu4D9BC8jAfXgDBWm1PMpbp0pl5SQs4chhz2GG14gAVx5bfMs4I553keV', 'Content-Type': 'application/json'}
});

/**
 * Get all the Characters on the backend with their Quotes
 * @returns {Promise}
 */
function getAll() {
  return backendClient.post('v1/graphql',  {
    query: `{
      Character {
        Quotes {
          text
          id
        }
        id
        image_url
        name
      }
    }`
  })
}
/**
 * Delete all the Characters from the backend
 * @returns {Promise}
 */
function deleteAll() {
  return backendClient.post('v1/graphql',  {
    query: `mutation DeleteAll {
      delete_Character(where: {id: {_gt: 0}}) {
        affected_rows
      }
    }`
  })
}
/**
 * Create one or more new Characters on the backend
 * @param {array} objects 
 * @returns {Promise}
 */
function createCharacter(objects) {
  return backendClient.post('v1/graphql',  {
    query: `mutation CreateCharacter($objects: [Character_insert_input!]!) {
      insert_Character(objects: $objects) {
        returning {
          id
        }
      }
    }`,
    variables: {
      objects: objects,
    }
  })
}

module.exports = {
  getAll,
  deleteAll,
  createCharacter
}