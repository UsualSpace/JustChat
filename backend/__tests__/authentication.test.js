import request from "supertest"; // Supertest allows us to simulate HTTP requests
import { app, ConnectDB, User, Session } from "../app.js";
import mongoose from "mongoose";

const mongo_url = null;

describe("POST /api/auth/signup", () => {
    beforeAll(async () => {
        await ConnectDB(mongo_url);
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    it("should create a user and return 201 if email, password, first name, and last name are valid", async () => {
        const response = await request(app)
            .post("/api/auth/signup")
            .send({
                email: "johndoe@example.com",
                password: "helpme",
                first_name: "John",
                last_name: "Doe"
            });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe("user successfully signed up")
            const user = await User.findOne({email: "johndoe@example.com"});
            expect(user).not.toBeNull();
    });

    it("should return 400 if email is already registered", async () => {
        await User.create({
            email: "johndoe@example.com",
            password: "helpme",
            first_name: "John",
            last_name: "Doe"
        });

        const response = await request(app)
            .post("/api/auth/signup")
            .send({
                email: "johndoe@example.com",
                password: "helpme123",
                first_name: "Jo",
                last_name: "Doe"
            });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe("cannot use that email");
    });
});

describe("POST /api/auth/signin", () => {
    beforeAll(async () => {
        await ConnectDB(mongo_url);
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    it("should return 202 and a valid session id if the account with the email exists and the password is correct", async () => {
        await User.create({
            email: "johndoe@example.com",
            password: "helpme",
            first_name: "John",
            last_name: "Doe"
        });

        const response = await request(app)
            .post("/api/auth/signin")
            .send({
                email: "johndoe@example.com",
                password: "helpme"
            });

        expect(response.status).toBe(202);
        expect(response.body.session_id).not.toBeNull();
        const session = await Session.findById(response.body.session_id);
        expect(session).not.toBeNull();
    });

    it("should return 401 if the account with the email exists but the password is incorrect", async () => {
        await User.create({
            email: "johndoe@example.com",
            password: "helpme",
            first_name: "John",
            last_name: "Doe"
        });

        const response = await request(app)
            .post("/api/auth/signin")
            .send({
                email: "johndoe@example.com",
                password: "helpme123"
            });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe("invalid credentials");
    });
});

describe("DELETE /api/auth/signout", () => {
    beforeAll(async () => {
        await ConnectDB(mongo_url);
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    it("should return 200 if a valid session id is received", async () => {
        await User.create({
            email: "johndoe@example.com",
            password: "helpme",
            first_name: "John",
            last_name: "Doe"
        });

        //sign in user to get a session id.
        const signin_response = await request(app)
            .post("/api/auth/signin")
            .send({
                email: "johndoe@example.com",
                password: "helpme" 
            });

        const session_id = signin_response.session_id;

        //try to sign out user
        const signout_response = await request(app)
            .post("/api/auth/signout")
            .set("Authorization", "Bearer " + String(session_id));

        expect(signout_response.status).toBe(200);
        expect(signout_response.message).toBe("user successfully signed out");
        const session = await Session.findById(session_id);
        expect(session).toBeNull();
    });

    it("should return 401 if an invalid session id is received", async () => {
        //try to sign out user
        const signout_response = await request(app)
            .post("/api/auth/signout")
            .set("Authorization", "Bearer dshufhusf");

        expect(signout_response.status).toBe(401);
        expect(signout_response.error).toBe("invalid session id");
    });
});

describe("GET /api/auth/account-info", () => {
    beforeAll(async () => {
        await ConnectDB(mongo_url);
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    it("should return status 200 and a correct first_name, last_name, and email for a valid signed in user", async () => {
        await User.create({
            email: "johndoe@example.com",
            password: "helpme",
            first_name: "John",
            last_name: "Doe"
        });

        //sign in user to get a session id.
        const signin_response = await request(app)
            .post("/api/auth/signin")
            .send({
                email: "johndoe@example.com",
                password: "helpme" 
            });

        const session_id = signin_response.session_id;

        const account_info_response = await request(app)
            .get("/api/auth/account-info")
            .set("Authorization", "Bearer " + String(session_id));

        expect(account_info_response.status).toBe(200);
        expect(account_info_response.email).toBe("johndoe@example.com");
        expect(account_info_response.first_name).toBe("John");
        expect(account_info_response.last_name).toBe("Doe");
    });
});

describe("PATCH /api/auth/account-info", () => {
    beforeAll(async () => {
        await ConnectDB(mongo_url);
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    it("should return status 200 if a given first_name and last_name are valid for a valid signed in user", async () => {
        await User.create({
            email: "johndoe@example.com",
            password: "helpme",
            first_name: "John",
            last_name: "Doe"
        });

        //sign in user to get a session id.
        const signin_response = await request(app)
            .post("/api/auth/signin")
            .send({
                email: "johndoe@example.com",
                password: "helpme" 
            });

        const session_id = signin_response.session_id;

        const account_info_response = await request(app)
            .patch("/api/auth/account-info")
            .set("Authorization", "Bearer " + String(session_id))
            .send({
                first_name: "Jane",
                last_name: "Dove"
            });

        expect(account_info_response.status).toBe(200);
        expect(account_info_response.message).toBe("user successfully updated account information");

        const user = await User.findOne({email: "johndoe@example.com"});
        expect(account_info_response.first_name).toBe("Jane");
        expect(account_info_response.last_name).toBe("Dove");
    });
});
