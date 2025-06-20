import api from '../lib/api';
import { toast } from 'react-hot-toast';

export const useStreakRecovery = () => {
  const recoverStreakWithXP = async () => {
    try {
      await api.post('/user/recover-streak', { method: 'xp' });
      toast.success('Streak recovered using XP!');
    } catch (err) {
      toast.error('Failed to recover streak');
    }
  };

  const recoverStreakBySharing = async () => {
    try {
      // Trigger share intent or generate referral
      await api.post('/user/recover-streak', { method: 'share' });
      toast.success('Streak recovered by sharing!');
    } catch (err) {
      toast.error('Failed to recover streak');
    }
  };

  return { recoverStreakWithXP, recoverStreakBySharing };
};
