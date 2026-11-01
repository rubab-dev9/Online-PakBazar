const User = require('../models/user');

const updateProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      address,
      city,
      postalCode
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.name = name || user.name;
    user.phone = phone || '';
    user.address = address || '';
    user.city = city || '';
    user.postalCode = postalCode || '';

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

module.exports = {
    updateProfile
}