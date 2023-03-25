function formatResults(results, properties) {
  return results.map((result) => {
    const newObj = {};
    properties.forEach((property) => {
      newObj[property] = result[property];
    });
    return newObj;
  });
}

module.exports = { formatResults };
