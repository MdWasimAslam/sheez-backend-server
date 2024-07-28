const express = require('express');
const db = require('../Database/db.js');
const router = express.Router();
const axios = require('axios');

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
        INSERT INTO user_location (user_Id, location, coupleId)
        VALUES (?, ?, ?)
      `;

            db.query(sql, [userId, `${latitude},${longitude}`, coupleId], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send('Error updating location');
                }
                res.status(200).send('Location updated successfully');
            });
        } else {
            const sql = `
        UPDATE user_location SET location = ? WHERE user_id = ?
        `;

            db.query(sql, [`${latitude},${longitude}`, userId], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send('Error updating location');
                }
                res.status(200).send('Location updated successfully');
            });
        }
    });
});

router.post('/distance', async (req, res) => {
    console.log(req.body, 'req.body');
    const { coupleId } = req.body;

    const sql = `
      SELECT * FROM user_location WHERE coupleId = ?
    `;

    db.query(sql, [coupleId], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error fetching locations');
        }

        if (results.length < 2) {
            return res.status(404).send('Not enough locations found for routing');
        }

        const startingPoint = results[0].location;
        const destination = results[1].location;
        const mapUrl = `https://api.olamaps.io/routing/v1/directions?origin=${startingPoint}&destination=${destination}&api_key=GRmKrxV0XBrYUWjlNlNucayw64Xseqon9LaoPB9t`;

        axios.post(mapUrl)
            .then((response) => {
                console.log(response.data);
                res.status(200).json({
                    readableDistance: response.data.routes[0].legs[0].readable_distance,
                });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).send('Error fetching directions');
            });
    });
});

module.exports = router;
