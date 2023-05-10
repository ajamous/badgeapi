// Importing required dependencies
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const fs = require('fs');



// Create an instance of Express
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Creating a new instance of Sequelize for SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

// Define a Visitor model with Sequelize
const Visitor = sequelize.define('visitor', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  company: {
    type: Sequelize.STRING,
    allowNull: false
  },
  qrcode: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
});

// Endpoint to register a new visitor
app.post('/register', async (req, res) => {
    const { name, phone, email, company } = req.body;
  
    try {
      // Create a new visitor record in the database
      const visitor = await Visitor.create({ name, phone, email, company });

      // Record the date and time when the visitor's ticket is registered
    const now = new Date();
    visitor.createdAt = now;
    await visitor.save();
  

      // Create vCard
      
      const vCard = `BEGIN:VCARD
                    VERSION:3.0
                    N:${visitor.name}
                    TEL:${visitor.phone}
                    EMAIL:${visitor.email}
                    ORG:${visitor.company}
                    ADR:;;;;
                    END:VCARD`;
      
      // Generate a QR code for the visitor
      const qrData = JSON.stringify({
        id: visitor.id,
        vcard: vCard,
        ticketId: `TICKET-${visitor.id}`
      });
      
     
  
      // Convert the QR code data to a data URL
      const qrCodeDataURL = await QRCode.toDataURL(qrData);
  
      // Update the visitor record with the QR code data URL
      visitor.qrcode = qrCodeDataURL;
      await visitor.save();
  
      // Create an HTML file with the visitor ticket information
      const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Visitor Ticket</title>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">


        </head>
        <body>
   

          <div class="container mt-5">
           
            <div class="card">
              <div class="card-header">
                Ticket ID: ${visitor.id}
              </div>
              <div class="card-body">
                <h1 class="card-title">${visitor.name}</h1>
                <h3 class="card-title">VISITOR</h3>
                <p class="card-text">Phone: ${visitor.phone}</p>
                <p class="card-text">Email: ${visitor.email}</p>
                <p class="card-text">Company: ${visitor.company}</p>
                <p class="card-text">Registered at: ${now}</p>
                <img class="card-img-top" src="${visitor.qrcode}" alt="QR Code">
              </div>
            </div>
          </div>
          <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
          <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
        </body>
      </html>
    `;
    
      const filename = `ticket_${visitor.id}.html`;
      fs.writeFileSync(filename, html);
  
      // Return a success response with the visitor ticket information
      res.json({
        success: true,
        ticket: {
          id: visitor.id,
          name: visitor.name,
          phone: visitor.phone,
          email: visitor.email,
          company: visitor.company,
          registeredAt: now,
          qrcodeDataURL: visitor.qrcode
        }
      });
    } catch (error) {
      // Return an error response if there was an error creating the visitor record or generating the QR code
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Verify ticket route


  app.get('/verify/:ticketId', async (req, res) => {
    const ticketId = req.params.ticketId;
    res.set('Access-Control-Allow-Origin', '*'); // set the CORS header
  
    try {
      const visitor = await Visitor.findOne({ where: { id: ticketId } });
  
      if (!visitor) {
        res.status(404).json({ success: false, message: 'Ticket not found' });
      } else {
        res.json({
          success: true,
          ticket: {
            id: visitor.id,
            name: visitor.name,
            phone: visitor.phone,
            email: visitor.email,
            company: visitor.company,
            registeredAt: visitor.createdAt,
            Status: "PASS"
          }
        });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
  

// Function to setup the database and start the server
const setupDatabase = async () => {
  // Sync the Sequelize models with the database and start the server
  await sequelize.sync({ alter: true });
  app.listen(3000, () => console.log('Conference API is running on port 3000'));
};



// Call the setupDatabase function to start the server
setupDatabase();
