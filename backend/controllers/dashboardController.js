const admin = require('../../firebase'); 
const db = admin.firestore();

const allowedBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const allowedUrgencyLevels = ['Emergency', 'Urgent', 'Scheduled'];

exports.requestBlood = async (req, res) => {
  try {
    const {
      patientName,
  hospitalName,
      bloodType,
      unitsNeeded,
      urgencyLevel,
      deliveryLocation,
      additionalInfo
    } = req.body;

      if (!patientName || !hospitalName || !bloodType || !unitsNeeded || !urgencyLevel || !deliveryLocation) {
      return res.status(400).json({ message: "Missing required fields" });
    }
     if (!allowedBloodTypes.includes(bloodType)) {
      return res.status(400).json({ message: "Invalid blood type" });
    }

      if (!allowedUrgencyLevels.includes(urgencyLevel)) {
      return res.status(400).json({ message: "Invalid urgency level" });
    }
      console.log("Received blood request:", req.body);

 const requestData = {
      patientName,
      hospitalName,
      bloodType,
      unitsNeeded,
      urgencyLevel,
      deliveryLocation,
      additionalInfo: additionalInfo || "",
     
    };

   
    const docRef = await db.collection('bloodRequests').add(requestData);
       
    res.status(200).json({
      success: true,
      message: "Blood request submitted successfully",
      requestId: docRef.id
    });

      } catch (error) {
    console.error("Error handling blood request:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  
  }
}


