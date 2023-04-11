const { createPool } = require("./connectDB.js");
const { verifyToken } = require("./verifyJWT.js");
const { decrypt, encrypt } = require("./crypto.js");

async function templatedQuery(event, queryString, encryptedVariable) {
  const authHeader = event.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  const user_id = verifyToken(token);

  const pool = await createPool(user_id);

  const connection = await pool.getConnection();

  try {
    let variable = [];
    if (encryptedVariable) {
      encryptedVariable.forEach((v) => {
        if (v.includes("_")) {
          variable.push(decrypt(v));
        } else {
          variable.push(v);
        }
      });
    }

    // Use the connection to execute queries
    const results = await connection.query(queryString, variable);

    return {
      statusCode: 200,
      data: results,
    };
  } catch (error) {
    if (error instanceof RangeError) {
      return {
        statusCode: 421,
        data: "Corrupted Data",
      };
    } else {
      return {
        statusCode: 500,
        data: "Internal server error",
      };
    }
  } finally {
    // Release the connection back to the pool
    connection.release();
  }
}

function templateSend(
  response,
  variableTagThatNeedEncrypt,
  getReturnFromRespose = stripMetaData
) {
  let { statusCode, data } = response;

  if (statusCode === 200) {
    data = getReturnFromRespose(data);

    if (variableTagThatNeedEncrypt) {
      if (!Array.isArray(data)) {
        variableTagThatNeedEncrypt.forEach((tag) => {
          if (data[tag]) {
            data[tag] = encrypt(data[tag]);
          }
        });
      } else {
        data.forEach((record) => {
          variableTagThatNeedEncrypt.forEach((tag) => {
            if (record[tag]) {
              record[tag] = encrypt(record[tag]);
            }
          });
        });
      }
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
  } else {
    return {
      statusCode: statusCode,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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
