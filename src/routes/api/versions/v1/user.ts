interface LoginRequest {
    emailId: string;
    password: string;
}
interface User {
    // Define the structure of a user object based on your model's response
    id?: number;
    fname?: string;
    lname?: string;
    email?: string;
    password?: string;
    role_id?: number;
    role_name?: string;
    // Add any other user properties
}

export const userController = {
    'login': function (model: any, request: LoginRequest, method: string, cb: (err: boolean, result: any) => void) {
      if (method === 'POST') {
        const { emailId, password } = request;
  
        model.Users.Login({ emailId, password }, (err: any, user: User | null) => {
          if (err) {
            cb(true, { success: false, error: err });
          } else {
            cb(false, { success: true, userPresent: user ? 1 : 0, userDetails: user });
          }
        });
      } else {
        cb(true, { success: false });
      }
    },
};
