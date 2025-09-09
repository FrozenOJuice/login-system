const express = require("express");
const request = require("supertest");
const {
  signupLimiter,
  loginLimiter,
} = require("../src/middleware/rateLimiter");

let app;

beforeAll(() => {
    app = express();
    app.use(express.json());
  
    // Fake routes for isolated testing
    app.post("/signup", signupLimiter, (req, res) => {
        res.status(200).json({ message: "Signup OK" });
    });
  
    app.post("/login", loginLimiter, (req, res) => {
        res.status(200).json({ message: "Login OK" });
    });
});

  // Reset limiter memory before each test

  
describe("Rate Limiter Middleware", () => {
    test("Signup allows under the limit", async () => {
        for (let i = 0; i < 5; i++) {
            const res = await request(app).post("/signup");
            expect(res.statusCode).toBe(200);
        }
    });
  
    test("Signup blocks after exceeding limit", async () => {
        let res;
        for (let i = 0; i < 6; i++) {
            res = await request(app).post("/signup");
        }
        expect(res.statusCode).toBe(429);
    });

    test("Login allows under the limit", async () => {
        for (let i = 0; i < 10; i++) {
            res = await request(app).post("/login");
            expect(res.statusCode).toBe(200);
        }
    });
  
    test("Login blocks after exceeding limit", async () => {
        let res;
        for (let i = 0; i < 11; i++) {
            res = await request(app).post("/login");
        }
        expect(res.statusCode).toBe(429);
    });
});