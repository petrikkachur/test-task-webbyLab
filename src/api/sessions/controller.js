import jwt from 'jsonwebtoken';
import models from '../../database/models';
import { JWT_EXPIRES_IN, JWT_TOKEN_SECRET } from '../../utils/consts';
import { checkPassword } from '../../utils/helpers';

export default {
  async userSingIn(req, res) {
    const { body } = req.valid;

    const user = await models.Users.scope('withProtectInfo').findOne({
      where: {
        email: body.email,
      },
    });
    if (!user) return res.status(404, 'User not found');

    const confirmPassword = await checkPassword(body.password, user.password);
    if (!confirmPassword) return res.status(404).send('Password isn`t correct');

    const token = jwt.sign(
      {
        id: user.id,
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
