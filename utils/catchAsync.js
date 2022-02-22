//this replaces try catch block and catches error if any
module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};
