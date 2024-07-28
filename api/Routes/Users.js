var router = require('express').Router();

router.get('/', function(req, res) {
    res.send(
        [
            { id: 1, name: 'John Doe' },
            { id: 2, name: 'Jane Doe' },
            { id: 3, name: 'Jim Doe' }
            
        ]
    );
});

router.get('/list', function(req, res) {
    res.send('Users List Page');
});

module.exports = router;