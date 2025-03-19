import request from "supertest"; // Supertest allows us to simulate HTTP requests
import { app } from "../src/app.js";
import { Session, User, Group, GroupInvite, Message } from "../src/models.js";
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

//get all joined groups of calling user.
describe("GET /api/groups", () => {
    afterEach(async () => {
        await User.deleteMany({});
        await Group.deleteMany({});
        await Session.deleteMany({});
    });

    it("should return 200 status and 2 group objects for a signed in user", async () => {
        await User.create({
            email: "johndoe@example.com",
            password: "helpme",
            first_name: "John",
            last_name: "Doe"
        });

        const user = await User.findOne({email: "johndoe@example.com"})

        const signin_response = await request(app)
            .post("/api/auth/signin")
            .send({
                email: "johndoe@example.com",
                password: "helpme"
            });

        const session_id = signin_response.body.session_id;

        const group1 = await Group.create({
            name: "johnchat",
            members: [
                {
                    user: user._id,
                    role: "owner"
                }
            ],
            banned_members: [],
            messages: [],
            censored_phrases: []
        });

        const group2 = await Group.create({
            name: "doechat",
            members: [
                {
                    user: user._id,
                    role: "owner"
                }
            ],
            banned_members: [],
            messages: [],
            censored_phrases: []
        });

        const groups_response = await request(app)
            .get("/api/groups")
            .set("authorization", `Bearer ${session_id}`);

        expect(groups_response.status).toBe(200);
        expect(groups_response.body.length).toBe(2);
    });

    it("should return 200 status and 0 group objects for a signed in user", async () => {
        const user = await User.create({
            email: "johndoe@example.com",
            password: "helpme",
            first_name: "John",
            last_name: "Doe"
        });

        const signin_response = await request(app)
            .post("/api/auth/signin")
            .send({
                email: "johndoe@example.com",
                password: "helpme"
            });

        const session_id = signin_response.body.session_id;

        const groups_response = await request(app)
            .get("/api/groups")
            .set("authorization", `Bearer ${session_id}`);

        expect(groups_response.status).toBe(200);
        expect(groups_response.body.length).toBe(0);
    });
});

//get all group invites for the calling user
describe("GET /api/groups/invites", () => {
    afterEach(async () => {
        await User.deleteMany({});
        await Group.deleteMany({});
        await GroupInvite.deleteMany({});
        await Session.deleteMany({});
    });

    it("should return 200 and an array of invites of size 1 for a signed in user", async () => {
        const group = await Group.create({
            name: "justchatsupport",
            members: [],
            banned_members: [],
            messages: [],
            censored_phrases: []
        });
    
        const user = await User.create({
            email: "johndoe@example.com",
            password: "helpme",
            first_name: "John",
            last_name: "Doe"
        });
    
        //create invites with user.
        await GroupInvite.create({
            recipient: user._id,
            group: group._id
        });
    
        const signin_response = await request(app)
            .post("/api/auth/signin")
            .send({
                email: "johndoe@example.com",
                password: "helpme"
            });
    
        const session_id = signin_response.body.session_id;

        const invites_response = await request(app)
            .get("/api/groups/invites")
            .set("authorization", `Bearer ${session_id}`);

        expect(invites_response.status).toBe(200);
        expect(invites_response.body.length).toBe(1);
    });
});

//get a groups message history
describe("GET /api/groups/:group_id/messages", () => {
    afterEach(async () => {
        await User.deleteMany({});
        await Group.deleteMany({});
        await Session.deleteMany({});
        await Message.deleteMany({});
    });

    it("should return 200 and an array of messages of size 2 for a signed in user", async () => {
        const user = await User.create({
            email: "johndoe@example.com",
            password: "helpme",
            first_name: "John",
            last_name: "Doe"
        });

        const m1 = new Message({
            sender: user._id,
            content: "Hey me!"
        });

        const m2 = new Message({
            sender: user._id,
            content: "Hello me!"
        });

        const group = await Group.create({
            name: "justchatsupport",
            members: [
                {
                    user: user._id,
                    role: "owner"
                }
            ],
            banned_members: [],
            messages: [],
            censored_phrases: []
        });

        group.messages.push(m1);
        group.messages.push(m2);

        group.save();
    
        const signin_response = await request(app)
            .post("/api/auth/signin")
            .send({
                email: "johndoe@example.com",
                password: "helpme"
            });
    
        const session_id = signin_response.body.session_id;
        console.log(`GID: ${group._id}`);
        const messages_response = await request(app)
            .get(`/api/groups/${group._id}/messages`)
            .set("authorization", `Bearer ${session_id}`);

        expect(messages_response.status).toBe(200);
        expect(messages_response.body.length).toBe(2);
    });
    
});

//create a group
describe("POST /api/groups", () => {
    afterEach(async () => {
        await User.deleteMany({});
        await Group.deleteMany({});
        await Session.deleteMany({});
    });
    
    it("should return 201 and valid group data given a group name and a sign in user", async () => {
        const user = await User.create({
            email: "johndoe@example.com",
            password: "helpme",
            first_name: "John",
            last_name: "Doe"
        });

        const signin_response = await request(app)
            .post("/api/auth/signin")
            .send({
                email: "johndoe@example.com",
                password: "helpme"
            });
    
        const session_id = signin_response.body.session_id;

        const group_response = await request(app)
            .post(`/api/groups`)
            .set("authorization", `Bearer ${session_id}`)
            .send({
                group_name: "justchatsupport"
            });

        expect(group_response.status).toBe(201);
        expect(group_response.body.group).not.toBeNull();

        //confirm creation in database.
        const group = Group.findById(group_response.body._id);
        expect(group).not.toBeNull();
    });
});

//send an invite to a user for a specific group
describe("POST /api/groups/:group_id/invite/:email", () => {
    afterEach(async () => {
        await User.deleteMany({});
        await Group.deleteMany({});
        await GroupInvite.deleteMany({});
        await Session.deleteMany({});
    });

    it("should return 201 for a signed in user inviting a registered user email", async () => {
        const inviter = await User.create({
            email: "johndoe@example.com",
            password: "helpme",
            first_name: "John",
            last_name: "Doe"
        });

        const group = await Group.create({
            name: "justchatsupport",
            members: [
                {
                    user: inviter._id,
                    role: "owner"
                }
            ],
            banned_members: [],
            messages: [
                {
                    sender: inviter._id,
                    content: "Hey me!"
                },
                {
                    sender: inviter._id,
                    content: "Hello me!"
                }
            ],
            censored_phrases: []
        });

        const invitee = await User.create({
            email: "janedoe@example.com",
            password: "helpme",
            first_name: "Jane",
            last_name: "Doe"
        });

        const signin_response = await request(app)
            .post("/api/auth/signin")
            .send({
                email: "johndoe@example.com",
                password: "helpme"
            });
    
        const session_id = signin_response.body.session_id;

        const group_invite_response = await request(app)
            .post(`/api/groups/${group._id}/invite/janedoe@example.com`)
            .set("authorization", `Bearer ${session_id}`)

        expect(group_invite_response.status).toBe(201);
        expect(group_invite_response.body.group).not.toBeNull();

        //confirm creation in database.
        const group_invite = GroupInvite.findOne({recipient: invitee._id});
        expect(group_invite).not.toBeNull();
    });

    it("should return 400 for a signed in user inviting an unregistered user email", async () => {
        const inviter = await User.create({
            email: "johndoe@example.com",
            password: "helpme",
            first_name: "John",
            last_name: "Doe"
        });

        const group = await Group.create({
            name: "justchatsupport",
            members: [
                {
                    user: inviter._id,
                    role: "owner"
                }
            ],
            banned_members: [],
            messages: [],
            censored_phrases: []
        });

        const signin_response = await request(app)
            .post("/api/auth/signin")
            .send({
                email: "johndoe@example.com",
                password: "helpme"
            });
    
        const session_id = signin_response.body.session_id;

        const group_invite_response = await request(app)
            .post(`/api/groups/${group._id}/invite/janedoe@example.com`)
            .set("authorization", `Bearer ${session_id}`)

        expect(group_invite_response.status).toBe(400);
        expect(group_invite_response.body.error).toBe("failure");
    });
    
});

//add calling user to a group.
describe("PATCH /api/groups/:group_id/add-member", () => {
    afterEach(async () => {
        await User.deleteMany({});
        await Group.deleteMany({});
        await Session.deleteMany({});
    });

    it("should return 200 for a signed in user being added to a group with a valid group id", async () => {
        const group = await Group.create({
            name: "justchatsupport",
            members: [],
            banned_members: [],
            messages: [],
            censored_phrases: []
        });
    
        const user = await User.create({
            email: "johndoe@example.com",
            password: "helpme",
            first_name: "John",
            last_name: "Doe"
        });
    
        const signin_response = await request(app)
            .post("/api/auth/signin")
            .send({
                email: "johndoe@example.com",
                password: "helpme"
            });
    
        const session_id = signin_response.body.session_id;

        const addmemb_response = await request(app)
            .patch(`/api/groups/${group._id}/add-member`)
            .set("authorization", `Bearer ${session_id}`);

        expect(addmemb_response.status).toBe(200);
        expect(addmemb_response.body.message).toBe("success");
    });

    it("should return 400 for a signed in user being added to a group with an invalid group id", async () => {
        const user = await User.create({
            email: "johndoe@example.com",
            password: "helpme",
            first_name: "John",
            last_name: "Doe"
        });
    
        const signin_response = await request(app)
            .post("/api/auth/signin")
            .send({
                email: "johndoe@example.com",
                password: "helpme"
            });
    
        const session_id = signin_response.body.session_id;

        const addmemb_response = await request(app)
            .patch(`/api/groups/${new mongoose.Types.ObjectId()}/add-member`)
            .set("authorization", `Bearer ${session_id}`);

        expect(addmemb_response.status).toBe(400);
        expect(addmemb_response.body.error).toBe("failure");
    });
});

//remove calling user from group.
describe("PATCH /api/groups/:group_id/remove-member", () => {
    afterEach(async () => {
        await User.deleteMany({});
        await Group.deleteMany({});
        await Session.deleteMany({});
    });

    it("should return 200 for a signed in user being added to a group with a valid group id", async () => {
        const group = await Group.create({
            name: "justchatsupport",
            members: [],
            banned_members: [],
            messages: [],
            censored_phrases: []
        });
    
        const user = await User.create({
            email: "johndoe@example.com",
            password: "helpme",
            first_name: "John",
            last_name: "Doe"
        });
    
        const signin_response = await request(app)
            .post("/api/auth/signin")
            .send({
                email: "johndoe@example.com",
                password: "helpme"
            });
    
        const session_id = signin_response.body.session_id;

        const remmemb_response = await request(app)
            .patch(`/api/groups/${group._id}/remove-member`)
            .set("authorization", `Bearer ${session_id}`);

        expect(remmemb_response.status).toBe(200);
        expect(remmemb_response.body.message).toBe("success");
    });

    it("should return 400 for a signed in user being removed from a group with an invalid group id", async () => {
        const user = await User.create({
            email: "johndoe@example.com",
            password: "helpme",
            first_name: "John",
            last_name: "Doe"
        });
    
        const signin_response = await request(app)
            .post("/api/auth/signin")
            .send({
                email: "johndoe@example.com",
                password: "helpme"
            });
    
        const session_id = signin_response.body.session_id;

        const remmemb_response = await request(app)
            .patch(`/api/groups/${new mongoose.Types.ObjectId()}/remove-member`)
            .set("authorization", `Bearer ${session_id}`);

        expect(remmemb_response.status).toBe(400);
        expect(remmemb_response.body.error).toBe("failure");
    });
});

//delete a group.
describe("DELETE /api/groups/:group_id", () => {
    afterEach(async () => {
        await User.deleteMany({});
        await Group.deleteMany({});
        await Session.deleteMany({});
    });
    
    it("should return 200 for a signed in user who is the owner of the group with a valid id", async () => {
        const user = await User.create({
            email: "johndoe@example.com",
            password: "helpme",
            first_name: "John",
            last_name: "Doe"
        });

        const signin_response = await request(app)
            .post("/api/auth/signin")
            .send({
                email: "johndoe@example.com",
                password: "helpme"
            });
    
        const session_id = signin_response.body.session_id;

        const group_response = await request(app)
            .post(`/api/groups`)
            .set("authorization", `Bearer ${session_id}`)
            .send({
                group_name: "justchatsupport"
            });

        const del_response = await request(app)
            .delete(`/api/groups/${group_response.body._id}`)
            .set("authorization", `Bearer ${session_id}`);

        expect(del_response.status).toBe(200);
        expect(del_response.body.message).toBe("success");
    });

    it("should return 400 for a signed in user who is not the owner of the group with a valid id", async () => {
        const user = await User.create({
            email: "johndoe@example.com",
            password: "helpme",
            first_name: "John",
            last_name: "Doe"
        });

        const signin_response = await request(app)
            .post("/api/auth/signin")
            .send({
                email: "johndoe@example.com",
                password: "helpme"
            });
    
        const session_id = signin_response.body.session_id;

        const group = await Group.create({
            name: "justchatsupport",
            members: [
                {
                    user: user._id,
                    role: "member"
                }
            ],
            banned_members: [],
            messages: [],
            censored_phrases: []
        });

        const del_response = await request(app)
            .delete(`/api/groups/${group._id}`)
            .set("authorization", `Bearer ${session_id}`);

        expect(del_response.status).toBe(400);
        expect(del_response.body.error).toBe("delete not authorized for this user");
    });

});

//TODO: messaging test.