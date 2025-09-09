const request = require('supertest');
const express = require('express');
const { sanitizeSignup, sanitizeLogin } = require('../src/middleware/sanitizeInput');

describe('Sanitize Input Middleware', () => {

    // Helper to create temporary test app
    const createTestApp = (route, middleware) => {
        const app = express();
        app.use(express.json());
        app.post(route, middleware, (req, res) => {
            // Return sanitized body for inspection
            res.status(200).json(req.body);
        });
        return app;
    };

    // --- Signup sanitization tests ---
    test('Signup sanitization removes invisible characters, trims input', async () => {
        const app = createTestApp('/signup', sanitizeSignup);

        const res = await request(app)
            .post('/signup')
            .send({
                name: "Jo\u200Bhn D\u200Fe",
                email: " Test\u200B@Email.com ",
                password: " Password1! "
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe("John De");
        expect(res.body.email).toBe("test@email.com");
        expect(res.body.password).toBe("Password1!");
    });

    test('Signup removes XSS and suspicious characters in name', async () => {
        const app = createTestApp('/signup', sanitizeSignup);

        const res = await request(app)
            .post('/signup')
            .send({
                name: "<script>alert('xss')</script>Jo`hn={}|",
                email: "user@example.com",
                password: "Password1!"
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe("alertxssJohn");
    });

    test('Signup preserves valid characters in name', async () => {
        const app = createTestApp('/signup', sanitizeSignup);

        const res = await request(app)
            .post('/signup')
            .send({
                name: "Mary-Jane Smith",
                email: "mary@example.com",
                password: "Password1!"
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe("Mary-Jane Smith");
    });

    // --- Login sanitization tests ---
    test('Login sanitization removes invisible characters and trims input', async () => {
        const app = createTestApp('/login', sanitizeLogin);

        const res = await request(app)
            .post('/login')
            .send({
                email: "\u200BTest@Email.com\u200C",
                password: " MyPassword123! "
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.email).toBe("test@email.com");
        expect(res.body.password).toBe("MyPassword123!");
    });

    test('Login email sanitization removes XSS and suspicious characters', async () => {
        const app = createTestApp('/login', sanitizeLogin);

        const res = await request(app)
            .post('/login')
            .send({
                email: "\u200Buser<@>example.com\u200C",
                password: "Password1!"
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.email).toBe("user@example.com");
    });

    test('Login password sanitization trims and removes invisible characters', async () => {
        const app = createTestApp('/login', sanitizeLogin);

        const res = await request(app)
            .post('/login')
            .send({
                email: "user@example.com",
                password: "\u200B MySecurePass123! \u200C"
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.password).toBe("MySecurePass123!");
    });

});
