import request from "supertest"; // Supertest allows us to simulate HTTP requests
import { app } from "../src/app.js";
import { Session, User } from "../src/models.js";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server"

//const mongo_url = process.env.MONGO_URL;

let mongo_server;

beforeAll(async () => {
    mongo_server = await MongoMemoryServer.create();
    await mongoose.connect(mongo_server.getUri());
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongo_server.stop();
});

describe("POST /api/auth/signup", () => {

    beforeEach(async () => {
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
    beforeEach(async () => {
        await User.deleteMany({});
        await Session.deleteMany({});
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
    beforeEach(async () => {
        await User.deleteMany({});
        await Session.deleteMany({});
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

        const session_id = signin_response.body.session_id;
        console.log(session_id);

        //try to sign out user
        const signout_response = await request(app)
            .delete("/api/auth/signout")
            .set("authorization", `Bearer ${session_id}`);

        expect(signout_response.status).toBe(200);
        expect(signout_response.body.message).toBe("user successfully signed out");
        const session = await Session.findById(session_id);
        expect(session).toBeNull();
    });

    it("should return 401 if an invalid session id is received", async () => {
        //try to sign out user
        const signout_response = await request(app)
            .delete("/api/auth/signout")
            .set("authorization", "Bearer dshufhusf");

        expect(signout_response.status).toBe(401);
        expect(signout_response.body.error).toBe("invalid session id");
    });
});

describe("GET /api/auth/account-info", () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await Session.deleteMany({});
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

        const session_id = signin_response.body.session_id;

        const account_info_response = await request(app)
            .get("/api/auth/account-info")
            .set("authorization", `Bearer ${session_id}`);

        expect(account_info_response.status).toBe(200);
        expect(account_info_response.body.email).toBe("johndoe@example.com");
        expect(account_info_response.body.first_name).toBe("John");
        expect(account_info_response.body.last_name).toBe("Doe");
    });
});

describe("PATCH /api/auth/account-info", () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await Session.deleteMany({});
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

        const session_id = signin_response.body.session_id;

        const account_info_response = await request(app)
            .patch("/api/auth/account-info")
            .set("authorization", `Bearer ${session_id}`)
            .send({
                first_name: "Jane",
                last_name: "Dove"
            });

        expect(account_info_response.status).toBe(200);
        expect(account_info_response.body.message).toBe("user successfully updated account information");

        const user = await User.findOne({email: "johndoe@example.com"});
        expect(user.first_name).toBe("Jane");
        expect(user.last_name).toBe("Dove");
    });
});
