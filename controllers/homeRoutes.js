const router = require('express').Router();
const { BlogPost, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
    try {
      // Get all blog posts and JOIN with user data
      const blogpostData = await BlogPost.findAll({
        include: [
          {
            model: User,
            attributes: ['name'],
          },
        ],
      });
      
    // Serialize data so the template can read it
    const blogpost = blogpostData.map((blogpost) => blogpost.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      blogpost, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/blogpost/:id', async (req, res) => {
    try {
      const blogpostData = await BlogPost.findByPk(req.params.id, {
        include: [
          {
            model: User,
            attributes: ['name'],
          },
        ],
      });
      
    const blogpost = blogpostData.get({ plain: true });

    res.render('blogpost', {
      ...blogpost,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
    try {
      // Find the logged in user based on the session ID
      const userData = await User.findByPk(req.session.user_id, {
        attributes: { exclude: ['password'] },
        include: [{ model: BlogPost }],
      });
  
      const user = userData.get({ plain: true });
      console.log(user);
  
      res.render('profile', {
        ...user,
        logged_in: true
      });
    } catch (err) {
      res.status(500).json(err);
    }

    // try {
    //   // Get all blog posts and JOIN with user data
    //   const blogpostData = await BlogPost.findAll({
    //     where: {
    //       user_id: req.session.user_id
    //     },
    //     include: [
    //       {
    //         model: User,
    //         attributes: ['name'],
    //       },
    //     ],
    //   });
      
  //   // Serialize data so the template can read it
  //   const blogpost = blogpostData.map((blogpost) => blogpost.get({ plain: true }));

  //   // Pass serialized data and session flag into template
  //   res.render('profile', { 
  //     blogpost, 
  //     logged_in: req.session.logged_in 
  //   });
  // } catch (err) {
  //   res.status(500).json(err);
  // }
  
  });

  
router.get('/login', (req, res) => {
    // If the user is already logged in, redirect the request to another route
    if (req.session.logged_in) {
      res.redirect('/profile');
      return;
    }
  
    res.render('login');
  });
  
  module.exports = router;
  