const express = require('express');
const Event = require('../models/event');
const router = express.Router();
const authmiddleware = require('../middleware/authmiddleware');
const supermiddleware = require('../middleware/supermiddleware');
const adminmiddleware = require('../middleware/supermiddleware');
const User = require('../models/user');
//1- As a super admin, I can create an event//
router.post('/', [authmiddleware, supermiddleware], async (req, res) => {
    try {
        const newEvent = new Event({
            name: req.body.name
            , date: new Date(req.body.date)
            , user: [req.body.user]
        });
        const result = await newEvent.save();
        if (result) {
            res.send(result);
        } else {
            res.status(404).send({ message: 'no data saved' })
        }

    } catch (error) {
        res.status(400).send(error.message)
    }
});
/* 2. As a super admin, I can edit an existing event
5. As a super admin / admin, I can assign a given user to a given event
 */
router.put('/:id', [authmiddleware, supermiddleware], async (req, res) => {
    try {
        const selectedEvent = await Event.findById(req.params.id)
        if (selectedEvent) {
            selectedEvent.user.unshift(req.body.user); // //
            selectedEvent.name = req.body.name;
            selectedEvent.date = req.body.date;
            const updatedEvent = await selectedEvent.save();
            res.send(updatedEvent);
        } else {
            res.status(404).send({ message: 'no Event found' });

        }
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
})

//3. As a super admin / admin, I can retrieve all upcoming events //
router.get('/up', [authmiddleware, adminmiddleware || supermiddleware], async (req, res) => {
    try {
        const event = await Event.find({ date: { $gte: Date.now() } }).populate('user', '-_id name')
        if (event) {
            res.send(event);
        } else {
            res.status(404).send('no Events found ');
        }
    } catch (error) {
        res.status(400).send({ message: 'Error' + error.message })
    }
})
//4. As a super admin / admin, I can retrieve all past events//

router.get('/down', [authmiddleware, adminmiddleware, supermiddleware], async (req, res) => {
    try {
        const event = await Event.find({ date: { $lte: Date.now() } }).populate('user', '-_id name')
        if (event) {
            res.send(event);
        } else {
            res.status(404).send('no Events found ');
        }
    } catch (error) {
        res.status(400).send({ message: 'Error' + error.message })
    }
});
//8. As a user, I can view all my events // 

router.get('/myevents', authmiddleware, async (req, res) => {
    const id = req.user._id

    try {
        const event = await Event.find({ user: id }).populate('user', '-_id name').select('-_id name');
        res.send(event)

    } catch (error) {
        res.status(400).send({ message: 'Error' + error.message })
    }
});


//9. As a user, I can view all upcoming events //
router.get('/upusers', authmiddleware, async (req, res) => {
    const id = req.user._id
    try {
        const event = await Event.find({ user: id, date: { $gte: Date.now() } }).populate('user', '-_id name')
            .select('-_id name date')
        if (event) {
            res.send(event);
        } else {
            res.status(404).send('no Events found ');
        }
    } catch (error) {
        res.status(400).send({ message: 'Error' + error.message })
    }
});
//10. As a user, I can view all my past events //
router.get('/downusers', authmiddleware, async (req, res) => {
    const id = req.user._id
    console.log(req.user._id)
    try {
        const event = await Event.find({ user: id, date: { $lte: Date.now() } }).populate('user', '-_id name')
            .select('-_id name date')
        if (event) {
            res.send(event);
        } else {
            res.status(404).send('no Events found ');
        }
    } catch (error) {
        res.status(400).send({ message: 'Error' + error.message })
    }
});




//7. As a super admin / admin, I can view all users in a given event //
router.get('/:id', [authmiddleware, adminmiddleware, supermiddleware], async (req, res) => {
    try {
        const event = await Event.findOne({ _id: req.params.id }).populate('user', '-_id name').select('-_id name')
        res.send(event)

    } catch (error) {
        res.status(400).send({ message: 'Error' + error.message })
    }
});
// 6. As a super admin / admin, I can view all events of a given user//

router.get('/all/:user', [authmiddleware, adminmiddleware, supermiddleware], async (req, res) => {
    try {
        const event = await Event.find({ user: req.params.user }).populate('user', '-_id name').select('-_id name')
        console.log(event.user)
        res.send(event)

    } catch (error) {
        res.status(400).send({ message: 'Error' + error.message })
    }
});


module.exports = router;