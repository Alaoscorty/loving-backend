import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { createBooking, getUserBookings, getBookingById } from '../controllers/booking.controller';

const router = express.Router();
router.use(authenticate);

router.get('/user', getUserBookings);
router.post('/', createBooking);
router.get('/:id', getBookingById);

export default router;
