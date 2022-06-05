import jwt from 'jsonwebtoken';
import models from '../database/models';
import { JWT_TOKEN_SECRET } from '../utils/consts';

export const jwtVerifyAsync = (token) => new Promise((resolve) => {
  jwt.verify(token, JWT_TOKEN_SECRET, (err, decoded) => resolve({ err, decoded }));
});

export async function isAuth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(400).send('You have not "Authorization" header');
  }

  const { err, decoded } = await jwtVerifyAsync(token);
  if (err) return res.status(401).send(err);

  const user = await models.Users.findOne({
    where: {
      id: decoded.id,
    },
    raw: true,
  });
  if (!user) return res.status(401).send('User has not been found!');

  req.auth = {
    ...user,
  };
  return await next();
}

export async function isNotAuth(req, res, next) {
  if (req.headers.authorization) {
    return res.status(400).send('You have already "Authorization" header');
  }
  return await next();
}
