const User = require("../models/User.model");
const router = require("express").Router();
const bcryptjs = require("bcryptjs")

// Register routes
router.get('/register', async (req, res) => {
    try {
        res.render('auth/register')
    }
    catch(err) {
        console.log(err)
    }
});

router.post('/register', async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username})
        if(user){
            res.render('auth/register', {error: "This username is already taken."})
        } else if(await User.findOne({email: req.body.email})) {
            res.render('auth/register', {error: "There is already a account with this E-Mail registered."})
        } else {
            const salt = bcryptjs.genSaltSync(12);
            const encryptPassword = bcryptjs.hashSync(req.body.password, salt)
            const newUser = await User.create({
                ...req.body,
                password: encryptPassword
            })
            res.redirect('/')
        }
    }
    catch(err) {
        console.log(err)
    }
});


// Login routes 

router.get('/login', async (req, res) => {
    try {
        res.render('auth/login')
    }
    catch(err) {
        console.log(err)
    }
});

router.post('/login', async (req, res) => {
    try {
        console.log(req.body)
        const user = await User.findOne({email: req.body.email})
        if(user){
            const checkPassword = await bcryptjs.compareSync(
                req.body.password,
                user.password
            );
            if(checkPassword){
                res.render('auth/login', {error: `Welcome ${user.username}!`})
            } else {
                res.render('auth/login', {error: "E-Mail or Password is wrong."})
            }
        } else {
            res.render('auth/login', {error: "E-Mail or Password is wrong."})
        }
    }
    catch(err) {
        console.log(err)
    }
});



module.exports = router;