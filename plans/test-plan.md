# Test Plan

## Overview

This document outlines the comprehensive testing strategy for the Smogon API Proxy project, including test infrastructure, coverage goals, testing patterns, and best practices.

## Test Framework & Tools

### Primary Framework
- **Jest**: JavaScript/TypeScript testing framework with built-in assertions, mocking, and test runner
- **ts-jest**: TypeScript preprocessor for Jest to enable testing TypeScript code directly
- **Supertest**: HTTP assertion library for testing Express.js endpoints

### Test Dependencies
```json
{
  "devDependencies": {
    "jest": "^30.3.0",
    "@types/jest": "^30.0.0",
    "ts-jest": "^29.4.6",
    "supertest": "^7.2.2",
    "@types/supertest": "^7.2.0"
  }
}
```

### Configuration
- **Config File**: `jest.config.cjs`
- **Test Environment**: Node.js
- **Module System**: CommonJS
- **Coverage Reports**: HTML, LCOV, and text formats

## Test Structure

### Directory Organization
```
src/
├── __tests__/
│   ├── app.test.ts              # Main application tests
│   ├── routes/                  # Route-specific integration tests
│   │   ├── analyses.test.ts
│   │   ├── formats.test.ts
│   │   ├── sets.test.ts
│   │   ├── stats.test.ts
│   │   └── teams.test.ts
│   ├── services/                # Service layer unit tests
│   │   ├── smogonService.test.ts
│   │   └── cacheService.test.ts
│   ├── utils/                   # Utility function unit tests
│   │   ├── errorHandler.test.ts
│   │   ├── validator.test.ts
│   │   └── formatter.test.ts
│   └── middleware/              # Middleware tests
│       ├── validation.test.ts
│       └── rateLimiter.test.ts
```

### Test File Naming Convention
- Test files should be named `<module>.test.ts`
- Place test files in `__tests__` directories mirroring the source structure
- Use descriptive test names that explain the expected behavior

## Test Types

### 1. Unit Tests
Test individual functions, classes, or modules in isolation.

**What to Test**:
- Service methods
- Utility functions
- Data formatters
- Validators
- Error handlers

**Example: Service Unit Test**
```typescript
import { SmogonService } from '../services/smogonService';
import { CacheService } from '../services/cacheService';

jest.mock('../services/cacheService');

describe('SmogonService', () => {
  let service: SmogonService;
  let mockCache: jest.Mocked<CacheService>;

  beforeEach(() => {
    mockCache = new CacheService() as jest.Mocked<CacheService>;
    service = new SmogonService(mockCache);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAnalyses', () => {
    it('should return analyses for valid format', async () => {
      const mockData = { /* analysis data */ };
      mockCache.get.mockReturnValue(null);
      mockCache.set.mockReturnValue();

      const result = await service.getAnalyses('gen9ou');

      expect(result).toBeDefined();
      expect(mockCache.set).toHaveBeenCalled();
    });

    it('should return cached data when available', async () => {
      const cachedData = { /* cached analysis */ };
      mockCache.get.mockReturnValue(cachedData);

      const result = await service.getAnalyses('gen9ou');

      expect(result).toEqual(cachedData);
      expect(mockCache.set).not.toHaveBeenCalled();
    });

    it('should throw error for invalid format', async () => {
      await expect(service.getAnalyses('invalid')).rejects.toThrow();
    });
  });
});
```

### 2. Integration Tests
Test the interaction between multiple components, particularly HTTP endpoints.

**What to Test**:
- API endpoints (routes + controllers)
- Request/response flow
- Middleware integration
- Error handling

**Example: Route Integration Test**
```typescript
import request from 'supertest';
import app from '../app';

describe('Analyses Routes', () => {
  describe('GET /analyses', () => {
    it('should return analyses data for valid format', async () => {
      const response = await request(app)
        .get('/analyses')
        .query({ format: 'gen9ou' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toBeInstanceOf(Array);
    });

    it('should return specific Pokemon analysis', async () => {
      const response = await request(app)
        .get('/analyses')
        .query({ format: 'gen9ou', pokemon: 'Charizard' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('pokemon', 'Charizard');
    });

    it('should return 400 for invalid format parameter', async () => {
      const response = await request(app)
        .get('/analyses')
        .query({ format: 123 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 404 for non-existent Pokemon', async () => {
      const response = await request(app)
        .get('/analyses')
        .query({ format: 'gen9ou', pokemon: 'NonExistentPokemon' });

      expect(response.status).toBe(404);
    });
  });
});
```

### 3. Middleware Tests
Test Express middleware functions.

**Example: Validation Middleware Test**
```typescript
import { validateFormat } from '../middleware/validation';
import { Request, Response, NextFunction } from 'express';

describe('Validation Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = { query: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
  });

  describe('validateFormat', () => {
    it('should call next() for valid format', () => {
      mockReq.query = { format: 'gen9ou' };

      validateFormat(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid format', () => {
      mockReq.query = { format: 'invalid-format' };

      validateFormat(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
```

## Test Coverage

### Coverage Goals
| Metric | Target | Minimum |
|--------|--------|---------|
| Statements | > 80% | 75% |
| Branches | > 75% | 70% |
| Functions | > 80% | 75% |
| Lines | > 80% | 75% |

### Coverage Reports
Coverage reports are generated in the `coverage/` directory:
- `coverage/lcov-report/index.html` - Interactive HTML report
- `coverage/lcov.info` - LCOV format for CI/CD integration
- Console output - Summary printed to terminal

### Running Coverage
```bash
# Generate coverage report
npm run test:coverage

# Open HTML report
open coverage/lcov-report/index.html
```

## Running Tests

### Commands
```bash
# Run all tests
npm test

# Run tests in watch mode (re-run on file changes)
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- analyses.test.ts

# Run tests matching a pattern
npm test -- --testNamePattern="should return"

# Run tests with verbose output
npm test -- --verbose

# Update snapshots (if using snapshots)
npm test -- -u
```

### CI/CD Integration
Tests should run automatically in CI/CD pipeline:
```yaml
# Example GitHub Actions
- name: Run tests
  run: npm test

- name: Upload coverage
  run: npm run test:coverage
```

## Mocking Strategy

### External Dependencies
Always mock external dependencies to ensure tests are:
- Fast and reliable
- Not dependent on external services
- Repeatable

**Mocking @pkmn/smogon**:
```typescript
jest.mock('@pkmn/smogon', () => ({
  Analyses: {
    get: jest.fn()
  },
  Stats: {
    get: jest.fn()
  }
}));
```

### Environment Variables
```typescript
process.env.CACHE_TTL = '3600';
process.env.NODE_ENV = 'test';
```

### Timers
For testing caching, timeouts, etc.:
```typescript
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

it('should expire cache after TTL', () => {
  const service = new CacheService(1000);
  service.set('key', 'value');
  
  jest.advanceTimersByTime(999);
  expect(service.get('key')).toBe('value');
  
  jest.advanceTimersByTime(1);
  expect(service.get('key')).toBeNull();
});
```

## Test Data

### Fixtures
Store test data in fixtures for reuse:
```
src/__tests__/fixtures/
├── analyses.json
├── formats.json
├── sets.json
├── stats.json
└── teams.json
```

### Factory Functions
Create test data programmatically:
```typescript
function createMockAnalysis(overrides = {}) {
  return {
    pokemon: 'Charizard',
    format: 'gen9ou',
    moves: ['Flamethrower', 'Air Slash'],
    ...overrides
  };
}
```

## Best Practices

### 1. Test Isolation
Each test should be independent:
```typescript
beforeEach(() => {
  // Reset state before each test
  jest.clearAllMocks();
});
```

### 2. Descriptive Names
Test names should clearly describe behavior:
```typescript
// ❌ Bad
it('should work', () => {});

// ✅ Good
it('should return 400 when format parameter is missing', () => {});
```

### 3. Arrange-Act-Assert Pattern
Structure tests clearly:
```typescript
it('should cache analysis data', async () => {
  // Arrange
  const format = 'gen9ou';
  const mockData = createMockAnalysis();
  
  // Act
  const result = await service.getAnalyses(format);
  
  // Assert
  expect(cacheService.set).toHaveBeenCalledWith(
    expect.stringContaining(format),
    mockData,
    expect.any(Number)
  );
});
```

### 4. Test Edge Cases
Don't just test happy paths:
```typescript
describe('getAnalyses', () => {
  it('should handle valid format', () => {});
  it('should throw error for invalid format', () => {});
  it('should throw error for empty format', () => {});
  it('should throw error for null format', () => {});
  it('should handle network timeout', () => {});
  it('should handle malformed response', () => {});
});
```

### 5. Avoid Logic in Tests
Tests should be simple and straightforward:
```typescript
// ❌ Bad - logic in test
it('should validate format', () => {
  const formats = ['gen9ou', 'gen8ou', 'gen7ou'];
  formats.forEach(format => {
    const result = validator.isValid(format);
    expect(result).toBe(true);
  });
});

// ✅ Good - explicit tests
it('should validate gen9ou format', () => {
  expect(validator.isValid('gen9ou')).toBe(true);
});

it('should validate gen8ou format', () => {
  expect(validator.isValid('gen8ou')).toBe(true);
});
```

## Performance Testing

### Response Time Tests
```typescript
describe('Performance', () => {
  it('should respond within 200ms for cached data', async () => {
    const start = Date.now();
    
    await request(app)
      .get('/analyses')
      .query({ format: 'gen9ou' });
    
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(200);
  });
});
```

### Load Testing
Consider using tools like:
- **Artillery**: Load testing for HTTP endpoints
- **k6**: Modern load testing tool
- **autocannon**: Node.js HTTP benchmarking

## Error Testing

### Testing Error Conditions
```typescript
describe('Error Handling', () => {
  it('should return 500 for internal server error', async () => {
    // Mock service to throw error
    mockService.getAnalyses.mockRejectedValue(new Error('Database error'));
    
    const response = await request(app)
      .get('/analyses')
      .query({ format: 'gen9ou' });
    
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Internal server error');
  });

  it('should return 503 when external service is unavailable', async () => {
    mockService.getAnalyses.mockRejectedValue(new Error('ECONNREFUSED'));
    
    const response = await request(app)
      .get('/analyses')
      .query({ format: 'gen9ou' });
    
    expect(response.status).toBe(503);
    expect(response.body).toHaveProperty('error', 'Service unavailable');
  });
});
```

## Test Checklist

Before submitting code, ensure:

- [ ] All existing tests pass
- [ ] New code has corresponding tests
- [ ] Test coverage meets minimum requirements (>75%)
- [ ] Tests are properly isolated (no shared state)
- [ ] Mocks are used for external dependencies
- [ ] Edge cases are tested
- [ ] Error conditions are tested
- [ ] Tests are readable and maintainable
- [ ] Test names are descriptive
- [ ] No logic in tests (keep them simple)

## Continuous Improvement

### Regular Reviews
- Review test coverage reports weekly
- Identify untested code paths
- Add tests for bugs found in production (regression tests)
- Refactor tests when refactoring code

### Metrics to Track
- Test coverage percentage over time
- Test execution time
- Flaky test occurrences
- Bug escape rate (bugs found in production)

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Testing Express.js](https://expressjs.com/en/advanced/testing.html)
- [JavaScript Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
