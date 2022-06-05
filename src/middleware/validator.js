export default (schema, type) => (req, res, next) => {
  if (req.valid === undefined) req.valid = {};
  let data;

  switch (type) {
    case 'body': {
      data = req.body;
      break;
    }
    case 'query': {
      data = req.query;
      break;
    }
    case 'params': {
      data = req.params;
      break;
    }

    default: {
      if (typeof type === 'function') {
        data = type(req, res);
      } else throw new Error('No find type');
    }
  }

  const valid = schema.validate(data);
  if (valid.error) {
    res.status(400);

    return res.send({
      message: `Validation error.${valid.error.details.reduce(
        (acc, curr) => `${acc} ${curr.message}`,
        '',
      )}`,
      error: valid.error.details.map((detail) => {
        const returnedError = { ...detail };
        delete returnedError.context;
        return returnedError;
      }),
    });
  }

  req.valid[typeof type === 'function' ? 'body' : type] = valid.value;

  return next();
};
