import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getPromoTimeRemaining, getPromoTimeRemainingDetailed } from './timeUtils';

describe('timeUtils', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllTimers();
    });

    it('getPromoTimeRemaining returns correct output for < 1 hour', () => {
        const now = new Date('2023-10-01T12:00:00Z');
        vi.setSystemTime(now);

        // 45 minutes and 30 seconds from now
        const endDate = new Date('2023-10-01T12:45:30Z').toISOString();
        const result = getPromoTimeRemaining(endDate);
        
        expect(result.expired).toBe(false);
        expect(result.urgent).toBe(true);
        expect(result.text).toBe('⏰ باقي 45 دقيقة و 30 ثانية');
    });

    it('getPromoTimeRemaining returns expired for past dates', () => {
        const now = new Date('2023-10-01T12:00:00Z');
        vi.setSystemTime(now);

        // Past date
        const endDate = new Date('2023-10-01T10:00:00Z').toISOString();
        const result = getPromoTimeRemaining(endDate);
        
        expect(result.expired).toBe(true);
        expect(result.text).toBe('انتهى العرض');
    });

    it('getPromoTimeRemaining returns correct output for > 24 hours', () => {
        const now = new Date('2023-10-01T12:00:00Z');
        vi.setSystemTime(now);

        // More than 24 hours
        const endDate = new Date('2023-10-05T12:00:00Z').toISOString();
        const result = getPromoTimeRemaining(endDate);
        
        expect(result.expired).toBe(false);
        expect(result.urgent).toBe(false);
        expect(result.text).toContain('⏰ ينتهي:'); 
    });
});
