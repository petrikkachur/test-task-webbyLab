import jwt from 'jsonwebtoken';
import models from '../../database/models';
import { JWT_EXPIRES_IN, JWT_TOKEN_SECRET } from '../../utils/consts';
import { hashPassword } from '../../utils/helpers';

export default {
  async userSingUp(req, res) {
    const { body } = req.valid;

    const user = await models.Users.findOne({
      where: {
        email: body.email,
      },
    });
    if (user) { return res.status(409).send('User email already exists in the system.'); }

    const hash = await hashPassword(body.password);

    const createdUser = await models.Users.create({
      name: body.name,
      email: body.email,
      password: hash,
    });

    const token = jwt.sign(
      {
        id: createdUser.id,
      },
      JWT_TOKEN_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      },
    );

    return res.send({
      token,
      status: 1,
    });
  },
};
