import bcrypt from "bcrypt";
import providerModel from "../model/providerModel.js";

// Create Provider API
const addProvider = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Basic data validations
    if (!firstName || !lastName || !email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    // Hash provider pw
    const salt = await bcrypt.genSalt(10);
    const hashedPw = await bcrypt.hash(password, salt);

    const providerData = {
      firstName,
      lastName,
      email,
      password: hashedPw,
      date: Date.now(),
    };

    const newProvider = new providerModel(providerData);
    await newProvider.save();
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
};

// Get Providers API
const getProviders = async (req, res) => {
  try {
    const providers = await providerModel
      .find({})
      .select(["-password", "-email"]); // Exclude password and email fields

    // Add the _id field to the response as providerId
    const formattedProviders = providers.map((provider) => ({
      ...provider.toObject(),
      providerId: provider._id.toString(), // Ensure the _id is included as providerId
    }));

    res.json({ success: true, providers: formattedProviders });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
};

export { addProvider, getProviders };
