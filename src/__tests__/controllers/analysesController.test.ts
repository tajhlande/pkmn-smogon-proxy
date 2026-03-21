import { getAnalyses } from '../../controllers/analysesController';
import * as smogonService from '../../services';
import { Request, Response, NextFunction } from 'express';

jest.mock('../../services');

describe('analysesController', () => {
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

  describe('getAnalyses', () => {
    it('should call smogonService.getAnalyses with format and pokemon', async () => {
      const mockAnalyses = [{ format: 'gen9ou', sets: {} }];
      (smogonService.smogonService.getAnalyses as jest.Mock) = jest.fn().mockResolvedValue(mockAnalyses);
      mockReq.query = { format: 'gen9ou', pokemon: 'Charizard' };

      await getAnalyses(mockReq as Request, mockRes as Response, mockNext as NextFunction);

      expect(smogonService.smogonService.getAnalyses).toHaveBeenCalledWith('gen9ou', 'Charizard');
      expect(mockJson).toHaveBeenCalledWith(mockAnalyses);
    });

    it('should call smogonService.getAnalyses with format only', async () => {
      const mockAnalyses = [{ format: 'gen9ou', sets: {} }];
      (smogonService.smogonService.getAnalyses as jest.Mock) = jest.fn().mockResolvedValue(mockAnalyses);
      mockReq.query = { format: 'gen9ou' };

      await getAnalyses(mockReq as Request, mockRes as Response, mockNext as NextFunction);

      expect(smogonService.smogonService.getAnalyses).toHaveBeenCalledWith('gen9ou', undefined);
      expect(mockJson).toHaveBeenCalledWith(mockAnalyses);
    });
  });
});
