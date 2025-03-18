import request from "supertest"; // Supertest allows us to simulate HTTP requests
import { app, ConnectDB, Group, GroupInvite } from "../app.js";
import mongoose from "mongoose";

const mongo_url = null;