import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { createServer } from "@main/config/server";
import { Express } from "express";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

vi.mock("@main/utils/email", () => ({
  sendMail: vi.fn().mockResolvedValue(true),
}));

let server: Express;
let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  process.env.DB_URL = uri;
  server = await createServer();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

const registerData = {
  email: "test@test.com",
  password: "123456",
  name: "testuser",
};

const loginData = {
  email: "test@test.com",
  password: "asdcdf", // invalid password
};

describe("AUTH APIs", () => {
  it("GET /api/auth/register --> should return 201 & valid response", async () => {
    const response = await request(server)
      .post("/api/auth/register")
      .set("Authorization", "Basic dGVzdC1jbGllbnQ6dGVzdC1jbGllbnQ=")
      .send(registerData);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      data: {
        name: "testuser",
        email: "test@test.com",
        photo: null,
        status: "active",
      },
    });
  });

  it("GET /api/auth/login --> should return 406 & valid response", async () => {
    return request(server)
      .post("/api/auth/login")
      .set("Authorization", "Basic dGVzdC1jbGllbnQ6dGVzdC1jbGllbnQ=")
      .send(loginData)
      .expect(406) //
      .then((response) => {
        expect(response.body).toMatchObject({
          data: null,
          message: "Password Not Matched.",
          stack: null,
        });
      });
  });
});
