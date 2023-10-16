import { prismaClient } from "../lib/db";
import { createHmac, randomBytes } from "node:crypto";
import JWT from "jsonwebtoken";

const JWT_SECRET = "$uperM@n@123";

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface GetUserTokenPayload {
  email: string;
  password: string;
}

class UserService {
  private static createHashedPassword(password: string, salt: string) {
    const hashedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");
    return hashedPassword;
  }

  private static async getUserByEmail(email: string) {
    return await prismaClient.user.findUnique({
      where: { email: email },
    });
  }

  public static async getUserById(id: string) {
    return await prismaClient.user.findUnique({ where: { id: id } });
  }

  public static async getUserToken(payload: GetUserTokenPayload) {
    const { email, password } = payload;
    const userFound = await this.getUserByEmail(email);

    if (!userFound) throw new Error("User not found");

    const userHashedPassword = this.createHashedPassword(
      password,
      userFound.salt
    );

    if (userHashedPassword !== userFound.password)
      throw new Error("Password not correct");

    const userToken = JWT.sign(
      { user: { id: userFound.id, email: userFound.email } },
      JWT_SECRET
    );

    return userToken;
  }

  public static async createUser(payload: CreateUserPayload) {
    const { firstName, lastName, email, password } = payload;

    const salt = randomBytes(32).toString("hex");
    const hashedPassword = this.createHashedPassword(password, salt);

    return await prismaClient.user.create({
      data: { firstName, lastName, email, password: hashedPassword, salt },
    });
  }

  public static decodeJWTToken(token: string) {
    return JWT.verify(token, JWT_SECRET);
  }
}

export default UserService;
