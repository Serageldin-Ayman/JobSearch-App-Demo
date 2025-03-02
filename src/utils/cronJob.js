import cron from 'node-cron';
import userModel from '../../models/user.model.js';

cron.schedule('0 */6 * * *', async () => {
    try {
        await userModel.updateMany(
            {},
            { $pull: { OTP: { expiresIn: { $lt: Date.now() } } } }
        );
        console.log('Expired OTPs deleted');
    } catch (error) {
        console.error('Error deleting expired OTPs:', error);
    }
});