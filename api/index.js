const express = require('express');
const bodyParser = require('body-parser');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const app = express();
const port = process.env.PORT || 3001;

// Initialize Firebase Admin SDK
const serviceAccount = require('D:/code/nextjs/Restaurant-Table-Booking-System/restaurant-table-booking-7fe4e-firebase-adminsdk-zhnhs-2ef5677812.json');
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

app.use(bodyParser.json());

app.post('/api/bookings', async (req, res) => {
  try {
    const { restaurantId, date, time, guests, name, email, phone } = req.body;

    // Validate input (you may want to add more thorough validation)
    if (!restaurantId || !date || !time || !guests || !name || !email || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create a new booking document
    const bookingRef = await db.collection('bookings').add({
      restaurantId,
      date,
      time,
      guests,
      name,
      email,
      phone,
      createdAt: new Date()
    });

    res.status(201).json({ id: bookingRef.id, message: 'Booking created successfully' });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

