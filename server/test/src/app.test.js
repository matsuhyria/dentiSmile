import request from 'supertest';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import app from '../../src/app.js';

describe('API Tests', () => {

    it('should return a 200 abd welcome message for /api/v1', async () => {
        const res = await request(app).get('/api/v1');
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Welcome to DentiSmile+ API v1!');
    });

    it('should return a 404 for any blocked endpoint', async () => {
        const res = await request(app).get('/api/v2');
        expect(res.status).to.equal(404);
        expect(res.body.message).to.equal('Server error.');
    });

    it('should return a 404 for any blocked endpoint', async () => {
        const res = await request(app).get('/resources');
        expect(res.status).to.equal(404);
        expect(res.body.message).to.equal('Server error.');
    });

});