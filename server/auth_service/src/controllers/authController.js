import User from '../models/user';
import { generateTokenAndSetCookie } from '../middleware/authMiddleware';
import {
  connectMQTT,
  publish,
  subscribe,
  disconnectMQTT,
} from '../../../mqtt/mqtt';

const registerUserMQTT = async (
  message,
  client,
  responseTopicForRegisteringANewUser
) => {
  try {
    const { email, password } = JSON.parse(message);

    const userExists = await User.findOne({ email });
    if (userExists) {
      client.publish(
        responseTopicForRegisteringANewUser,
        JSON.stringify({ success: false, message: 'User already exists' })
      );
      return;
    }

    const newUser = new User({ email, password });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    client.publish(
      responseTopicForRegisteringANewUser,
      JSON.stringify({
        success: true,
        message: 'User registered successfully',
        token,
      })
    );
  } catch (error) {
    console.error('Error registering user:', error);
    client.publish(
      responseTopicForRegisteringANewUser,
      JSON.stringify({ success: false, message: 'Error registering user' })
    );
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateTokenAndSetCookie(res, user);

    res.json({
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error logging User' });
  }
};

module.exports = { registerUserMQTT };
