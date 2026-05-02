const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });


router.post("/register", upload.single("image"), async (req, res) => {
  try {

    const imageUrl = req.file.path;

    //Mongo save
    const newUser = await User.create({
      ...req.body,
      profileImageUrl: imageUrl
    });

    res.json(newUser);
  } catch (err) {
    res.status(500).json({ error: "Upload failed" });
  }
});