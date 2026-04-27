export type SPCPoint = {
  id: string
  northing: number
  easting: number
  elevation: number
  state: string
  zone: string
  county: string
  description: string
  uploadedBy: string
  firm: string
  uploadedAt: string
  verified: boolean
  verifiedBy?: string
  price: number // in USDC
  purchaseCount: number
  accuracy: string // in meters
  datum: string
  equipment: string
  tags: string[]
}

export const mockPoints: SPCPoint[] = [
  {
    id: 'SPC-OH-001',
    northing: 1234567.891,
    easting: 987654.321,
    elevation: 892.45,
    state: 'Ohio',
    zone: 'Ohio North',
    county: 'Franklin',
    description: 'Iron pin set at NE corner of Lot 42, Columbus boundary survey',
    uploadedBy: 'jsmith_survey',
    firm: 'Exacta Land Services',
    uploadedAt: '2024-11-15',
    verified: true,
    verifiedBy: 'Cub Survey Group',
    price: 12.50,
    purchaseCount: 8,
    accuracy: '0.005',
    datum: 'NAD83(2011)',
    equipment: 'Trimble R10',
    tags: ['boundary', 'iron pin', 'urban', 'franklin county'],
  },
  {
    id: 'SPC-TX-044',
    northing: 7890123.456,
    easting: 543210.789,
    elevation: 512.30,
    state: 'Texas',
    zone: 'Texas Central',
    county: 'Harris',
    description: 'Concrete monument at highway ROW intersection, US-290',
    uploadedBy: 'texsurvey_pro',
    firm: 'Lone Star Survey Co.',
    uploadedAt: '2024-10-02',
    verified: true,
    verifiedBy: 'Texas GeoSurvey Inc.',
    price: 18.00,
    purchaseCount: 14,
    accuracy: '0.008',
    datum: 'NAD83(2011)',
    equipment: 'Leica GS18T',
    tags: ['ROW', 'highway', 'concrete monument', 'harris county'],
  },
  {
    id: 'SPC-CA-209',
    northing: 2345678.012,
    easting: 6789012.345,
    elevation: 1240.80,
    state: 'California',
    zone: 'California Zone 3',
    county: 'Los Angeles',
    description: 'Brass disk set in sidewalk, residential subdivision corner',
    uploadedBy: 'pacific_survey',
    firm: 'Pacific Meridian Surveys',
    uploadedAt: '2024-12-01',
    verified: false,
    price: 9.00,
    purchaseCount: 3,
    accuracy: '0.012',
    datum: 'NAD83(2011)',
    equipment: 'Topcon HiPer VR',
    tags: ['brass disk', 'subdivision', 'residential', 'LA county'],
  },
  {
    id: 'SPC-FL-087',
    northing: 890123.456,
    easting: 234567.890,
    elevation: 14.20,
    state: 'Florida',
    zone: 'Florida East',
    county: 'Miami-Dade',
    description: 'PK nail in asphalt at easement corner, coastal zone',
    uploadedBy: 'coastal_surveyors',
    firm: 'Coastal Meridian Inc.',
    uploadedAt: '2024-09-18',
    verified: true,
    verifiedBy: 'FL State Board Survey',
    price: 22.00,
    purchaseCount: 19,
    accuracy: '0.003',
    datum: 'NAVD88',
    equipment: 'Trimble R12i',
    tags: ['coastal', 'easement', 'PK nail', 'miami-dade'],
  },
  {
    id: 'SPC-NY-312',
    northing: 3456789.123,
    easting: 456789.012,
    elevation: 345.60,
    state: 'New York',
    zone: 'NY East',
    county: 'Albany',
    description: 'Mag nail in pavement, utility corridor survey',
    uploadedBy: 'empire_state_survey',
    firm: 'Empire State Surveyors LLC',
    uploadedAt: '2024-11-28',
    verified: false,
    price: 7.50,
    purchaseCount: 1,
    accuracy: '0.015',
    datum: 'NAD83(2011)',
    equipment: 'Sokkia GRX3',
    tags: ['utility', 'mag nail', 'pavement', 'albany county'],
  },
  {
    id: 'SPC-IL-156',
    northing: 5678901.234,
    easting: 901234.567,
    elevation: 621.15,
    state: 'Illinois',
    zone: 'Illinois East',
    county: 'Cook',
    description: 'Concrete monument at section corner, agricultural boundary',
    uploadedBy: 'midwest_geo',
    firm: 'Midwest GeoSurvey',
    uploadedAt: '2024-08-10',
    verified: true,
    verifiedBy: 'Illinois Survey Alliance',
    price: 15.00,
    purchaseCount: 11,
    accuracy: '0.006',
    datum: 'NAD83(2011)',
    equipment: 'Leica GS16',
    tags: ['section corner', 'agricultural', 'concrete monument', 'cook county'],
  },
]

export const stats = {
  totalPoints: 847_329,
  totalFirms: 312,
  totalPurchases: 2_841,
  totalValueLocked: 2_600_000,
  monthlyUploads: 48_200,
  avgAccuracy: '0.008m',
}

export const states = [
  'All States', 'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
  'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
  'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
  'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia',
  'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
]
