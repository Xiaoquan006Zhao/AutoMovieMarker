function formatResults(results, properties) {
  return results.map((result) => {
    const newObj = {};
    properties.forEach((property) => {
      newObj[property] = result[property];
    });
    return newObj;
  });
}

function templateQuery(connection, query, variable, callback) {
  connection.query(query, variable, (error, results, fields) => {
    if (error) return callback(error);
    callback(null, results);
  });
}

module.exports = { formatResults, templateQuery };
