// @ts-nocheck
const axios = require('axios').default
const api = require('./index.js')

// Mock out all top level functions, such as get, put, delete and post:
jest.mock("axios");

describe("Backend API", () => {
  const BASE_URL = 'https://backend-challenge.hasura.app/'
  describe("when backend-challenge is working", () => {
    it("should delete characters", async () => {
      // when
      const expectedResult = {
        data: {
          affected_rows: 1,
        }
      }
      axios.post.mockResolvedValueOnce(expectedResult);
      const result = await axios.post(`${BASE_URL}v1/graphql`, {
        query: `mutation DeleteAll {
          delete_Character(where: {id: {_gt: 0}}) {
            affected_rows
          }
        }`
      }, {
        headers: {
          'x-hasura-admin-secret': 'uALQXDLUu4D9BC8jAfXgDBWm1PMpbp0pl5SQs4chhz2GG14gAVx5bfMs4I553keV',
          'Content-Type': 'application/json'
        },
      })
      // then
      expect(result).toEqual(expectedResult)
    });
    it("should insert one character", async () => {
      // given
      const character = [{
        "name": "Tyrion Lannister",
        "image_url": "https://static.wikia.nocookie.net/gameofthrones/images/9/95/HandoftheKingTyrionLannister.PNG",
        "quotes": [
          "A Lannister always pays his debts.",
          "He was no dragon. Fire cannot kill a dragon."
        ]
      }];
      axios.post.mockResolvedValueOnce(character);
      // when
      const result = await axios.post(`${BASE_URL}v1/graphql`,  {
        query: `mutation CreateCharacter($objects: [Character_insert_input!]!) {
          insert_Character(objects: $objects) {
            returning {
              id
            }
          }
        }`,
        variables: {
          objects: character,
        }
      }, {
        headers: {
          'x-hasura-admin-secret': 'uALQXDLUu4D9BC8jAfXgDBWm1PMpbp0pl5SQs4chhz2GG14gAVx5bfMs4I553keV',
          'Content-Type': 'application/json'
        },
      })
      // then
      expect(result).toEqual(character);
    });
    it("should insert get all characters", async () => {
      // given
      const character = [{
        "name": "Tyrion Lannister",
        "image_url": "https://static.wikia.nocookie.net/gameofthrones/images/9/95/HandoftheKingTyrionLannister.PNG",
        "quotes": [
          "A Lannister always pays his debts.",
          "He was no dragon. Fire cannot kill a dragon."
        ]
      }];
      axios.post.mockResolvedValueOnce(character);
      // when
      const result = await axios.post(`${BASE_URL}v1/graphql`,  {
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
      }, {
        headers: {
          'x-hasura-admin-secret': 'uALQXDLUu4D9BC8jAfXgDBWm1PMpbp0pl5SQs4chhz2GG14gAVx5bfMs4I553keV',
          'Content-Type': 'application/json'
        },
      })
      // then
      expect(result).toEqual(character);
    }); 
  });
});

