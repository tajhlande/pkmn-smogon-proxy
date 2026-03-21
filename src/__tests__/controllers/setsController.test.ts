import { getSets } from '../../controllers/setsController';
import * as smogonService from '../../services';
import { Request, Response, NextFunction } from 'express';

jest.mock('../../services');

describe('setsController', () => {
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

  describe('getSets', () => {
    it('should call smogonService.getSets with format and pokemon', async () => {
      const mockSets = [{ name: 'Test Set' }];
      (smogonService.smogonService.getSets as jest.Mock) = jest.fn().mockResolvedValue(mockSets);
      mockReq.query = { format: 'gen9ou', pokemon: 'Charizard' };

      await getSets(mockReq as Request, mockRes as Response, mockNext as NextFunction);

      expect(smogonService.smogonService.getSets).toHaveBeenCalledWith('gen9ou', 'Charizard');
      expect(mockJson).toHaveBeenCalledWith(mockSets);
    });

    it('should call smogonService.getSets with format only', async () => {
      const mockSets = [{ name: 'Test Set' }];
      (smogonService.smogonService.getSets as jest.Mock) = jest.fn().mockResolvedValue(mockSets);
      mockReq.query = { format: 'gen9ou' };

      await getSets(mockReq as Request, mockRes as Response, mockNext as NextFunction);

      expect(smogonService.smogonService.getSets).toHaveBeenCalledWith('gen9ou', undefined);
      expect(mockJson).toHaveBeenCalledWith(mockSets);
    });
  });
});
