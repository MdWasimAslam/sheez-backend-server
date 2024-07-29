const express = require('express');
const router = express.Router();
const pool = require('../Database/db.js'); // Ensure this exports a PostgreSQL pool instance
const axios = require('axios');



// Register or update user location
router.post('/update', async (req, res) => {
    const { latitude, longitude, user_Id, coupleId } = req.body;

    try {
        // Check if the user already exists
        const checkUsrExistsQry = `
          SELECT * FROM usersLocation WHERE user_Id = $1
        `;
        const { rows } = await pool.query(checkUsrExistsQry, [user_Id]);

        if (rows.length === 0) {

            // -------- Insert new user data -----------

            const getCurrDateTime = await axios.get('https://worldtimeapi.org/api/Asia/Kolkata');

            // Insert new location
            const sql = `
              INSERT INTO usersLocation (user_Id, latitude, longitude, coupleId, updatedat)
              VALUES ($1, $2, $3, $4, $5)
            `;
            await pool.query(sql, [user_Id, latitude, longitude, coupleId, getCurrDateTime.data.datetime]);
            res.status(200).send('Location added successfully');
        } else {
            // -------- Update existing user data -----------
            const getCurrDateTime = await axios.get('https://worldtimeapi.org/api/Asia/Kolkata');

            const sql = `
              UPDATE usersLocation
              SET latitude = $1, longitude = $2, coupleId = $3, updatedat = $5
              WHERE user_Id = $4
            `;
            await pool.query(sql, [latitude, longitude, coupleId, user_Id, getCurrDateTime.data.datetime]);

            const sql2 = `
            SELECT l1.latitude AS latitude_1, l1.longitude AS longitude_1,
            l2.latitude AS latitude_2, l2.longitude AS longitude_2
            FROM userslocation l1
            JOIN userslocation l2
            ON l1.coupleid = l2.coupleid
            WHERE l1.user_id <> l2.user_id
            LIMIT 1;
            `;

            

            const { rows } = await pool.query(sql2);
            console.log(rows);


            //https://api.olamaps.io/routing/v1/directions?origin=22.54321104358877,88.35155530898258&destination=22.5575645,88.3563892&api_key=GRmKrxV0XBrYUWjlNlNucayw64Xseqon9LaoPB9t
            const sql3 = `https://api.olamaps.io/routing/v1/directions?origin=${rows[0].latitude_1},${rows[0].longitude_1}&destination=${rows[0].latitude_2},${rows[0].longitude_2}&api_key=GRmKrxV0XBrYUWjlNlNucayw64Xseqon9LaoPB9t`;
            const { data } = await axios.post(sql3);
            console.log('---------------------------------')
            console.log(data.routes[0].legs[0].readable_distance);



            res.status(200).send({
                message: 'Location updated successfully',
                distance: data.routes[0].legs[0].readable_distance
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating location');
    }
});

module.exports = router;
