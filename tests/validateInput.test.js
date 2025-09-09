const express = require('express');
const request = require('supertest');
const { signupValidationRules, loginValidationRules, validate } = require('../src/middleware/validateInput');

const app = express();
app.use(express.json());

// Dummy routes just for testing
app.post('/signup', signupValidationRules(), validate, (req, res) => {
  res.status(200).json({ message: 'Signup passed' });
});

app.post('/login', loginValidationRules(), validate, (req, res) => {
  res.status(200).json({ message: 'Login passed' });
});

describe('Validation Middleware', () => {
    describe('Signup Validation', () => {
        it('should pass with valid input', async () => {
        const res = await request(app)
            .post('/signup')
            .send({ name: 'John Doe', email: 'john@example.com', password: 'secret123' });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Signup passed');
        });

        it('should fail if name is missing', async () => {
        const res = await request(app)
            .post('/signup')
            .send({ email: 'john@example.com', password: 'secret123' });
        expect(res.statusCode).toBe(400);
        expect(res.body.errors[0].param).toBe('name');
        });

        it('should fail with invalid email', async () => {
        const res = await request(app)
            .post('/signup')
            .send({ name: 'John', email: 'not-an-email', password: 'secret123' });
        expect(res.statusCode).toBe(400);
        expect(res.body.errors[0].param).toBe('email');
        });

        it('should fail with short password', async () => {
        const res = await request(app)
            .post('/signup')
            .send({ name: 'John', email: 'john@example.com', password: '123' });
        expect(res.statusCode).toBe(400);
        expect(res.body.errors[0].param).toBe('password');
        });
    });

    describe('Login Validation', () => {
        it('should pass with valid input', async () => {
        const res = await request(app)
            .post('/login')
            .send({ email: 'john@example.com', password: 'secret123' });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Login passed');
        });

        it('should fail if email is missing', async () => {
        const res = await request(app)
            .post('/login')
            .send({ password: 'secret123' });
        expect(res.statusCode).toBe(400);
        expect(res.body.errors[0].param).toBe('email');
        });

        it('should fail if password is missing', async () => {
        const res = await request(app)
            .post('/login')
            .send({ email: 'john@example.com' });
        expect(res.statusCode).toBe(400);
        expect(res.body.errors[0].param).toBe('password');
        });
    });
});
