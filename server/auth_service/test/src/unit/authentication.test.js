import { expect } from 'chai';
import sinon from 'sinon';
import { register, login } from '../../../src/controllers/authController.js';
import User from '../../../src/models/user.js';
import { describe, it, beforeEach, afterEach } from 'mocha';

describe('User Controller', () => {
    let findOneStub

    beforeEach(() => {
        findOneStub = sinon.stub(User, 'findOne');
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('register', () => {
        it('should return 400 if required fields are missing', async () => {
            const message = JSON.stringify({ email: '' });
            const result = await register(message);

            expect(result.status.code).to.equal(400);
            expect(result.status.message).to.equal('Missing fields');
        });

        it('should return 403 if role is not patient', async () => {
            const message = JSON.stringify({ email: 'test@example.com', password: '123456', role: 'dentist' });
            const result = await register(message);

            expect(result.status.code).to.equal(403);
            expect(result.status.message).to.equal('Invalid role');
        });

        it('should return 400 if user already exists', async () => {
            findOneStub.resolves({ email: 'test@example.com' });
            const message = JSON.stringify({ email: 'test@example.com', password: '123456' });
            const result = await register(message);

            expect(result.status.code).to.equal(400);
            expect(result.status.message).to.equal('Invalid credentials');
        });
    });

    describe('login', () => {
        it('should return 400 if required fields are missing', async () => {
            const message = JSON.stringify({ email: '' });
            const result = await login(message);

            expect(result.status.code).to.equal(400);
            expect(result.status.message).to.equal('Missing fields');
        });

        it('should return 400 if user does not exist', async () => {
            findOneStub.resolves(null);
            const message = JSON.stringify({ email: 'test@example.com', password: '123456' });
            const result = await login(message);

            expect(result.status.code).to.equal(400);
            expect(result.status.message).to.equal('Invalid credentials');
        });

        it('should return 400 if password does not match', async () => {
            const userMock = { matchPassword: sinon.stub().resolves(false) };
            findOneStub.resolves(userMock);
            const message = JSON.stringify({ email: 'test@example.com', password: 'wrong-password' });

            const result = await login(message);

            expect(result.status.code).to.equal(400);
            expect(result.status.message).to.equal('Invalid credentials');
        });
    });
});
