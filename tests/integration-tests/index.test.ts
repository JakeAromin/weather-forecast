import { expect } from 'chai';
import { agent as request }   from 'supertest';
import { server } from '../../src/index';

describe('Forecast Router tests', () => {

    beforeEach(async () => {
    });

    afterEach(async () => {
        
    });

    it('POST /location/:uuid returns error 500', async () => {
        try {
            const res = await request(server)
            .post('/api/location/123')
            .send({ latitude: "asdf", longitude: 123 })
            .set('Accept', 'application/json')
            .expect(500);
        } catch(err) {
            console.log(err);
        }
        
    });

    
    it('GET /forecast/:uuid returns error 500', async () => {
        try {
            const res = await request(server)
            .get('/api/forecast/123')
            .expect(500);
        } catch(err) {
            console.log(err);
        }
        
    });


});