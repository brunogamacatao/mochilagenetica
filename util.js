const range = (min, max) => {
  let delta = max - min;
  return Math.floor(Math.random() * delta + min);
};

module.exports = {
  range
};
