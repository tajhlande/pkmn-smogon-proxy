import { getTeams } from '../../controllers/teamsController';
import * as smogonService from '../../services';
import { Request, Response, NextFunction } from 'express';

jest.mock('../../services');

describe('teamsController', () => {
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

  describe('getTeams', () => {
    it('should call smogonService.getTeams with format', async () => {
      const mockTeams = [{ name: 'Test Team', data: [] }];
      (smogonService.smogonService.getTeams as jest.Mock) = jest.fn().mockResolvedValue(mockTeams);
      mockReq.query = { format: 'gen9ou' };

      await getTeams(mockReq as Request, mockRes as Response, mockNext as NextFunction);

      expect(smogonService.smogonService.getTeams).toHaveBeenCalledWith('gen9ou');
      expect(mockJson).toHaveBeenCalledWith(mockTeams);
    });
  });
});
