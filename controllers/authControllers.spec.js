import bcrypt from "bcrypt";
import mssql from "mssql";
const jwt = require("jsonwebtoken");
import { registerUsers, userLogin } from "./authControllers";

const req = {
  body: {
    full_name: "Johgnh Jesso",
    email: "johnJgessko@gmail.com",
    password: "12345678",
  },
};

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
};

describe("Register an Employee", () => {
 it("should register a new employee successfully", async () => {
   jest.spyOn(bcrypt, "hash").mockResolvedValueOnce("kjhgsaiuytwiulkyiyui");

   const mockedInput = jest.fn().mockReturnThis();
   const mockedExecute = jest.fn().mockResolvedValue({ rowsAffected: [1] });
   const mockedRequest = {
     input: mockedInput,
     execute: mockedExecute,
   };
   const mockedPool = {
     request: jest.fn().mockReturnValue(mockedRequest),
   };

   jest.spyOn(mssql, "connect").mockResolvedValue(mockedPool); // mocks the mssql.connect function, pretend to connect to the database

   req.body = {
     full_name: "Johgnh Jesso", 
     email: "johnJgessko@gmail.com", 
     password: "password123", 
   };

   await registerUsers(req, res);

   expect(mockedInput).toHaveBeenCalledWith("id", expect.any(String)); 
   expect(mockedInput).toHaveBeenCalledWith(
     "full_name",
     mssql.VarChar,
     "Johgnh Jesso" 
   );
   expect(mockedInput).toHaveBeenCalledWith(
     "email",
     mssql.VarChar,
     "johnJgessko@gmail.com" 
   );
   expect(mockedInput).toHaveBeenCalledWith(
     "password",
     mssql.VarChar,
     "kjhgsaiuytwiulkyiyui"
   );

   expect(mockedExecute).toHaveBeenCalledWith("registerUsersProc");
   expect(res.status).toHaveBeenCalledWith(200);
   expect(res.json).toHaveBeenCalledWith({
     message: "User registered successfully",
   });
 });
;


  it("Fails if body is missing email or password", async () => {
    const request = {
      body: {
        full_name: "Johgnh Jesso",
        email: "johnJgessko@gmail.com",
      },
    };

    await registerUsers(request, res);
    expect(res.json).toHaveBeenCalledWith({ error: "Please input all values" });
  });

  it("Fails with error email already exists", async () => {
    jest.spyOn(bcrypt, "hash").mockResolvedValueOnce("kjhgsaiuytwiulkyiyui");

    const mockedInput = jest.fn().mockReturnThis();

    const mockedExecute = jest.fn().mockResolvedValue({ rowsAffected: [0] });

    const mockedRequest = {
      input: mockedInput,
      execute: mockedExecute,
    };

    const mockedPool = {
      request: jest.fn().mockReturnValue(mockedRequest),
    };

    jest.spyOn(mssql, "connect").mockResolvedValue(mockedPool);

    await registerUsers(req, res);

    expect(res.json).toHaveBeenCalledWith({
      message: "Registration failed",
    });
  });
});

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("Employee login tests", () => {
  afterEach(()=>{
      jest.restoreAllMocks()
  })

  it("should return an error if email or password is missing", async () => {
    const req = { body: {} };

    await userLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Please input all values",
    });
  });

  it("should return an error if email is not found/registered", async () => {
    const req = {
      body: {
        email: "abc@gmail.com",
        password: "12345678",
      },
    };

    jest.spyOn(mssql, "connect").mockResolvedValueOnce({
      request: jest.fn().mockReturnThis(),
      input: jest.fn().mockReturnThis(),
      execute: jest
        .fn()
        .mockResolvedValueOnce({ rowsAffected: [0], recordset: [] }),
    });

    await userLogin(req, res);

    
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid login credentials",
    });

  });


  it("should return an error if password is incorrect", async () => {
    const expectedUser = {
      full_name: "Johgnh Jesso",
      email: "johnJgessgdko@gmail.com",
      password: "12345678",
    };

    const req = {
      body: {
        email: expectedUser.email,
        password: "12345678",
      },
    };

    jest.spyOn(mssql, "connect").mockResolvedValueOnce({
      request: jest.fn().mockReturnThis(),
      input: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValueOnce({
        rowsAffected: 1,
        recordset: [expectedUser],
      }),
    });

    bcrypt.compare.mockResolvedValueOnce(false);

    await userLogin(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: "Invalid login credentials" });

    bcrypt.compare.mockRestore();
  });



  it("should return a token and log in user successfully", async () => {
    const expectedUser = {
      full_name: "Johgnh Jesso",
      email: "johnJgessko@gmail.com",
      password: "12345678",
    };

    const req = {
      body: {
        email: expectedUser.email,
        password: "correct_pwd",
      },
    };

    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(mssql, "connect").mockResolvedValueOnce({
      request: jest.fn().mockReturnThis(),
      input: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValueOnce({
        rowsAffected: 1,
        recordset: [expectedUser],
      }),
    });

    jest.spyOn(bcrypt, "compare").mockResolvedValueOnce(true);

    jest.spyOn(jwt, "sign").mockReturnValueOnce("mockedToken");

    await userLogin(req, response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      message: "logged in",
      token: "mockedToken",
    });
  });

});
