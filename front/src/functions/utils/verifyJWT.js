const jwt = require("jsonwebtoken");

function verifyToken(token) {
  try {
    if (!token) {
      throw new Error("Unauthorized");
    }
    // Verify the JWT with the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Return the decoded JWT payload as the response body
    return decoded.sub;
  } catch (error) {
    return null;
  }
}

module.exports = { verifyToken };

// exports.handler = async (event, context) => {
//   try {
//     // Get the JWT from the Authorization header
//     const authHeader = event.headers.Authorization;
//     const token = authHeader && authHeader.split(" ")[1];

//     if (!token) {
//       return {
//         statusCode: 401,
//         body: JSON.stringify({ error: "Unauthorized" }),
//       };
//     }

//     // Verify the JWT with the secret key
//     const decoded = jwt.verify(token, JWT_SECRET_KEY);

//     // Return the decoded JWT payload as the response body
//     return {
//       statusCode: 200,
//       body: JSON.stringify(decoded),
//     };
//   } catch (error) {
//     return {
//       statusCode: 401,
//       body: JSON.stringify({ error: "Unauthorized" }),
//     };
//   }
// };
