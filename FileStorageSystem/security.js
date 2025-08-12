// import bcrypt
import bcrypt from "bcrypt";
import { User } from "./user.js";
export class Security {
  static authenticate(userName, password) {
    const user = User.getUser({ userName: userName });
    const passwordHashed = bcrypt.hashSync(password, 10); // Hash the password
    if (user && bcrypt.compareSync(password, passwordHashed)) {
      return true;
    } else {
      return false;
    }
  }

  //   static authorize(user, requiredType) {
  //     // This method should check if the user has the required permissions
  //     // For simplicity, let's assume we have a hardcoded user type
  //     const userTypes = {
  //       admin: "admin",
  //       Mem: "Mem",
  //       Rev: "Rev",
  //     };

  //     if (userTypes[user.type] === requiredType) {
  //       return { success: true, message: "Authorization successful." };
  //     } else {
  //       return { success: false, message: "Authorization failed." };
  //     }
  //   }
}
