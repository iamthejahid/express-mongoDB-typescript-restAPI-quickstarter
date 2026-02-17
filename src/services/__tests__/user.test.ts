import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createServer } from "@main/config/server";
import { Express } from "express";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { ObjectId } from "mongoose";
import { UserModel, UserStatus } from "@main/models/user.model";
import { accessTokenDetailAndRefreshTokenDetail } from "@main/utils/tokens";

let server: Express;
let mongo: MongoMemoryServer;
let validToken = "";
const invalidToken = "invalid token";

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  process.env.DB_URL = uri;
  server = await createServer();

  // Create a test user
  const user = await UserModel.create({
    name: "testuser",
    email: "test@test.com",
    password: "password123",
    status: UserStatus.active,
  });

  // Generate a valid token
  const tokens = await accessTokenDetailAndRefreshTokenDetail(
    { _id: user._id as unknown as ObjectId, name: user.name, email: user.email },
    "test-client" // client secret from vitest.config.ts
  );
  validToken = tokens.access.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe("USER APIs", () => {
  it("GET /api/user/info --> should return 200 & valid response", async () => {
    return request(server)
      .get("/api/user/info")
      .set("Authorization", "bearer " + validToken)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchObject({
          data: {
            name: "testuser",
            email: "test@test.com",
            photo: null,
          },
          message: null,
          stack: null,
        });
      });
  });

  it("GET /api/user/info --> should return 401 & valid response", async () => {
    return request(server)
      .get("/api/user/info")
      .set("Authorization", "bearer " + invalidToken)
      .expect("Content-Type", /json/)
      .expect(401)
      .then((response) => {
        expect(response.body).toMatchObject({
          data: null,
          message: "Invalid Token",
          stack: null,
        });
      });
  });
});
