import Document from "../models/Document.js";

export const uploadId = async (req, res) => {
  try {
    const files = req.files || [];
    const frontFile = files.find(f => f.fieldname === "front");
    const backFile = files.find(f => f.fieldname === "back");

    if (!frontFile || !backFile) {
      return res.status(400).json({ message: "Both front and back images are required." });
    }

    const frontPath = "/uploads/ids/" + frontFile.filename;
    const backPath  = "/uploads/ids/" + backFile.filename;

    const doc = await Document.findOneAndUpdate(
      { user: req.user._id },
      { user: req.user._id, front: frontPath, back: backPath },
      { upsert: true, new: true }
    );

    res.json({ message: "Documents uploaded successfully.", document: doc });
  } catch (error) {
    res.status(500).json({ message: error.message || "Upload failed." });
  }
};

export const getMyDocuments = async (req, res) => {
  try {
    const doc = await Document.findOne({ user: req.user._id });
    if (!doc) return res.json({ front: null, back: null });
    res.json({ front: doc.front, back: doc.back });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch documents." });
  }
};
