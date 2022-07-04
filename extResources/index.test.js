// @ts-nocheck
const axios = require('axios').default
const { getThronesApi, getGotQuotes } = require('./index.js')

// Mock out all top level functions, such as get, put, delete and post:
jest.mock("axios");

describe("getThronesApi", () => {
  describe("when thronesapi is working", () => {
    it("should return characters list", async () => {
      // given
      const character = [{
        "id": 0,
        "firstName": "Daenerys",
        "lastName": "Targaryen",
        "fullName": "Daenerys Targaryen",
        "title": "Mother of Dragons",
        "family": "House Targaryen",
        "image": "daenerys.jpg",
        "imageUrl": "https://thronesapi.com/assets/images/daenerys.jpg"
      }];
      axios.get.mockResolvedValueOnce(character);
      const id = 0
      // when
      const result = await getThronesApi(id);

      // then
      expect(axios.get).toHaveBeenCalledWith(`https://thronesapi.com/api/v2/Characters/${id}`);
      expect(result).toEqual(character);
    });
  });
});

describe("getGotQuotes", () => {
  describe("when API gameofthronesquotes is working", () => {
    it("should return character details and quotes", async () => {
      // given
      const quote = [{
        "name": "Jon Snow",
        "slug": "jon",
        "house": {
          "slug": "stark",
          "name": "House Stark of Winterfell"
        },
        "quotes": [
          "If I fall, don't bring me back.",
          "There is only one war that matters. The Great War. And it is here.",
          "Love is the death of duty.",
          "Everything before the word \"but\" is horseshit.",
          "The war is not over. And I promise you, friend, the true enemy won't wait out the storm. He brings the storm."
        ]
      }];
      const slug = 'jon'
      axios.get.mockResolvedValueOnce(quote);
      // when
      const result = await getGotQuotes(slug);

      // then
      expect(axios.get).toHaveBeenCalledWith(`https://api.gameofthronesquotes.xyz/v1/character/${slug}`);
      expect(result).toEqual(quote);
    });
  });
});
