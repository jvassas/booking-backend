import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import providerModel from "../model/providerModel.js";

const providerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const provider = await providerModel.findOne({ email });

    if (!provider) {
      return res.json({ success: false });
    }

    const pwMatch = await bcrypt.compare(password, provider.password);

    if (pwMatch) {
      const token = jwt.sign({ id: provider._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
};

const changeAvailability = async (req, res) => {
  try {
    const { providerId } = req.body;

    const providerData = await providerModel.findById(providerId);
    await providerModel.findByIdAndUpdate(providerId, {
      available: !providerData.available,
    });
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
};

const providerList = async (res) => {
  try {
    const providers = await providerModel
      .find({})
      .select(["-password", "-email"]);
    res.json({ success: true, providers });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
};

export { providerLogin, changeAvailability, providerList };
