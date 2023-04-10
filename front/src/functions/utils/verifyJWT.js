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
