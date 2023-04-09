const { createPool } = require("./connectDB.js");
const { verifyToken } = require("./verifyJWT.js");

async function templatedQuery(event, queryString, variable) {
  const authHeader = event.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  const user_id = verifyToken(token);

  const pool = await createPool(user_id);

  const connection = await pool.getConnection();

  try {
    // Use the connection to execute queries
    const results = await connection.query(queryString, variable);
    return {
      statusCode: 200,
      data: results,
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      data: "Internal Server Error",
    };
  } finally {
    // Release the connection back to the pool
    connection.release();
  }
}

function templateSend(response, getReturnFromRespose) {
  const { statusCode, data } = response;

  if (!getReturnFromRespose) {
    getReturnFromRespose = stripMetaData;
  }

  if (statusCode === 200) {
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(getReturnFromRespose(data)),
    };
  } else {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    };
  }
}

function stripMetaData(response) {
  return response[0];
}

function stripMetaDataAndToJson(response) {
  const cleanedData = stripMetaData(response);
  return cleanedData[0];
}

module.exports = {
  templatedQuery,
  templateSend,
  stripMetaData,
  stripMetaDataAndToJson,
};
