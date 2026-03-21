import { validateFormat, validateSets, validateStats, validateTeams, validateAnalyses } from '../../middleware/validation';
import { ValidationError } from '../../errors';
import { Request, Response, NextFunction } from 'express';

describe('Validation Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = { query: {} };
    mockRes = {};
    mockNext = jest.fn();
  });

  describe('validateFormat', () => {
    it('should call next() for valid format', () => {
      mockReq.query = { format: 'gen9ou' };
      validateFormat(mockReq as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should call next() when format is not provided', () => {
      mockReq.query = {};
      validateFormat(mockReq as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should throw ValidationError for invalid format', () => {
      mockReq.query = { format: 'invalid' };
      expect(() => validateFormat(mockReq as Request, mockRes as Response, mockNext)).toThrow(ValidationError);
    });

    it('should include format in error details', () => {
      mockReq.query = { format: 'invalid' };
      try {
        validateFormat(mockReq as Request, mockRes as Response, mockNext);
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).details).toEqual({ format: 'invalid' });
      }
    });
  });

  describe('validateSets', () => {
    it('should throw ValidationError when format is missing', () => {
      mockReq.query = {};
      expect(() => validateSets(mockReq as Request, mockRes as Response, mockNext)).toThrow(ValidationError);
    });

    it('should call next() for valid format and pokemon', () => {
      mockReq.query = { format: 'gen9ou', pokemon: 'Charizard' };
      validateSets(mockReq as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should call next() for valid format without pokemon', () => {
      mockReq.query = { format: 'gen9ou' };
      validateSets(mockReq as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should throw ValidationError for invalid format', () => {
      mockReq.query = { format: 'invalid' };
      expect(() => validateSets(mockReq as Request, mockRes as Response, mockNext)).toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid pokemon name', () => {
      mockReq.query = { format: 'gen9ou', pokemon: 'invalid@#$' };
      expect(() => validateSets(mockReq as Request, mockRes as Response, mockNext)).toThrow(ValidationError);
    });

    it('should accept pokemon with hyphens', () => {
      mockReq.query = { format: 'gen9ou', pokemon: 'Iron-Valiant' };
      validateSets(mockReq as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should accept pokemon with apostrophes', () => {
      mockReq.query = { format: 'gen9ou', pokemon: "Farfetchd" };
      validateSets(mockReq as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('validateStats', () => {
    it('should throw ValidationError when format is missing', () => {
      mockReq.query = {};
      expect(() => validateStats(mockReq as Request, mockRes as Response, mockNext)).toThrow(ValidationError);
    });

    it('should call next() for valid format only', () => {
      mockReq.query = { format: 'gen9ou' };
      validateStats(mockReq as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should call next() for valid format, pokemon, month, and rating', () => {
      mockReq.query = { format: 'gen9ou', pokemon: 'Charizard', month: '2024-01', rating: '1500' };
      validateStats(mockReq as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should throw ValidationError for invalid format', () => {
      mockReq.query = { format: 'invalid' };
      expect(() => validateStats(mockReq as Request, mockRes as Response, mockNext)).toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid pokemon name', () => {
      mockReq.query = { format: 'gen9ou', pokemon: 'invalid@#$' };
      expect(() => validateStats(mockReq as Request, mockRes as Response, mockNext)).toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid month format', () => {
      mockReq.query = { format: 'gen9ou', month: '2024-13' };
      expect(() => validateStats(mockReq as Request, mockRes as Response, mockNext)).toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid month format (wrong separator)', () => {
      mockReq.query = { format: 'gen9ou', month: '2024/01' };
      expect(() => validateStats(mockReq as Request, mockRes as Response, mockNext)).toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid rating', () => {
      mockReq.query = { format: 'gen9ou', rating: '-100' };
      expect(() => validateStats(mockReq as Request, mockRes as Response, mockNext)).toThrow(ValidationError);
    });

    it('should throw ValidationError for NaN rating', () => {
      mockReq.query = { format: 'gen9ou', rating: 'abc' };
      expect(() => validateStats(mockReq as Request, mockRes as Response, mockNext)).toThrow(ValidationError);
    });

    it('should accept valid month (December)', () => {
      mockReq.query = { format: 'gen9ou', month: '2024-12' };
      validateStats(mockReq as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should accept valid month (January)', () => {
      mockReq.query = { format: 'gen9ou', month: '2024-01' };
      validateStats(mockReq as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should accept rating of 0', () => {
      mockReq.query = { format: 'gen9ou', rating: '0' };
      validateStats(mockReq as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('validateTeams', () => {
    it('should throw ValidationError when format is missing', () => {
      mockReq.query = {};
      expect(() => validateTeams(mockReq as Request, mockRes as Response, mockNext)).toThrow(ValidationError);
    });

    it('should call next() for valid format', () => {
      mockReq.query = { format: 'gen9ou' };
      validateTeams(mockReq as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should throw ValidationError for invalid format', () => {
      mockReq.query = { format: 'invalid' };
      expect(() => validateTeams(mockReq as Request, mockRes as Response, mockNext)).toThrow(ValidationError);
    });
  });

  describe('validateAnalyses', () => {
    it('should call next() for valid format and pokemon', () => {
      mockReq.query = { format: 'gen9ou', pokemon: 'Charizard' };
      validateAnalyses(mockReq as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should call next() when no parameters provided', () => {
      mockReq.query = {};
      validateAnalyses(mockReq as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should throw ValidationError for invalid format', () => {
      mockReq.query = { format: 'invalid' };
      expect(() => validateAnalyses(mockReq as Request, mockRes as Response, mockNext)).toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid pokemon name', () => {
      mockReq.query = { pokemon: 'invalid@#$' };
      expect(() => validateAnalyses(mockReq as Request, mockRes as Response, mockNext)).toThrow(ValidationError);
    });
  });
});
