const jwt = require("jsonwebtoken");

const expiresIn = "1h";

exports.handler = async (event, context) => {
  // Assuming that you are sending a POST request with a JSON payload containing the user ID
  const { user_id, currentTime } = JSON.parse(event.body);

  // Generate a JWT with a secret key and an expiration time
  const token = jwt.sign({ sub: user_id }, process.env.JWT_SECRET_KEY, {
    expiresIn: expiresIn,
  });

  const now = new Date(currentTime).toISOString();
  const availableUtil = new Date(now); // Create new date object from UTC string
  availableUtil.setMinutes(availableUtil.getMinutes() + 50); // Add 50 minutes

  return {
    statusCode: 200,
    body: JSON.stringify({ token, availableUtil }),
  };
};
