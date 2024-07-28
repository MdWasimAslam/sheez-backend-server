// routes/users.js

const express = require('express');

const db = require('../Database/db.js');

const router = express.Router();


// Register a new user
router.post('/locationUpdate', async (req, res) => {
    console.log(req.body, 'req.body');
    const { latitude, longitude, userId, coupleId } = req.body;

    const checkUsrExistsQry = `
      SELECT * FROM user_location WHERE user_id = ?
    `;

    db.query(checkUsrExistsQry, [userId], (err, results) => {
       

        if (results?.length === 0) {
            const sql = `
        INSERT INTO user_location (user_Id, location,coupleId)
        VALUES (?, ?, ?)
      `;

            db.query(sql, [userId, latitude+","+latitude , coupleId], (err, result) => {
                if (err) {
                    console.log(err)
                    return res.status(201).send('Error updating location');
                }
                res.status(200).send('Location updated successfully');
            });

        }




        else {
            const sql = `
        UPDATE user_location SET location = ? WHERE user_id = ?
        `;

            db.query(sql, [latitude + ',' + longitude, userId], (err, result) => {
                if (err) {
                    return res.status(201).send('Error updating location');
                }
                res.status(200).send('Location updated successfully');
            });
        }







    });

});



module.exports = router;
