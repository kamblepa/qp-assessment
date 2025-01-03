/***** User Model *****/
import bcrypt from 'bcryptjs';

const saltRounds: number = 10;

// Define types for the options object used in the Login method
interface LoginOptions {
    emailId: string;
    password: string;
}

// Define a type for the user object returned from the database query
interface User {
    id: number;
    fname: string;
    lname: string;
    email: string;
    password: string;
    role_id: number;
    role_name: string;
}

//Create the Users Module
const Users = (connection: any) => {
    const module: Record<string, any> = {};

    /* Login Method */
    module.Login = (options: LoginOptions, callback: (err: boolean, result?: User | boolean) => void): void => {
        connection.query(`SELECT * FROM users WHERE email = '${options.emailId}';`, (err: any, user: User[]) => {
            if (err) {
                callback(true);
            } else {
                callback(false, user[0]);
            }
        })
    }

    return module;
}

export default Users;