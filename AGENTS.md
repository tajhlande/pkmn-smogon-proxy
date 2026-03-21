# AGENTS.md

Guidelines for AI coding agents working in this repository.


## General Rules

- Stay inside the project directory. Do not take actions outside the project directory.
- Don't make git commits unless specifically asked.
- Ensure tests pass before declaring a task completed.
- Maintain full test coverage for new code.

## Project Overview

Smogon API Proxy - A REST API wrapper for the `@pkmn/smogon` package, providing access to Pokémon analyses, movesets, sample teams, and usage statistics.

## Build/Lint/Test Commands

```bash
npm run build          # Build TypeScript to JavaScript
npm start              # Start production server
npm run dev            # Development mode (with ts-node)
npm test               # Run all tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage report

# Run a single test file
npx jest src/__tests__/services/smogonService.test.ts

# Run a single test file with coverage
npx jest src/__tests__/services/smogonService.test.ts --coverage

# Run tests matching a pattern
npx jest --testNamePattern="getFormats"

# Type check without emitting
npx tsc --noEmit
```

## Project Structure

```
src/
├── app.ts                    # Express application entry point
├── routes/                   # API route definitions
├── controllers/              # Request handlers
├── services/                 # Business logic (SmogonService, CacheService, etc.)
├── middleware/               # Express middleware (validation, auth, rate limiting)
├── errors/                   # Custom error classes
├── types/                    # TypeScript type definitions
└── __tests__/                # Test files (mirror src/ structure)
```

## Code Style Guidelines

### Imports

Order imports by scope (external → internal), separated by blank lines:

```typescript
// 1. External packages
import { Request, Response, NextFunction } from 'express';
import { Dex } from '@pkmn/dex';

// 2. Internal modules (use relative paths)
import { SmogonService } from '../../services/smogonService';
import { AppError } from '../errors';
```

### Naming Conventions

- **Files**: camelCase (e.g., `smogonService.ts`, `errorHandler.ts`)
- **Classes**: PascalCase (e.g., `SmogonService`, `ValidationError`)
- **Functions/Methods**: camelCase (e.g., `getFormats`, `validateApiKey`)
- **Constants**: UPPER_SNAKE_CASE for true constants, camelCase otherwise
- **Interfaces/Types**: PascalCase (e.g., `ApiKeyData`, `ErrorResponse`)
- **Private members**: Use `private` keyword, no underscore prefix

### Functions

- Use explicit return types for all functions
- Use arrow functions for exports in controllers:

```typescript
export const getFormats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const formats = await smogonService.getFormats();
  res.json(formats);
});
```

### Types

- Use TypeScript strict mode - all code must be fully typed
- Avoid `any` - use `unknown` when type is truly unknown
- Define interfaces in `src/types/` for shared types

### Error Handling

Use custom error classes from `src/errors/`:

```typescript
import { ValidationError, NotFoundError, ExternalApiError } from '../errors';

throw new ValidationError('Invalid format', { format });           // 400
throw new NotFoundError(`No analyses found for ${pokemon}`);       // 404
throw new ExternalApiError('Failed to fetch data', { error });     // 502
```

Always wrap async route handlers with `asyncHandler`:

```typescript
export const getResource = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // async code here
});
```

### Middleware Pattern

```typescript
export function middlewareName(req: Request, res: Response, next: NextFunction): void {
  // synchronous logic
  next();
}
```

### Testing

- Tests live in `src/__tests__/` mirroring the source structure
- Use Jest with `describe`/`it` blocks
- Mock external dependencies at the top of the test file
- Use `beforeEach`/`afterEach` for setup/teardown

```typescript
jest.mock('@pkmn/external', () => ({
  External: jest.fn().mockImplementation(() => ({ method: jest.fn() })),
}));

describe('Service', () => {
  let service: Service;

  beforeEach(() => {
    service = new Service();
    jest.clearAllMocks();
  });

  it('should return expected result', async () => {
    const result = await service.methodName();
    expect(result).toBeDefined();
  });

  it('should throw NotFoundError when resource not found', async () => {
    await expect(service.methodName('invalid')).rejects.toThrow(NotFoundError);
  });
});
```

### Comments

- **DO NOT** add comments unless specifically requested
- Code should be self-documenting through clear naming

### Service Layer

Services are classes that handle business logic:

```typescript
export class SomeService {
  private cache: CacheService;

  constructor(cache: CacheService) {
    this.cache = cache;
  }

  async getData(key: string): Promise<Data> {
    const cached = this.cache.get<Data>(key);
    if (cached) return cached;
    const data = await this.fetchData(key);
    this.cache.set(key, data);
    return data;
  }
}

export const someService = new SomeService(new CacheService());
```
