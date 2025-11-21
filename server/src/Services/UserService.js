// src/Services/UserService.js
const CONSTANTS = require("../Config/Constants");
const { HashPassword, VerifyPassword } = require("../Helpers/Hashing");
const { jwtSecret } = require("../Config/Config");
const JwtManager = require("../Helpers/Jwt");
const { sendResponse } = require("../Helpers/SendResponse");
const sendEmail = require("../Helpers/EmailConfig");
const crypto = require("crypto");

class UserService {
  constructor(userRepo) {
    this.userRepo = userRepo;
  }

  // ───────────────── LOGIN ─────────────────
  async Login(req) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return sendResponse(
          CONSTANTS.FIELD_EMPTY,
          CONSTANTS.SERVER_BAD_REQUEST_HTTP_CODE
        );
      }

      const user = await this.userRepo.Login(email);
      if (!user) {
        return sendResponse(
          CONSTANTS.LOGIN_ERROR,
          CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE
        );
      }

      const passwordMatch = await VerifyPassword(password, user.password);
      if (!passwordMatch) {
        return sendResponse(
          CONSTANTS.LOGIN_ERROR,
          CONSTANTS.SERVER_UNAUTHORIZED_HTTP_CODE
        );
      }

      const token = JwtManager.sign(
        {
          userId: user._id,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          active_token: user.active_token,
        },
        jwtSecret
      );

      await user.updateLastLogin();

      return sendResponse(
        CONSTANTS.USER_LOGIN_OK,
        CONSTANTS.SERVER_OK_HTTP_CODE,
        { token }
      );
    } catch (error) {
      console.error("Error during login:", error);
      return sendResponse(
        CONSTANTS.SERVER_ERROR_MESSAGE,
        CONSTANTS.SERVER_INTERNAL_ERROR_HTTP_CODE
      );
    }
  }

  // ─────────────── CREATE CUSTOMER ───────────────
  async createCustomer(req) {
    try {
      const { first_name, last_name, email, password } = req.body;

      if (!first_name || !last_name || !email || !password) {
        return sendResponse(
          CONSTANTS.FIELD_EMPTY,
          CONSTANTS.SERVER_BAD_REQUEST_HTTP_CODE
        );
      }

      // (Optionally) check if user already exists
      const existing = await this.userRepo.Login(email);
      if (existing) {
        return sendResponse(
          CONSTANTS.USER_REGISTRATION_FAILED,
          CONSTANTS.SERVER_ERROR_HTTP_CODE
        );
      }

      const customer = {
        first_name,
        last_name,
        email,
        role: "customer",
        password: await HashPassword(password),
        active_token: crypto.randomBytes(32).toString("hex"),
      };

      const user = await this.userRepo.Register(customer);

      if (!user) {
        return sendResponse(
          CONSTANTS.SERVER_ERROR_MESSAGE,
          CONSTANTS.SERVER_INTERNAL_ERROR_HTTP_CODE
        );
      }

      // Generate token directly (no axios call)
      const token = JwtManager.sign(
        {
          userId: user._id,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          active_token: user.active_token,
        },
        jwtSecret
      );

      // Send activation email
      sendEmail(email, user.active_token);

      return sendResponse(
        CONSTANTS.USER_CREATED,
        CONSTANTS.SERVER_CREATED_HTTP_CODE,
        { user, token }
      );
    } catch (error) {
      console.error("Error creating customer:", error);
      return sendResponse(
        CONSTANTS.SERVER_ERROR_MESSAGE,
        CONSTANTS.SERVER_INTERNAL_ERROR_HTTP_CODE
      );
    }
  }

  // ─────────────── ACTIVATE CUSTOMER ───────────────
  async activeCustomer(req) {
    try {
      const queryToken = req.query.token;
      const active_token = req.user.active_token;
      const customerId = req.user.userId;

      if (!queryToken || !active_token) {
        return sendResponse(
          CONSTANTS.WRONG_TOKEN,
          CONSTANTS.SERVER_BAD_REQUEST_HTTP_CODE
        );
      }

      if (queryToken !== active_token) {
        return sendResponse(
          CONSTANTS.WRONG_TOKEN,
          CONSTANTS.SERVER_FORBIDDEN_HTTP_CODE
        );
      }

      const user = await this.userRepo.activeCustomer(customerId);

      if (!user) {
        return sendResponse(
          CONSTANTS.USER_NOT_FOUND,
          CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE
        );
      }

      return sendResponse(
        CONSTANTS.USER_UPDATED,
        CONSTANTS.SERVER_OK_HTTP_CODE,
        { user }
      );
    } catch (error) {
      console.error("Error activating customer:", error);
      return sendResponse(
        CONSTANTS.SERVER_ERROR_MESSAGE,
        CONSTANTS.SERVER_INTERNAL_ERROR_HTTP_CODE
      );
    }
  }

  // ─────────────── GET ALL USERS ───────────────
  async getAllUsers(req) {
    try {
      if (req.user.role !== "admin") {
        return sendResponse(
          CONSTANTS.NOT_AUTHORIZED,
          CONSTANTS.SERVER_FORBIDDEN_HTTP_CODE
        );
      }

      const users = await this.userRepo.getAllUsers(req.query);

      return sendResponse(CONSTANTS.USER_FOUND, CONSTANTS.SERVER_OK_HTTP_CODE, {
        users,
      });
    } catch (error) {
      console.error("Error getting all users:", error);
      return sendResponse(
        CONSTANTS.SERVER_ERROR_MESSAGE,
        CONSTANTS.SERVER_INTERNAL_ERROR_HTTP_CODE
      );
    }
  }

  // ─────────────── GET USER BY ID ───────────────
  async getUserById(req) {
    try {
      const role = req.user.role;
      const userId = req.params.id;

      if (role !== "admin") {
        return sendResponse(
          CONSTANTS.NOT_AUTHORIZED,
          CONSTANTS.SERVER_FORBIDDEN_HTTP_CODE
        );
      }

      const user = await this.userRepo.getUserById(userId);

      if (!user) {
        return sendResponse(
          CONSTANTS.USER_NOT_FOUND,
          CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE
        );
      }

      return sendResponse(CONSTANTS.USER_FOUND, CONSTANTS.SERVER_OK_HTTP_CODE, {
        user,
      });
    } catch (error) {
      console.error("Error getting user by id:", error);
      return sendResponse(
        CONSTANTS.SERVER_ERROR_MESSAGE,
        CONSTANTS.SERVER_INTERNAL_ERROR_HTTP_CODE
      );
    }
  }

  // ─────────────── PROFILE ───────────────
  async getProfile(req) {
    try {
      const user = req.user;
      return sendResponse("Success", CONSTANTS.SERVER_OK_HTTP_CODE, { user });
    } catch (error) {
      console.error("Error getting profile:", error);
      return sendResponse(
        CONSTANTS.SERVER_ERROR_MESSAGE,
        CONSTANTS.SERVER_INTERNAL_ERROR_HTTP_CODE
      );
    }
  }

  // ─────────────── UPDATE USER ───────────────
  async updateUser(req) {
    try {
      const id = req.params.id;

      if (req.user.role !== "admin" && req.user.userId !== id) {
        return sendResponse(
          CONSTANTS.NOT_AUTHORIZED,
          CONSTANTS.SERVER_FORBIDDEN_HTTP_CODE
        );
      }

      const data = req.body;
      const user = await this.userRepo.updateUser(id, data);

      if (!user) {
        return sendResponse(
          CONSTANTS.USER_NOT_FOUND,
          CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE
        );
      }

      return sendResponse(
        CONSTANTS.USER_UPDATED,
        CONSTANTS.SERVER_OK_HTTP_CODE
      );
    } catch (error) {
      console.error("Error updating user:", error);
      return sendResponse(
        CONSTANTS.SERVER_ERROR_MESSAGE,
        CONSTANTS.SERVER_INTERNAL_ERROR_HTTP_CODE
      );
    }
  }

  // ─────────────── DELETE USER ───────────────
  async deleteUser(req) {
    try {
      const id = req.params.id;

      if (
        req.user.role !== "admin" &&
        !(req.user.role === "customer" && req.user.userId === id)
      ) {
        return sendResponse(
          CONSTANTS.NOT_AUTHORIZED,
          CONSTANTS.SERVER_FORBIDDEN_HTTP_CODE
        );
      }

      const user = await this.userRepo.deleteUser(id);

      if (!user) {
        return sendResponse(
          CONSTANTS.USER_NOT_FOUND,
          CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE
        );
      }

      return sendResponse(
        CONSTANTS.USER_DELETED,
        CONSTANTS.SERVER_OK_HTTP_CODE,
        { user }
      );
    } catch (error) {
      console.error("Error deleting user:", error);
      return sendResponse(
        CONSTANTS.SERVER_ERROR_MESSAGE,
        CONSTANTS.SERVER_INTERNAL_ERROR_HTTP_CODE
      );
    }
  }
}

module.exports = { UserService };
