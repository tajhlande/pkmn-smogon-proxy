# Smogon API Proxy - Project Structure

## Overview

This project provides an OpenAPI-compliant REST API that wraps the functionality of the `@pkmn/smogon` package, exposing Smogon's Pokémon analyses, movesets, sample teams, and usage statistics through standardized HTTP endpoints.

## Purpose

The `@pkmn/smogon` package provides access to data from [data.pkmn.cc](https://data.pkmn.cc), which contains curated datasets from Smogon and Pokémon Showdown. This proxy API makes that data accessible through a clean, documented REST API interface following OpenAPI 3.0 specification.

## Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Data Source**: `@pkmn/smogon` package
- **API Specification**: OpenAPI 3.0

## Project Structure

```
pkmn-smogon-proxy/
├── src/
│   ├── app.ts                    # Main Express application entry point
│   ├── __tests__/                # Test files
│   │   ├── app.test.ts          # Application tests
│   │   ├── routes/              # Route tests
│   │   │   ├── analyses.test.ts
│   │   │   ├── formats.test.ts
│   │   │   ├── sets.test.ts
│   │   │   ├── stats.test.ts
│   │   │   └── teams.test.ts
│   │   ├── services/            # Service layer tests
│   │   └── utils/               # Utility tests
│   ├── routes/                   # API route definitions
│   │   ├── analyses.ts          # Analyses endpoint routes
│   │   ├── formats.ts           # Formats endpoint routes
│   │   ├── sets.ts              # Sets/movesets endpoint routes
│   │   ├── stats.ts             # Usage statistics endpoint routes
│   │   └── teams.ts             # Sample teams endpoint routes
│   ├── controllers/             # Request handlers and business logic
│   │   ├── analysesController.ts
│   │   ├── formatsController.ts
│   │   ├── setsController.ts
│   │   ├── statsController.ts
│   │   └── teamsController.ts
│   ├── services/                # Data fetching and processing logic
│   │   ├── smogonService.ts     # Wrapper for @pkmn/smogon package
│   │   └── cacheService.ts      # Caching layer for API responses
│   ├── models/                  # TypeScript interfaces and types
│   │   ├── analysis.ts          # Analysis data types
│   │   ├── format.ts            # Format data types
│   │   ├── set.ts               # Set/moveset data types
│   │   ├── stats.ts             # Statistics data types
│   │   └── team.ts              # Team data types
│   ├── utils/                   # Helper functions and utilities
│   │   ├── errorHandler.ts      # Global error handling
│   │   ├── validator.ts         # Request validation helpers
│   │   └── formatter.ts         # Data formatting utilities
│   └── middleware/              # Express middleware
│       ├── validation.ts        # Request validation middleware
│       └── rateLimiter.ts       # Rate limiting middleware
├── docs/
│   └── openapi.yaml             # OpenAPI 3.0 specification
├── coverage/                     # Test coverage reports (generated)
├── dist/                        # Compiled JavaScript output
├── package.json
├── tsconfig.json
├── jest.config.js               # Jest configuration
└── README.md
```

## API Endpoints

### 1. Analyses (`/analyses`)
- **Purpose**: Retrieve Pokémon analyses from Smogon
- **Query Parameters**:
  - `format` (optional): Battle format (e.g., "gen9ou")
  - `pokemon` (optional): Specific Pokémon name
- **Implementation Notes**: 
  - Uses `@pkmn/smogon` analyses data
  - Should support filtering by generation and format
  - Returns detailed analysis including moves, items, abilities, and strategies

### 2. Formats (`/formats`)
- **Purpose**: Get list of available battle formats
- **Query Parameters**: None
- **Implementation Notes**:
  - Returns all supported formats across generations
  - Should be cached and refreshed periodically
  - Includes both current and historical formats

### 3. Sets (`/sets`)
- **Purpose**: Retrieve competitive moveset data
- **Query Parameters**:
  - `format` (required): Battle format
  - `pokemon` (optional): Specific Pokémon (returns all if omitted)
- **Implementation Notes**:
  - Provides recommended movesets for competitive play
  - Includes EV spreads, IVs, natures, abilities, and items
  - Should support multiple sets per Pokémon

### 4. Stats (`/stats`)
- **Purpose**: Access usage statistics
- **Query Parameters**:
  - `format` (required): Battle format
  - `month` (optional): Month in YYYY-MM format
  - `rating` (optional): Rating threshold (e.g., 1500, 1630, 1760)
- **Implementation Notes**:
  - Provides usage rates, win rates, and partner statistics
  - Historical data available by month
  - Different rating thresholds available for different skill levels

### 5. Teams (`/teams`)
- **Purpose**: Retrieve sample teams
- **Query Parameters**:
  - `format` (required): Battle format
- **Implementation Notes**:
  - Returns sample teams from high-level players
  - Includes full team composition with sets
  - Should include team descriptions and strategies

For detailed implementation planning, phases, and timeline, see [Implementation Plan](plans/implementation-plan.md).

## Key Dependencies

### Production
- `express`: Web framework
- `@pkmn/smogon`: Smogon data access

### Development
- `typescript`: Type safety and compilation
- `@types/node`: Node.js type definitions
- `@types/express`: Express type definitions
- `ts-node`: TypeScript execution for development

## Testing

This project uses **Jest** and **Supertest** for comprehensive testing.

For detailed test planning, including:
- Test structure and organization
- Coverage goals and reporting
- Testing patterns and examples
- Mocking strategies
- Best practices

See the [Test Plan](plans/TEST_PLAN.md).

### Quick Start

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Configuration

Environment variables supported:
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `CACHE_TTL`: Cache time-to-live in seconds
- `RATE_LIMIT_MAX`: Maximum requests per time window

## Getting Started

1. Install dependencies: `npm install`
2. Build the project: `npm run build`
3. Run tests: `npm test`
4. Start the server: `npm start`
5. For development: `npm run dev`

## OpenAPI Documentation

The complete API specification is available in `docs/openapi.yaml`. This can be used with tools like:
- Swagger UI for interactive documentation
- Code generators for client SDKs
- API validation tools

## Notes

- The `@pkmn/smogon` package fetches data from data.pkmn.cc, which is updated regularly
- Consider implementing caching to reduce load and improve response times
- Rate limiting is important to be respectful to the data source
- The API should handle errors gracefully and return meaningful error messages
- All endpoints should return data in JSON format following the OpenAPI specification
