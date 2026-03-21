import { getStats } from '../../controllers/statsController';
import * as smogonService from '../../services';
import { Request, Response, NextFunction } from 'express';

jest.mock('../../services');

describe('statsController', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;
  let mockJson: jest.Mock;

  beforeEach(() => {
    mockReq = { query: {} };
    mockJson = jest.fn();
    mockNext = jest.fn();
    mockRes = { json: mockJson };
    jest.clearAllMocks();
  });

  describe('getStats', () => {
    it('should call smogonService.getStats with all parameters', async () => {
      const mockStats = { usage: { raw: 100 } };
      (smogonService.smogonService.getStats as jest.Mock) = jest.fn().mockResolvedValue(mockStats);
      mockReq.query = { format: 'gen9ou', pokemon: 'Charizard', month: '2024-01', rating: '1500' };

      await getStats(mockReq as Request, mockRes as Response, mockNext as NextFunction);

      expect(smogonService.smogonService.getStats).toHaveBeenCalledWith('gen9ou', 'Charizard', '2024-01', 1500);
      expect(mockJson).toHaveBeenCalledWith(mockStats);
    });

    it('should call smogonService.getStats with format only', async () => {
      const mockStats = { usage: { raw: 100 } };
      (smogonService.smogonService.getStats as jest.Mock) = jest.fn().mockResolvedValue(mockStats);
      mockReq.query = { format: 'gen9ou' };

      await getStats(mockReq as Request, mockRes as Response, mockNext as NextFunction);

      expect(smogonService.smogonService.getStats).toHaveBeenCalledWith('gen9ou', undefined, undefined, undefined);
      expect(mockJson).toHaveBeenCalledWith(mockStats);
    });

    it('should call smogonService.getStats without rating when not provided', async () => {
      const mockStats = { usage: { raw: 100 } };
      (smogonService.smogonService.getStats as jest.Mock) = jest.fn().mockResolvedValue(mockStats);
      mockReq.query = { format: 'gen9ou', pokemon: 'Charizard', month: '2024-01' };

      await getStats(mockReq as Request, mockRes as Response, mockNext as NextFunction);

      expect(smogonService.smogonService.getStats).toHaveBeenCalledWith('gen9ou', 'Charizard', '2024-01', undefined);
      expect(mockJson).toHaveBeenCalledWith(mockStats);
    });
  });
});
