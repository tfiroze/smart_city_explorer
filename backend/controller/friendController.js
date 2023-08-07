const createSSHTunnel = require('../db');

// 1. API to check if an email exists and retrieve its user_id
exports.checkEmail = (req, res) => {
  const { email } = req.body;

  createSSHTunnel(async (connection) => {
    try {
      const [rows] = await connection.execute('SELECT * FROM user_info WHERE email = ?', [email]);
      if (rows.length > 0) {
        res.status(200).json({ message: 'Email exists.', user_id: rows[0].user_id });
      } else {
        res.status(404).json({ message: 'Email not found.' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'There was an error.', error: error.message });
    } finally {
      connection.end();
    }
  });
};

// 2. API to send an invite
exports.sendInvite = (req, res) => {
  const { user_id, trip_id, trip_owner_id } = req.body;

  createSSHTunnel(async (connection) => {
    try {
      const [rows] = await connection.execute('SELECT * FROM trip_requests WHERE requested_user_id = ? AND trip_id = ?', [user_id, trip_id]);
      if (rows.length > 0) {
        res.status(400).json({ message: 'Request already sent.' });
      } else {
        await connection.execute('INSERT INTO trip_requests (trip_id, trip_owner_id, requested_user_id, confirmation_status) VALUES (?, ?, ?, ?)', [trip_id, trip_owner_id, user_id, 'awaiting']);
        res.status(200).json({ message: 'Invite sent.' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'There was an error.', error: error.message });
    } finally {
      connection.end();
    }
  });
};


exports.checkRequests = (req, res) => {
  const { user_id } = req.body;

  createSSHTunnel(async (connection) => {
    try {
      const [rows] = await connection.execute('SELECT * FROM trip_requests WHERE requested_user_id = ? AND confirmation_status = ?', [user_id, 'awaiting']);

      if (rows.length > 0) {
        res.status(200).json({ message: 'Trip requests found.', requests: rows });
      } else {
        res.status(404).json({ message: 'No trip requests found.' });
      }
    } catch (selectError) {
      console.error('Error executing SELECT query:', selectError);
      res.status(500).json({ message: 'There was an error fetching the trip requests.', error: selectError.message });
    } finally {
      connection.end();
    }
  });
};
// 3. API to accept an invite
exports.acceptInvite = (req, res) => {
  const { trip_id, user_id } = req.body;

  createSSHTunnel(async (connection) => {
    try {
      await connection.execute('UPDATE trip_requests SET confirmation_status = ? WHERE trip_id = ? AND requested_user_id = ?', ['accepted', trip_id, user_id]);

      // Fetch current trip participants
      const [tripInfo] = await connection.execute('SELECT trip_part_1, trip_part_2, trip_part_3, trip_part_4 FROM trip_info WHERE trip_id = ?', [trip_id]);

      if (tripInfo.length === 0) {
        return res.status(404).json({ message: 'Trip not found.' });
      }

      const tripData = tripInfo[0];
      let columnToUpdate;

      if (!tripData.trip_part_1) {
        columnToUpdate = 'trip_part_1';
      } else if (!tripData.trip_part_2) {
        columnToUpdate = 'trip_part_2';
      } else if (!tripData.trip_part_3) {
        columnToUpdate = 'trip_part_3';
      } else if (!tripData.trip_part_4) {
        columnToUpdate = 'trip_part_4';
      }

      if (columnToUpdate) {
        await connection.execute(`UPDATE trip_info SET ${columnToUpdate} = ? WHERE trip_id = ?`, [user_id, trip_id]);
        res.status(200).json({ message: 'Invite accepted and user added as a trip participant.' });
      } else {
        res.status(400).json({ message: 'All participant slots are full. Cannot accept invite.' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'There was an error.', error: error.message });
    } finally {
      connection.end();
    }
  });
};

// 4. API to decline an invite
exports.declineInvite = (req, res) => {
  const { trip_id, user_id } = req.body;

  createSSHTunnel(async (connection) => {
    try {
      await connection.execute('DELETE FROM trip_requests WHERE trip_id = ? AND requested_user_id = ?', [trip_id, user_id]);
      res.status(200).json({ message: 'Invite declined.' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'There was an error.', error: error.message });
    } finally {
      connection.end();
    }
  });
};
