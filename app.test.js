const request = require('supertest');
const app = require('./app');

describe('GET /', () => {
  test('should return "Hello World" message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Hello World'});
  });
});

describe('GET /roles', () => { 
  test('should return roles', async () => {
    const response = await request(app).get('/roles');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
    {
      "_id": "64198008c274e47ba4464bad",
      "role": "Role1",
      "roleDescription": "Good role, good pay",
      "jobApplicants": [
      {
        "applicant": {
            "name": "Naz",
            "email": "naz@incite.ws",
            "blurb": "architect",
            "cvPath": "",
            "_id": "6419812c475a0215cba08b16",
            "__v": 0
        },
        "appProgress": 0,
        "_id": "641982c636877c9afec5e61b"
      }],
      "__v": 1
    },
    {
      "_id": "6419803bf63910ce86673431",
      "role": "Role2",
      "roleDescription": "Good role, good pay. But for the second role",
      "jobApplicants": [],
      "__v": 0
    }]);
  });
});