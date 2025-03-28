const express = require('express');
const router = express.Router();
const responseHandler = require('../../helpers/responseHandler');
const controllers = require('../controllers/paymentController');
const adminAuth = require('../../middleware/adminAuth');
const upload = require('../../utils/multerConfig')





router.get('/index', async (req, res) => {
    res.send('payment routes working properly ❤');
});


/* - payment routers - */
router.post('/login', responseHandler(controllers.login));
router.post('/amount-range', adminAuth, responseHandler(controllers.addAmountRange));
router.put('/update-amount-range',adminAuth, responseHandler(controllers.updateAmountRange));
router.get('/get-amount-range',adminAuth, responseHandler(controllers.getAmountRange));
router.delete('/delete-amount-range',adminAuth, responseHandler(controllers.deleteAmountRange));
router.post("/add-bank",adminAuth,  responseHandler(controllers.addBank));
router.put('/update-bank',adminAuth, responseHandler(controllers.updateBank));
router.get('/get-bank', responseHandler(controllers.getBanks));
router.delete('/delete-bank',adminAuth, responseHandler(controllers.deleteBank));
router.post('/user-payment',upload.single("screenshot"),  responseHandler(controllers.userPayment));
router.post("/add-upi",adminAuth,  responseHandler(controllers.addupi));
router.put('/update-upi',adminAuth, responseHandler(controllers.updateupi));
router.get('/get-upi', responseHandler(controllers.getupi));
router.delete('/delete-upi',adminAuth, responseHandler(controllers.deleteupi));
router.post("/add-qr",adminAuth, upload.single("qrImage"), responseHandler(controllers.addQr));
router.get("/get-qr",  responseHandler(controllers.getQr));
router.put('/update-qr',adminAuth, upload.single("qrImage"), responseHandler(controllers.updateQr));
router.delete('/delete-qr',adminAuth, responseHandler(controllers.deleteQr));
router.get('/get-payment', adminAuth,responseHandler(controllers.getPayment));
router.get('/get-user/:username',responseHandler(controllers.getUser));
















































// Export the router for use in the main application
module.exports = router;
