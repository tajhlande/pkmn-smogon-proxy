import { getFormats } from '../../controllers/formatsController';
import * as smogonService from '../../services';
import { Request, Response, NextFunction } from 'express';

jest.mock('../../services');

describe('formatsController', () => {
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

  describe('getFormats', () => {
    it('should call smogonService.getFormats and return formats', async () => {
      const mockFormats = ['gen9ou', 'gen9uu'];
      (smogonService.smogonService.getFormats as jest.Mock) = jest.fn().mockResolvedValue(mockFormats);

      await getFormats(mockReq as Request, mockRes as Response, mockNext as NextFunction);

      expect(smogonService.smogonService.getFormats).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(mockFormats);
    });
  });
});
