# Smogon API Proxy

A REST API wrapper for the `@pkmn/smogon` package, providing access to Smogon's Pokémon analyses, movesets, sample teams, and usage statistics.

## Quick Start

```bash
# Install dependencies
npm install

# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

The server runs on port 3000 by default (configurable via `PORT` environment variable).

## API Endpoints

### Base URL

```
http://localhost:3000
```

### Authentication (Optional)

API key authentication can be enabled by setting `API_KEY_REQUIRED=true`. When enabled, include your API key via:

- **Authorization header**: `Authorization: Bearer sk_your_api_key`
- **Query parameter**: `?api_key=sk_your_api_key`

---

### GET /

Returns API information and available endpoints.

**Example:**
```bash
curl http://localhost:3000/
```

**Response:**
```json
{
  "message": "Smogon API Proxy",
  "version": "1.0.0",
  "endpoints": {
    "analyses": "/analyses",
    "formats": "/formats",
    "sets": "/sets",
    "stats": "/stats",
    "teams": "/teams"
  },
  "documentation": "/api-docs"
}
```

---

### GET /formats

Returns list of available battle formats.

**Example:**
```bash
curl http://localhost:3000/formats
```

**Response:**
```json
["gen9ou", "gen9ubers", "gen9uu", "gen9ru", "gen9nu", "gen9pu", ...]
```

---

### GET /analyses

Retrieve Pokémon analyses from Smogon.

**Query Parameters:**
| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| format    | string | No       | Battle format (e.g., "gen9ou") |
| pokemon   | string | No       | Pokémon name |

**Examples:**

```bash
# Get all analyses for a format
curl "http://localhost:3000/analyses?format=gen9ou"

# Get analysis for specific Pokémon
curl "http://localhost:3000/analyses?format=gen9ou&pokemon=Charizard"
```

**Response:**
```json
{
  "format": "gen9ou",
  "pokemon": "Charizard",
  "analysis": {
    "overview": "...",
    "moves": [...],
    "sets": [...],
    "checks": [...],
    "counters": [...]
  }
}
```

---

### GET /sets

Retrieve competitive moveset data.

**Query Parameters:**
| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| format    | string | Yes      | Battle format (e.g., "gen9ou") |
| pokemon   | string | No       | Pokémon name (returns all if omitted) |

**Examples:**

```bash
# Get all sets for a format
curl "http://localhost:3000/sets?format=gen9ou"

# Get sets for specific Pokémon
curl "http://localhost:3000/sets?format=gen9ou&pokemon=Charizard"
```

**Response:**
```json
{
  "format": "gen9ou",
  "pokemon": "Charizard",
  "sets": [
    {
      "name": "Roost Three Attacks",
      "moves": ["Fire Blast", "Air Slash", "Dragon Pulse", "Roost"],
      "item": "Heavy-Duty Boots",
      "ability": "Blaze",
      "nature": "Timid",
      "evs": { "hp": 0, "atk": 0, "def": 0, "spa": 252, "spd": 4, "spe": 252 },
      "ivs": { "hp": 31, "atk": 0, "def": 31, "spa": 31, "spd": 31, "spe": 31 }
    }
  ]
}
```

---

### GET /stats

Access usage statistics.

**Query Parameters:**
| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| format    | string | Yes      | Battle format (e.g., "gen9ou") |
| pokemon   | string | No       | Pokémon name |
| month     | string | No       | Month in YYYY-MM format |
| rating    | number | No       | Rating threshold (e.g., 1500, 1630, 1760) |

**Examples:**

```bash
# Get current usage stats for a format
curl "http://localhost:3000/stats?format=gen9ou"

# Get stats for specific month
curl "http://localhost:3000/stats?format=gen9ou&month=2024-01"

# Get stats for specific rating
curl "http://localhost:3000/stats?format=gen9ou&rating=1760"

# Get stats for specific Pokémon
curl "http://localhost:3000/stats?format=gen9ou&pokemon=Charizard"
```

---

### GET /teams

Retrieve sample teams.

**Query Parameters:**
| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| format    | string | Yes      | Battle format (e.g., "gen9ou") |

**Examples:**

```bash
# Get sample teams for a format
curl "http://localhost:3000/teams?format=gen9ou"
```

**Response:**
```json
[
  {
    "name": "Sample Team 1",
    "author": "Player Name",
    "data": [
      { "name": "Great Tusk", "species": "Great Tusk", ... },
      { "name": "Kingambit", "species": "Kingambit", ... },
      ...
    ]
  }
]
```

---

### GET /health

Health check endpoint.

**Example:**
```bash
curl http://localhost:3000/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T12:00:00.000Z"
}
```

---

### GET /api-docs

API documentation and OpenAPI specification summary.

---

## Error Responses

All errors follow a consistent format:

```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "statusCode": 400,
    "details": { "field": "additional info" }
  }
}
```

**Error Codes:**
| Code | Status | Description |
|------|--------|-------------|
| VALIDATION_ERROR | 400 | Invalid request parameters |
| NOT_FOUND | 404 | Resource not found |
| AUTHENTICATION_ERROR | 401 | Authentication required or invalid |
| RATE_LIMIT_EXCEEDED | 429 | Rate limit exceeded |
| EXTERNAL_API_ERROR | 502 | Error fetching data from external source |
| INTERNAL_ERROR | 500 | Internal server error |

---

## Configuration

Environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3000 | Server port |
| NODE_ENV | development | Environment (development/production) |
| CACHE_TTL | 3600 | Cache TTL in seconds |
| RATE_LIMIT_MAX | 100 | Max requests per 15 minutes |
| LOG_LEVEL | info | Logging verbosity (trace/debug/info/warn/error) |
| API_KEY_REQUIRED | false | Enable API key authentication |

---

## Rate Limiting

The API implements rate limiting to prevent abuse:
- **Default**: 100 requests per 15-minute window
- **Headers**: Rate limit info included in response headers
- **Response**: 429 status when limit exceeded

---

## Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Logging**: Pino
- **Testing**: Jest + Supertest
- **Data Source**: @pkmn/smogon package

## Project Structure

```
src/
├── app.ts                    # Express application
├── routes/                   # API route definitions
├── controllers/              # Request handlers
├── services/                 # Business logic
│   ├── smogonService.ts      # @pkmn/smogon wrapper
│   ├── cacheService.ts       # Caching layer
│   ├── logger.ts             # Logging service
│   └── apiKeyService.ts      # API key management
├── middleware/               # Express middleware
│   ├── validation.ts         # Request validation
│   ├── rateLimiter.ts        # Rate limiting
│   ├── auth.ts               # Authentication
│   ├── errorHandler.ts       # Error handling
│   └── requestLogger.ts      # Request logging
├── errors/                   # Custom error classes
└── types/                    # TypeScript types
```

## License

MIT
