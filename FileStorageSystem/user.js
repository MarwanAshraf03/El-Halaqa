import fs from "fs";
import os from "os";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// user structure {"id": uuid, "userName": "userName", "password": "passwordHashed", "type": "type => ["admin", "Mem", "Rev"]"}

export class User {
  #directory = path.join(os.homedir(), "/storage/documents/El-Halaqa/users");
  #filePath = path.join(this.#directory, "users.json");
  #id;
  #userName;
  #passwordHashed;
  #type;

  //   constructor({ id, userName, passwordHashed, type }) {
  constructor(object) {
    const { id, userName, passwordHashed, type } = object;
    console.log("User constructor called with parameters:", {
      id,
      userName,
      passwordHashed,
      type,
    });
    this.#id = id;
    // Ensure the directory exists before writing
    if (!fs.existsSync(this.#directory)) {
      fs.mkdirSync(this.#directory, { recursive: true });
    }
    // Check if the file exists
    if (!fs.existsSync(this.#filePath)) {
      fs.writeFileSync(this.#filePath, JSON.stringify({}), "utf8");
    }
    if (id) {
      console.log("inside id condition");
      // Load user info if id is provided
      const users = JSON.parse(fs.readFileSync(this.#filePath, "utf8"));
      if (users[id]) {
        this.#userName = users[id].userName;
        this.#passwordHashed = users[id].password;
        this.#type = users[id].type;
      } else {
        throw new Error(`User with id ${id} does not exist.`);
      }
    } else if (userName && passwordHashed && type) {
      // Initialize user with provided username and hashed password
      const users = JSON.parse(fs.readFileSync(this.#filePath, "utf8"));
      const userEntries = Object.entries(users);
      const existingUser = userEntries.find(
        ([_, value]) => value.userName === userName
      );
      if (existingUser) {
        throw new Error(`User with username ${userName} already exists.`);
      }
      this.#userName = userName;
      this.#passwordHashed = passwordHashed;
      this.#type = type; // type should be provided as well
    } else {
      throw new Error(
        "Invalid parameters. Must provide id or userName, passwordHashed, and type."
      );
    }
  }

  static getUser(object) {
    const { id, userName } = object;
    console.log("getUser called with parameters:", { id, userName });
    const directory = path.join(
      os.homedir(),
      "/storage/documents/El-Halaqa/users"
    );
    const filePath = path.join(directory, "users.json");
    if (!fs.existsSync(filePath)) {
      throw new Error("User file does not exist.");
    }
    const users = JSON.parse(fs.readFileSync(filePath, "utf8"));
    if (!users) {
      throw new Error("No users found.");
    }
    if (id) {
      if (!users[id]) {
        throw new Error(`User with id ${id} does not exist.`);
      }
      const user = users[id];
      return user;
    } else if (userName) {
      // Find user by userName
      const userEntries = Object.entries(users);
      const user = userEntries.find(
        ([_, value]) => value.userName === userName
      );
      if (user) {
        return { id: user[0], ...user[1] };
      } else {
        throw new Error(`User with username ${userName} does not exist.`);
      }
    } else {
      throw new Error("Must provide either id or userName to get user.");
    }
  }

  getUserInfo() {
    if (!this.#id) {
      const user = this.saveUser(this.#type);
      return {
        [user.id]: {
          userName: user.userName,
          passwordHashed: user.password,
          type: user.type,
        },
      };
    }
    return {
      [this.#id]: {
        userName: this.#userName,
        passwordHashed: this.#passwordHashed,
        type: this.#type,
      },
    };
  }

  saveUser(type) {
    console.log("saveUser called");
    if (this.#id) {
      throw new Error("User already exists.");
    }
    if (["admin", "Mem", "Rev"].indexOf(type) === -1) {
      throw new Error("Invalid user type. Must be one of: admin, Mem, or Rev.");
    }
    const user = {
      userName: this.#userName,
      password: this.#passwordHashed,
      type: type,
    };
    const users = JSON.parse(fs.readFileSync(this.#filePath, "utf8"));
    const id = uuidv4();
    users[id] = user;
    this.#id = id;
    user.id = id;
    fs.writeFileSync(this.#filePath, JSON.stringify(users, null, 2), "utf8");
    return user;
  }
}
