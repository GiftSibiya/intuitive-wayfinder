/**
 * Application api routes
 */
export const API = {
    USERS: '/api/users',
    CLIENTS: '/api/clients',
    CLIENT_SETTINGS: 'api/clients/settings',
    CLIENT: {
        SETTINGS: 'api/clients/settings',
        TRIGGERS: '/api/clients/settings/trigger',
        MIN_OCCUPANCIES: '/api/clients/settings/ls-min-occupancy',
        RPT_TIME_RANGES: '/api/clients/settings/rpt-time-ranges',
        EMAIL_INTUITIVE_RPT: (uuid) => `/api/clients/${uuid}/email-intuitive-rpt`
    },
    FLOORS: '/api/floors',
    AREAS: '/api/areas',
    AREA_TYPES: '/api/areas/types',
    AREA_SUB_TYPES: '/api/areas/sub-types',
    SENSORS: '/api/sensors',
    WAY_FINDING_SENSORS: '/api/sensors/way-finding',
    LOCATIONS: '/api/locations',
    COSTS: (cid) => `/api/locations/${cid}/costs`,
    GLOBAL_COSTS: '/api/gcosts',
    REPORT: {
        UTIL_PERIOD: '/api/util-report/periods'
    },
    WORK_CONFIGS: '/api/work-configs',
    LIVE_CREDENTIALS: '/api/live/credentials',
}

export const ASSETS = {
    CITIES_JSON: '/assets/cities'
}

/**
 * Building ids to use the old websocket (Mark's sensor feed)
 */
export const bidtutows = [
    '28484d0e-db78-40ff-8b5e-827a755cdef3', // Godrej Building (India)
    'f11f9341-0d3c-4370-ae74-a2510d8c89a3', // Midtown (Rio Tinto)
]

/**
 * Building ids to use butlr (Tiaan's meeting room feed endpoint)
 */
export const bidtubutlr = [
    '4ebbeac3-571e-4446-af16-b63b4c569a52', // Netflix London
    'c009a8a5-021e-4b33-bae9-87123a25fb3b', // Netflix Paris
    'd5168399-16da-49f5-a9d4-2e5960f40599', // Netflix Tokyo Midtown East
    '0da63614-ff9e-418b-823e-cf4a7ece2d41', // Netflix Marina One West Tower
    'cb17dd50-3bb5-4591-99ce-8717e2ed4506', // Netflix Centropolis Building
    '0811e1d1-4da9-42ca-9539-4e2a91a589aa', // Netflix Sydney
    'cf12b8fa-86fe-4fe3-8918-26603bb29468' // Netflix Bangkok
]

/**
 * Backend auth token refresh interval (in hours)
 */
export const AUTH_INTERVAL = 2

/**
 * CSRF token refresh interval (in hours)
 */
export const CSRF_INTERVAL = 1.95

/**
 * Month names
 */
export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

/**
 * Days of the week
 */
export const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/**
 * Meter to foot factor
 */
export const METRE_FOOT_FACTOR = 0.092903

/**
 * Liter to gallon factor
 */
export const LITER_GAL_FACTOR = 0.264172

/**
 * Kilogram to pound factor
 */
export const KG_LBS_FACTOR = 2.20462

/**
 * Kilometer to mile factor
 */
export const KM_MILES_FACTOR = 0.621371

export const ROOM_SUB_TYPE_URI = {
    INTERNAL_FORMAL_ENCLOSED_MEETING_ROOM: 'internal_formal_enclosed',
    INTERNAL_SOFTSEATING_ENCLOSED_MEETING_ROOM: 'internal_soft_seating_enclosed',
    PUBLIC_FORMAL_ENCLOSED_MEETING_ROOM: 'public_formal_enclosed',
    PUBLIC_SOFT_SEATING_ENCLOSED_MEETING_ROOM: 'public_soft_seating_enclosed',
    INTERNAL_FORMAL_OPEN_MEETING_SPACE: 'internal_formal_open',
    INTERNAL_SOFT_SEATING_OPEN_MEETING_SPACE: 'internal_soft_seating_open',
    PUBLIC_FORMAL_OPEN_MEETING_SPACE: 'public_formal_open',
    PUBLIC_SOFT_SEATING_OPEN_MEETING_SPACE: 'public_soft_seating_open'
}