const request = require('supertest');
const express = require('express');
const { sanitizeSignup, sanitizeLogin } = require('../src/middleware/sanitizeInput');

describe('Sanitize Input Middleware', () => {

    // Helper function to create a temporary test app
    const createTestApp = (route, middleware) => {
        const app = express();
        app.use(express.json());
        app.post(route, middleware, (req, res) => {
            res.status(200).json(req.body);
        });
        return app;
    };

    test('Signup removes invisible characters and trims input', async () => {
        const app = createTestApp('/signup', sanitizeSignup);

        const res = await request(app)
            .post('/signup')
            .send({
                name: "Jo\u200Bhn D\u200Fe",
                email: " Test\u200B@Email.com ",
                password: "Password1!"
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe("John De");
        expect(res.body.email).toBe("test@email.com");
        expect(res.body.password).toBe("Password1!");
    });

    test('Login removes invisible characters and trims input', async () => {
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

    test('Signup validation fails for invalid inputs', async () => {
        const app = createTestApp('/signup', sanitizeSignup);

        const res = await request(app)
            .post('/signup')
            .send({
                name: "John123",
                email: "invalid-email",
                password: "short"
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.errors).toBeDefined();
        expect(res.body.errors.length).toBeGreaterThan(0);
    });

    test('Login validation fails for empty email or password', async () => {
        const app = createTestApp('/login', sanitizeLogin);

        const res = await request(app)
            .post('/login')
            .send({
                email: "",
                password: ""
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.errors).toBeDefined();
        expect(res.body.errors.length).toBeGreaterThan(0);
    });

    // --- XSS & suspicious character tests ---
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
        expect(res.body.name).toBe("alertxssJohn"); // XSS/suspicious chars removed
    });

    test('Signup allows valid name after sanitization', async () => {
        const app = createTestApp('/signup', sanitizeSignup);

        const res = await request(app)
            .post('/signup')
            .send({
                name: "Mary-Jane Smith",
                email: "mary@example.com",
                password: "Password1!"
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe("Mary-Jane Smith"); // valid chars remain
    });

    test('Login email sanitization prevents invisible/XSS chars', async () => {
        const app = createTestApp('/login', sanitizeLogin);

        const res = await request(app)
            .post('/login')
            .send({
                email: "\u200Buser<@>example.com\u200C",
                password: "Password1!"
            });

        expect(res.statusCode).toBe(400); // invalid email after sanitization
    });

});
