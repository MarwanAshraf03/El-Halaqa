import { getDiffieHellman } from "crypto";
import fs from "fs";
import os from "os";
import path from "path";
// import Group from "./group.js"
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
    // console.log("User constructor called with parameters:", {
    //   id,
    //   userName,
    //   passwordHashed,
    //   type,
    // });
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
      // console.log("inside id condition");
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
    // console.log("getUser called with parameters:", { id, userName });
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

  get_id() {
    return this.#id;
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
    // console.log("saveUser called");
    if (this.#id) {
      throw new Error("User already exists.");
    }
    // console.log("the type provided is ", type);
    if (["admin", "Mem", "Rev", "Mem-Rev"].indexOf(type) === -1) {
      throw new Error(
        "Invalid user type. Must be one of: admin, Mem, Rev, or Mem-Rev."
      );
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

  addGroup(object) {
    const { id, name, students } = object;
    const groupDirPath = path.join(
      os.homedir(),
      "/storage/documents/El-Halaqa/groups/"
    );
    const groupFilePath = path.join(groupDirPath, "groups.json");
    if (!fs.existsSync(groupDirPath)) {
      fs.mkdirSync(groupDirPath, { recursive: true });
    }

    if (!this.#id) {
      this.saveUser(this.#type);
    }
    const group = new Group({
      id: id,
      name: name,
      students: students,
      teacherId: this.#id,
    });

    const ret = group.save();
    if (!ret) return false;
    return true;
  }
}

class Group {
  #id;
  #name;
  #teacherId;
  #students = [];
  #directory = path.join(os.homedir(), "/storage/documents/El-Halaqa/groups");
  #filePath = path.join(this.#directory, "groups.json");

  // structure of groups.json: {"groupId": {"teacherId": "teacherId", "name": "group_name", "students": ["student_id1", "student_id2"]}}
  constructor(object) {
    const { id, name, students, teacherId } = object;

    // Ensure the directory exists before writing
    if (!fs.existsSync(this.#directory)) {
      fs.mkdirSync(this.#directory, { recursive: true });
    }

    // Load existing group data if id is provided
    if (id) {
      const groups = JSON.parse(fs.readFileSync(this.#filePath, "utf8"));
      if (groups[id]) {
        this.#name = groups[id].name;
        this.#students = groups[id].students || [];
        this.#teacherId = groups[id].teacherId;
      } else {
        throw new Error(`Group with id ${id} does not exist.`);
      }
    } else if (name && students && teacherId) {
      this.#id = uuidv4();
      this.#students = students || [];
      this.#name = name;
      this.#teacherId = teacherId;
    } else {
      throw new Error(
        "Invalid parameters. Must provide ( id ) or ( name, students, and teacherId )."
      );
    }
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  get students() {
    return this.#students;
  }

  get teacherId() {
    return this.#teacherId;
  }

  save() {
    const groups = JSON.parse(fs.readFileSync(this.#filePath, "utf8"));
    if (this.#id in Object.keys(groups)) return null;
    const group = {
      teacherId: this.#teacherId,
      name: this.#name,
      students: this.#students,
    };
    groups[this.#id] = group;
    fs.writeFileSync(this.#filePath, JSON.stringify(groups, null, 2), "utf8");
    return group;
  }
}
