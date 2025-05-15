const admin = require("../../firebase");
const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

// Create a new donation event
// exports.createDonationEvent = async (req, res) => {
//   try {
//     const { eventName, eventDate, Location, description } = req.body;

//     // Basic validation
//     if (!eventName || !eventDate || !location || !organizer) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required: eventName, eventDate, location, organizer"
//       });
//     }

//     const newEvent = {
//       eventName,
//       eventDate,
//       eventLocation,
//       description,
//       createdAt: FieldValue.serverTimestamp(),
//       updatedAt: FieldValue.serverTimestamp(),
//     };

//     const eventRef = await db.collection("donationEvents").add(newEvent);
//     res.status(201).json({ id: eventRef.id, ...newEvent });
//   } catch (error) {
//     console.error("Error creating donation event:", error);
//     res.status(500).json({ error: "Failed to create donation event" });
//   }
// };
exports.createDonationEvent = async (req, res) => {
  try {
    const { eventName, eventDate, location, description } = req.body;

    if (!eventName || !eventDate || !location) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "eventName, eventDate, and location are required."
      });
    }

    const db = admin.firestore();
    const docRef = await db.collection("donationEvents").add({
      eventName,
      eventDate,
      location,
      description: description ?? "",  // 👈 prevent undefined
      createdAt: new Date()
    });

    res.status(201).json({
      status: 201,
      success: true,
      message: "Donation event created successfully",
      eventId: docRef.id
    });

  } catch (error) {
    console.error("Error creating donation event:", error.message);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};



// Fetch all donation events
exports.getAllDonationEvents = async (req, res) => {
  try {
    const snapshot = await db.collection("donationEvents").get();
    const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching donation events:", error);
    res.status(500).json({ error: "Failed to fetch donation events" });
  }
};

// Update an event
exports.updateDonationEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = {
      ...req.body,
      updatedAt: FieldValue.serverTimestamp(),
    };

    await db.collection("donationEvents").doc(id).update(updatedData);
    res.status(200).json({ message: "Donation event updated successfully" });
  } catch (error) {
    console.error("Error updating donation event:", error);
    res.status(500).json({ error: "Failed to update donation event" });
  }
};

// Delete an event
exports.deleteDonationEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("donationEvents").doc(id).delete();
    res.status(200).json({ message: "Donation event deleted successfully" });
  } catch (error) {
    console.error("Error deleting donation event:", error);
    res.status(500).json({ error: "Failed to delete donation event" });
  }
};
