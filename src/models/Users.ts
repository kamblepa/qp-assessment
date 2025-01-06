/***** User Model *****/
import bcrypt from 'bcryptjs';

const saltRounds: number = 10;

//types for the options object used in the Login method
interface LoginOptions {
    emailId: string;
    password: string;
}

//types for the user object returned from the database query
interface User {
    id: number;
    fname: string;
    lname: string;
    email: string;
    password?: string;
    role_id: number;
    role_name: string;
}

//the Users Module
const Users = (connection: any) => {
    const module: Record<string, any> = {};

    /* Login Method */
    module.Login = (options: LoginOptions, callback: (err: boolean, result?: User | boolean) => void): void => {
        connection.query(`SELECT * FROM users WHERE email = '${options.emailId}';`, (err: any, user: User[]) => {
            if (err) {
                callback(true);
            } else {
                if(user.length === 0) {
                    callback(true)
                } else {
                    if (user[0].password) {
                        const comparePass = bcrypt.compareSync(options.password, user[0].password)
                        if(comparePass) {
                            delete user[0].password;
                            callback(false, user[0])
                        } else {
                            callback(true, false)
                        }
                    } else {
                        callback(true, false)
                    }
                }
            }
        })
    }

    return module;
}

export default Users;