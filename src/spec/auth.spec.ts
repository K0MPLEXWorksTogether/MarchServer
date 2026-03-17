export const authOpenApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "March Auth API",
    version: "1.0.0",
    description:
      "Auth endpoints for signup, email verification, login, and refresh-token rotation.",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local development server",
    },
  ],
  tags: [{ name: "Auth", description: "Authentication and verification flow" }],
  paths: {
    "/api/v1/auth/signup": {
      post: {
        tags: ["Auth"],
        operationId: "signup",
        summary: "Signup and send verification mail",
        description: [
          "Creates a user using client-provided `passwordHash`, stores an in-memory verification token, and sends verification email.",
          "",
          "Example curl:",
          "```bash",
          'curl -i -X POST "http://localhost:3000/api/v1/auth/signup" \\',
          '  -H "Content-Type: application/json" \\',
          "  -d '{",
          '    "username": "janedoe01",',
          '    "email": "jane@example.com",',
          '    "passwordHash": "$argon2id$v=19$m=65536,t=3,p=4$...$...",',
          '    "timezone": "Asia/Kolkata",',
          '    "locale": "en-IN"',
          "  }'",
          "```",
        ].join("\n"),
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SignupRequest" },
              examples: {
                default: {
                  value: {
                    username: "janedoe01",
                    email: "jane@example.com",
                    passwordHash: "$argon2id$v=19$m=65536,t=3,p=4$...$...",
                    timezone: "Asia/Kolkata",
                    locale: "en-IN",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Signup successful and verification mail queued",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SignupResponse" },
                examples: {
                  success: {
                    value: {
                      message: "Signup successful. Please verify your email.",
                      user: {
                        userId: "67d77c3f6b635198f699e95e",
                        username: "janedoe01",
                        email: "jane@example.com",
                        isVerified: false,
                        timezone: "Asia/Kolkata",
                        locale: "en-IN",
                        createdAt: "2026-03-17T05:00:00.000Z",
                        updatedAt: "2026-03-17T05:00:00.000Z",
                      },
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Validation or duplicate user error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  duplicate: {
                    value: {
                      message:
                        "User with email: jane@example.com or username: janedoe01 already exists",
                    },
                  },
                },
              },
            },
          },
        },
        "x-codeSamples": [
          {
            lang: "bash",
            source:
              "curl -i -X POST 'http://localhost:3000/api/v1/auth/signup' -H 'Content-Type: application/json' -d '{\"username\":\"janedoe01\",\"email\":\"jane@example.com\",\"passwordHash\":\"$argon2id$v=19$m=65536,t=3,p=4$...$...\",\"timezone\":\"Asia/Kolkata\",\"locale\":\"en-IN\"}'",
          },
        ],
      },
    },
    "/api/v1/auth/verify": {
      get: {
        tags: ["Auth"],
        operationId: "verifyEmail",
        summary: "Verify email and issue auth cookies",
        description: [
          "Validates query params `userId` and `token`, verifies user account, then sets `accessToken` and `refreshToken` cookies.",
          "",
          "Example curl:",
          "```bash",
          'curl -i "http://localhost:3000/api/v1/auth/verify?userId=67d77c3f6b635198f699e95e&token=2cce92cc-f8c6-4ec3-a1e0-3f4f31f025ee"',
          "```",
        ].join("\n"),
        parameters: [
          {
            in: "query",
            name: "userId",
            required: true,
            schema: { type: "string" },
            example: "67d77c3f6b635198f699e95e",
          },
          {
            in: "query",
            name: "token",
            required: true,
            schema: { type: "string", format: "uuid" },
            example: "2cce92cc-f8c6-4ec3-a1e0-3f4f31f025ee",
          },
        ],
        responses: {
          "200": {
            description: "User verified and token cookies set",
            headers: {
              "Set-Cookie": {
                description:
                  "Contains `accessToken` and `refreshToken` httpOnly cookies",
                schema: { type: "string" },
              },
            },
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/VerifyResponse" },
                examples: {
                  success: {
                    value: {
                      message: "Email verified successfully.",
                      user: {
                        userId: "67d77c3f6b635198f699e95e",
                        username: "janedoe01",
                        email: "jane@example.com",
                        isVerified: true,
                        timezone: "Asia/Kolkata",
                        locale: "en-IN",
                        createdAt: "2026-03-17T05:00:00.000Z",
                        updatedAt: "2026-03-17T05:10:00.000Z",
                      },
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid verification token or query",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  invalidToken: { value: { message: "Invalid verification token" } },
                },
              },
            },
          },
        },
        "x-codeSamples": [
          {
            lang: "bash",
            source:
              "curl -i 'http://localhost:3000/api/v1/auth/verify?userId=67d77c3f6b635198f699e95e&token=2cce92cc-f8c6-4ec3-a1e0-3f4f31f025ee'",
          },
        ],
      },
    },
    "/api/v1/auth/login": {
      post: {
        tags: ["Auth"],
        operationId: "login",
        summary: "Login with email/password and set cookies",
        description: [
          "Verifies argon2 password hash and issues `accessToken` and `refreshToken` cookies.",
          "",
          "Example curl:",
          "```bash",
          'curl -i -X POST "http://localhost:3000/api/v1/auth/login" \\',
          '  -H "Content-Type: application/json" \\',
          '  -d \'{"email":"jane@example.com","password":"StrongPass!123"}\'',
          "```",
        ].join("\n"),
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
              examples: {
                default: {
                  value: {
                    email: "jane@example.com",
                    password: "StrongPass!123",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Login successful and cookies set",
            headers: {
              "Set-Cookie": {
                description:
                  "Contains `accessToken` and `refreshToken` httpOnly cookies",
                schema: { type: "string" },
              },
            },
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageResponse" },
                examples: {
                  success: { value: { message: "Login successful" } },
                },
              },
            },
          },
          "400": {
            description: "Invalid credentials or unverified user",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  invalidCredentials: { value: { message: "Invalid credentials" } },
                  unverified: { value: { message: "User is not verified" } },
                },
              },
            },
          },
        },
        "x-codeSamples": [
          {
            lang: "bash",
            source:
              "curl -i -X POST 'http://localhost:3000/api/v1/auth/login' -H 'Content-Type: application/json' -d '{\"email\":\"jane@example.com\",\"password\":\"StrongPass!123\"}'",
          },
        ],
      },
    },
    "/api/v1/auth/refresh": {
      post: {
        tags: ["Auth"],
        operationId: "refreshTokens",
        summary: "Rotate access and refresh tokens",
        description: [
          "Accepts refresh token from `refreshToken` cookie, validates it, and returns rotated cookies.",
          "",
          "Example curl:",
          "```bash",
          'curl -i -X POST "http://localhost:3000/api/v1/auth/refresh" \\',
          '  --cookie "refreshToken=<refresh_token>"',
          "```",
        ].join("\n"),
        parameters: [
          {
            in: "cookie",
            name: "refreshToken",
            required: true,
            schema: { type: "string" },
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          },
        ],
        responses: {
          "200": {
            description: "Tokens refreshed and cookies set",
            headers: {
              "Set-Cookie": {
                description:
                  "Contains new `accessToken` and `refreshToken` httpOnly cookies",
                schema: { type: "string" },
              },
            },
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageResponse" },
                examples: {
                  success: { value: { message: "Token refresh successful" } },
                },
              },
            },
          },
          "400": {
            description: "Missing or invalid refresh token",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  missing: {
                    value: {
                      message: "Refresh token missing in cookies",
                    },
                  },
                  invalid: { value: { message: "Invalid refresh token" } },
                },
              },
            },
          },
        },
        "x-codeSamples": [
          {
            lang: "bash",
            source:
              "curl -i -X POST 'http://localhost:3000/api/v1/auth/refresh' --cookie 'refreshToken=<refresh_token>'",
          },
        ],
      },
    },
  },
  components: {
    schemas: {
      User: {
        type: "object",
        required: [
          "userId",
          "username",
          "email",
          "isVerified",
          "timezone",
          "locale",
          "createdAt",
          "updatedAt",
        ],
        properties: {
          userId: { type: "string", example: "67d77c3f6b635198f699e95e" },
          username: { type: "string", example: "janedoe01" },
          email: { type: "string", format: "email", example: "jane@example.com" },
          isVerified: { type: "boolean", example: true },
          timezone: { type: "string", example: "Asia/Kolkata" },
          locale: { type: "string", example: "en-IN" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      SignupRequest: {
        type: "object",
        required: ["username", "email", "passwordHash", "timezone", "locale"],
        properties: {
          username: { type: "string", minLength: 8, maxLength: 64 },
          email: { type: "string", format: "email" },
          passwordHash: { type: "string", minLength: 1 },
          timezone: { type: "string" },
          locale: { type: "string" },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string" },
        },
      },
      MessageResponse: {
        type: "object",
        required: ["message"],
        properties: {
          message: { type: "string" },
        },
      },
      ErrorResponse: {
        type: "object",
        required: ["message"],
        properties: {
          message: { type: "string" },
        },
      },
      SignupResponse: {
        allOf: [
          { $ref: "#/components/schemas/MessageResponse" },
          {
            type: "object",
            required: ["user"],
            properties: {
              user: { $ref: "#/components/schemas/User" },
            },
          },
        ],
      },
      VerifyResponse: {
        allOf: [
          { $ref: "#/components/schemas/MessageResponse" },
          {
            type: "object",
            required: ["user"],
            properties: {
              user: { $ref: "#/components/schemas/User" },
            },
          },
        ],
      },
    },
  },
} as const;
