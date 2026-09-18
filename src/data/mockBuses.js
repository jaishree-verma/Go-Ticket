// GoTicket Mock Transport Dataset
// Designed for seamless transition to FastAPI + MySQL backend in future modules

export const MOCK_BUSES = [
  // Kanpur → Delhi
  {
    id: 'UP78KN1234',
    operator: 'GoRide Travels',
    busName: 'GoRide Express',
    source: 'Kanpur',
    destination: 'Delhi',
    departureTime: '08:30 PM',
    arrivalTime: '05:30 AM',
    duration: '9h 00m',
    price: 680,
    availableSeats: 18,
    busType: 'AC Sleeper 2+1',
    rating: '4.8 ★',
    amenities: ['⚡ Charging', '📶 Free Wi-Fi', '🥛 Water Bottle', '🛋️ Reclining Seats'],
    slots: [
      { time: '08:30 PM', fare: '₹680', status: 'available' },
      { time: '09:30 PM', fare: '₹720', status: 'filling' },
      { time: '10:30 PM', fare: '₹750', status: 'available' }
    ]
  },
  {
    id: 'UP78KN5678',
    operator: 'KSRTC Swift',
    busName: 'SwiftLine Luxury',
    source: 'Kanpur',
    destination: 'Delhi',
    departureTime: '09:15 PM',
    arrivalTime: '06:00 AM',
    duration: '8h 45m',
    price: 750,
    availableSeats: 12,
    busType: 'Volvo AC Multi-Axle',
    rating: '4.9 ★',
    amenities: ['⚡ Charging', '📶 Wi-Fi', '❄️ Climate Control', '🎬 Movies'],
    slots: [
      { time: '09:15 PM', fare: '₹750', status: 'available' },
      { time: '10:15 PM', fare: '₹790', status: 'filling' },
      { time: '11:15 PM', fare: '₹820', status: 'filled' }
    ]
  },
  {
    id: 'UP78KN9012',
    operator: 'U.P. Roadways Platinum',
    busName: 'Janrath AC Express',
    source: 'Kanpur',
    destination: 'Delhi',
    departureTime: '10:00 PM',
    arrivalTime: '07:00 AM',
    duration: '9h 00m',
    price: 599,
    availableSeats: 24,
    busType: 'AC Seater 2+2',
    rating: '4.6 ★',
    amenities: ['⚡ Charging', '💺 Pushback Seats', '💊 Emergency Kit'],
    slots: [
      { time: '10:00 PM', fare: '₹599', status: 'available' },
      { time: '11:00 PM', fare: '₹629', status: 'available' }
    ]
  },

  // Delhi → Kanpur
  {
    id: 'UP14DL4321',
    operator: 'GoRide Travels',
    busName: 'GoRide Return Star',
    source: 'Delhi',
    destination: 'Kanpur',
    departureTime: '09:00 PM',
    arrivalTime: '06:00 AM',
    duration: '9h 00m',
    price: 680,
    availableSeats: 20,
    busType: 'AC Sleeper 2+1',
    rating: '4.7 ★',
    amenities: ['⚡ Charging', '📶 Free Wi-Fi', '🛌 Clean Blankets'],
    slots: [
      { time: '09:00 PM', fare: '₹680', status: 'available' },
      { time: '10:15 PM', fare: '₹710', status: 'filling' }
    ]
  },
  {
    id: 'UP14DL8765',
    operator: 'YoloBus Express',
    busName: 'Yolo Luxury Liner',
    source: 'Delhi',
    destination: 'Kanpur',
    departureTime: '10:30 PM',
    arrivalTime: '07:15 AM',
    duration: '8h 45m',
    price: 799,
    availableSeats: 15,
    busType: 'Volvo AC Sleeper',
    rating: '4.9 ★',
    amenities: ['⚡ Charging', '📶 Wi-Fi', '📺 Personal TV', '🥛 Mineral Water'],
    slots: [
      { time: '10:30 PM', fare: '₹799', status: 'available' },
      { time: '11:30 PM', fare: '₹849', status: 'filling' }
    ]
  },

  // Lucknow → Delhi
  {
    id: 'UP32LK1122',
    operator: 'Royal Comforts',
    busName: 'Royal Capital Express',
    source: 'Lucknow',
    destination: 'Delhi',
    departureTime: '08:00 PM',
    arrivalTime: '05:00 AM',
    duration: '9h 00m',
    price: 720,
    availableSeats: 14,
    busType: 'AC Multi-Axle Sleeper',
    rating: '4.8 ★',
    amenities: ['🛌 Blankets', '⚡ Charging', '𚰰 Mineral Water'],
    slots: [
      { time: '08:00 PM', fare: '₹720', status: 'available' },
      { time: '09:30 PM', fare: '₹760', status: 'filling' }
    ]
  },
  {
    id: 'UP32LK3344',
    operator: 'Feel Breeze Volvo',
    busName: 'Express Breeze',
    source: 'Lucknow',
    destination: 'Delhi',
    departureTime: '09:30 PM',
    arrivalTime: '06:15 AM',
    duration: '8h 45m',
    price: 850,
    availableSeats: 22,
    busType: 'Volvo AC Seater',
    rating: '4.9 ★',
    amenities: ['⚡ Charging', '📶 Wi-Fi', '❄️ Climate Control'],
    slots: [
      { time: '09:30 PM', fare: '₹850', status: 'available' },
      { time: '10:45 PM', fare: '₹890', status: 'available' }
    ]
  },

  // Delhi → Lucknow
  {
    id: 'UP14DL5566',
    operator: 'Royal Comforts',
    busName: 'Royal City Liner',
    source: 'Delhi',
    destination: 'Lucknow',
    departureTime: '08:30 PM',
    arrivalTime: '05:30 AM',
    duration: '9h 00m',
    price: 740,
    availableSeats: 16,
    busType: 'AC Sleeper 2+1',
    rating: '4.7 ★',
    amenities: ['🛌 Blankets', '⚡ Charging', '📶 Free Wi-Fi'],
    slots: [
      { time: '08:30 PM', fare: '₹740', status: 'available' },
      { time: '10:00 PM', fare: '₹780', status: 'filling' }
    ]
  },

  // Kanpur → Lucknow
  {
    id: 'UP78KL7788',
    operator: 'Intercity Connect',
    busName: 'Ganga Express Intercity',
    source: 'Kanpur',
    destination: 'Lucknow',
    departureTime: '07:00 AM',
    arrivalTime: '09:00 AM',
    duration: '2h 00m',
    price: 250,
    availableSeats: 30,
    busType: 'AC Seater 2+2',
    rating: '4.5 ★',
    amenities: ['⚡ Charging', '💺 Comfortable Recliners'],
    slots: [
      { time: '07:00 AM', fare: '₹250', status: 'available' },
      { time: '11:00 AM', fare: '₹250', status: 'available' },
      { time: '04:00 PM', fare: '₹280', status: 'filling' }
    ]
  },
  {
    id: 'UP78KL9900',
    operator: 'GoRide Express',
    busName: 'Kanpur Shuttle',
    source: 'Kanpur',
    destination: 'Lucknow',
    departureTime: '08:30 AM',
    arrivalTime: '10:30 AM',
    duration: '2h 00m',
    price: 220,
    availableSeats: 25,
    busType: 'Non-AC Seater 2+2',
    rating: '4.4 ★',
    amenities: ['🧳 Extra Luggage Space', '🪟 Window Views'],
    slots: [
      { time: '08:30 AM', fare: '₹220', status: 'available' },
      { time: '01:30 PM', fare: '₹220', status: 'available' }
    ]
  },

  // Lucknow → Kanpur
  {
    id: 'UP32LK7711',
    operator: 'Intercity Connect',
    busName: 'Awadh Intercity',
    source: 'Lucknow',
    destination: 'Kanpur',
    departureTime: '06:30 AM',
    arrivalTime: '08:30 AM',
    duration: '2h 00m',
    price: 250,
    availableSeats: 28,
    busType: 'AC Seater 2+2',
    rating: '4.6 ★',
    amenities: ['⚡ Charging', '💺 Reclining Seats'],
    slots: [
      { time: '06:30 AM', fare: '₹250', status: 'available' },
      { time: '10:30 AM', fare: '₹250', status: 'available' },
      { time: '05:30 PM', fare: '₹280', status: 'filling' }
    ]
  },

  // Jaipur → Delhi
  {
    id: 'RJ14JP1234',
    operator: 'PinkCity Travels',
    busName: 'PinkCity Superfast',
    source: 'Jaipur',
    destination: 'Delhi',
    departureTime: '06:00 AM',
    arrivalTime: '11:00 AM',
    duration: '5h 00m',
    price: 499,
    availableSeats: 20,
    busType: 'AC Sleeper / Seater',
    rating: '4.7 ★',
    amenities: ['⚡ Charging', '🥛 Water Bottle', '📶 Wi-Fi'],
    slots: [
      { time: '06:00 AM', fare: '₹499', status: 'available' },
      { time: '02:00 PM', fare: '₹549', status: 'filling' }
    ]
  },

  // Delhi → Jaipur
  {
    id: 'DL01DJ5678',
    operator: 'PinkCity Travels',
    busName: 'Rajdhani Express Bus',
    source: 'Delhi',
    destination: 'Jaipur',
    departureTime: '07:30 AM',
    arrivalTime: '12:30 PM',
    duration: '5h 00m',
    price: 520,
    availableSeats: 26,
    busType: 'Volvo AC Multi-Axle',
    rating: '4.8 ★',
    amenities: ['⚡ Charging', '📶 Wi-Fi', '❄️ Climate Control'],
    slots: [
      { time: '07:30 AM', fare: '₹520', status: 'available' },
      { time: '03:30 PM', fare: '₹570', status: 'filling' }
    ]
  },

  // Mumbai → Pune
  {
    id: 'MH12MP9999',
    operator: 'Deccan Express',
    busName: 'Expressway Flyer',
    source: 'Mumbai',
    destination: 'Pune',
    departureTime: '07:00 AM',
    arrivalTime: '10:30 AM',
    duration: '3h 30m',
    price: 450,
    availableSeats: 15,
    busType: 'AC Seater 2+2',
    rating: '4.8 ★',
    amenities: ['⚡ Charging', '📶 Wi-Fi', '🥛 Water Bottle'],
    slots: [
      { time: '07:00 AM', fare: '₹450', status: 'available' },
      { time: '11:00 AM', fare: '₹450', status: 'filling' }
    ]
  },

  // Pune → Mumbai
  {
    id: 'MH14PM1122',
    operator: 'Deccan Express',
    busName: 'Western Ghats Superfast',
    source: 'Pune',
    destination: 'Mumbai',
    departureTime: '06:30 AM',
    arrivalTime: '10:00 AM',
    duration: '3h 30m',
    price: 450,
    availableSeats: 22,
    busType: 'AC Seater 2+2',
    rating: '4.7 ★',
    amenities: ['⚡ Charging', '📶 Wi-Fi', '🥛 Packaged Water'],
    slots: [
      { time: '06:30 AM', fare: '₹450', status: 'available' },
      { time: '02:00 PM', fare: '₹480', status: 'filling' }
    ]
  },

  // Hyderabad → Bangalore
  {
    id: 'TS09HB3344',
    operator: 'Southern Express',
    busName: 'Cyber Royal Sleeper',
    source: 'Hyderabad',
    destination: 'Bangalore',
    departureTime: '09:30 PM',
    arrivalTime: '06:30 AM',
    duration: '9h 00m',
    price: 890,
    availableSeats: 16,
    busType: 'Volvo AC Sleeper',
    rating: '4.8 ★',
    amenities: ['⚡ Charging', '📶 Free Wi-Fi', '🛌 Clean Blankets'],
    slots: [
      { time: '09:30 PM', fare: '₹890', status: 'available' },
      { time: '11:00 PM', fare: '₹940', status: 'filling' }
    ]
  },

  // Delhi → Manali
  {
    id: 'HP01DM1001',
    operator: 'Zingbus Plus',
    busName: 'Himalayan Luxury 9600',
    source: 'Delhi',
    destination: 'Manali',
    departureTime: '06:30 PM',
    arrivalTime: '08:00 AM',
    duration: '13h 30m',
    price: 1299,
    availableSeats: 14,
    busType: 'Volvo AC Multi-Axle Sleeper',
    rating: '4.8 ★',
    amenities: ['⚡ Charging', '📶 Wi-Fi', '🛌 Heated Blankets', '🥛 Mineral Water', '☕ Hot Beverage'],
    slots: [
      { time: '06:30 PM', fare: '₹1299', status: 'available' },
      { time: '08:00 PM', fare: '₹1399', status: 'filling' }
    ]
  },
  {
    id: 'HP01DM1002',
    operator: 'HRTC Himgaurav',
    busName: 'Himachal Express Volvo',
    source: 'Delhi',
    destination: 'Manali',
    departureTime: '07:45 PM',
    arrivalTime: '09:15 AM',
    duration: '13h 30m',
    price: 1150,
    availableSeats: 18,
    busType: 'AC Semi-Sleeper 2+2',
    rating: '4.7 ★',
    amenities: ['⚡ Charging', '🥛 Mineral Water', '💺 Pushback Seats'],
    slots: [
      { time: '07:45 PM', fare: '₹1150', status: 'available' },
      { time: '09:15 PM', fare: '₹1200', status: 'available' }
    ]
  },
  // Manali → Delhi
  {
    id: 'HP01MD2001',
    operator: 'Zingbus Plus',
    busName: 'Capital Return Express',
    source: 'Manali',
    destination: 'Delhi',
    departureTime: '05:30 PM',
    arrivalTime: '07:00 AM',
    duration: '13h 30m',
    price: 1299,
    availableSeats: 12,
    busType: 'Volvo AC Multi-Axle Sleeper',
    rating: '4.9 ★',
    amenities: ['⚡ Charging', '📶 Free Wi-Fi', '🛌 Clean Linen'],
    slots: [
      { time: '05:30 PM', fare: '₹1299', status: 'available' },
      { time: '07:00 PM', fare: '₹1349', status: 'filling' }
    ]
  },

  // Delhi → Dehradun
  {
    id: 'UK07DD3001',
    operator: 'UTC Volvo Superfast',
    busName: 'Valley Express',
    source: 'Delhi',
    destination: 'Dehradun',
    departureTime: '06:00 AM',
    arrivalTime: '11:30 AM',
    duration: '5h 30m',
    price: 590,
    availableSeats: 24,
    busType: 'Volvo AC Seater',
    rating: '4.8 ★',
    amenities: ['⚡ Charging', '📶 Wi-Fi', '🥛 Packaged Water'],
    slots: [
      { time: '06:00 AM', fare: '₹590', status: 'available' },
      { time: '01:30 PM', fare: '₹590', status: 'available' },
      { time: '11:00 PM', fare: '₹650', status: 'filling' }
    ]
  },
  // Dehradun → Delhi
  {
    id: 'UK07DD3002',
    operator: 'IntrCity SmartBus',
    busName: 'Doon Capital Flyer',
    source: 'Dehradun',
    destination: 'Delhi',
    departureTime: '07:00 AM',
    arrivalTime: '12:30 PM',
    duration: '5h 30m',
    price: 580,
    availableSeats: 20,
    busType: 'AC Seater 2+2',
    rating: '4.7 ★',
    amenities: ['⚡ Charging', '🥛 Water Bottle', '🛋️ Reclining Seats'],
    slots: [
      { time: '07:00 AM', fare: '₹580', status: 'available' },
      { time: '03:00 PM', fare: '₹620', status: 'available' }
    ]
  },

  // Delhi → Agra
  {
    id: 'UP80DA4001',
    operator: 'Taj Expressways',
    busName: 'Yamuna Velocity AC',
    source: 'Delhi',
    destination: 'Agra',
    departureTime: '06:30 AM',
    arrivalTime: '10:00 AM',
    duration: '3h 30m',
    price: 349,
    availableSeats: 28,
    busType: 'AC Seater 2+2',
    rating: '4.6 ★',
    amenities: ['⚡ Charging', '❄️ AC', '💺 Pushback Seats'],
    slots: [
      { time: '06:30 AM', fare: '₹349', status: 'available' },
      { time: '11:00 AM', fare: '₹349', status: 'available' },
      { time: '05:30 PM', fare: '₹380', status: 'filling' }
    ]
  },
  // Agra → Delhi
  {
    id: 'UP80AD4002',
    operator: 'UPSRTC Platinum',
    busName: 'Heritage Express',
    source: 'Agra',
    destination: 'Delhi',
    departureTime: '07:30 AM',
    arrivalTime: '11:00 AM',
    duration: '3h 30m',
    price: 349,
    availableSeats: 22,
    busType: 'AC Seater 2+2',
    rating: '4.6 ★',
    amenities: ['⚡ Charging', '🥛 Mineral Water'],
    slots: [
      { time: '07:30 AM', fare: '₹349', status: 'available' },
      { time: '02:00 PM', fare: '₹370', status: 'available' }
    ]
  },

  // Delhi → Chandigarh
  {
    id: 'CH01DC5001',
    operator: 'PRTC Super Luxury',
    busName: 'City Beautiful Flyer',
    source: 'Delhi',
    destination: 'Chandigarh',
    departureTime: '07:00 AM',
    arrivalTime: '11:30 AM',
    duration: '4h 30m',
    price: 379,
    availableSeats: 26,
    busType: 'Volvo AC Multi-Axle',
    rating: '4.8 ★',
    amenities: ['⚡ Charging', '📶 Wi-Fi', '❄️ Climate Control'],
    slots: [
      { time: '07:00 AM', fare: '₹379', status: 'available' },
      { time: '01:00 PM', fare: '₹399', status: 'available' },
      { time: '07:00 PM', fare: '₹420', status: 'filling' }
    ]
  },
  // Chandigarh → Delhi
  {
    id: 'CH01CD5002',
    operator: 'Zingbus Plus',
    busName: 'NH44 Superliner',
    source: 'Chandigarh',
    destination: 'Delhi',
    departureTime: '08:00 AM',
    arrivalTime: '12:30 PM',
    duration: '4h 30m',
    price: 389,
    availableSeats: 20,
    busType: 'Volvo AC Multi-Axle',
    rating: '4.7 ★',
    amenities: ['⚡ Charging', '📶 Wi-Fi', '🥛 Packaged Water'],
    slots: [
      { time: '08:00 AM', fare: '₹389', status: 'available' },
      { time: '03:30 PM', fare: '₹410', status: 'available' }
    ]
  },

  // Mumbai → Goa
  {
    id: 'GA01MG6001',
    operator: 'VRL Travels',
    busName: 'Konkan Coast Sleeper',
    source: 'Mumbai',
    destination: 'Goa',
    departureTime: '07:00 PM',
    arrivalTime: '07:30 AM',
    duration: '12h 30m',
    price: 999,
    availableSeats: 15,
    busType: 'AC Sleeper 2+1',
    rating: '4.8 ★',
    amenities: ['⚡ Charging', '📶 Wi-Fi', '🛌 Clean Bedding', '🥛 Water Bottle'],
    slots: [
      { time: '07:00 PM', fare: '₹999', status: 'available' },
      { time: '09:00 PM', fare: '₹1099', status: 'filling' }
    ]
  },
  // Goa → Mumbai
  {
    id: 'GA01GM6002',
    operator: 'Paulo Travels',
    busName: 'Holiday Return Sleeper',
    source: 'Goa',
    destination: 'Mumbai',
    departureTime: '06:30 PM',
    arrivalTime: '07:00 AM',
    duration: '12h 30m',
    price: 999,
    availableSeats: 18,
    busType: 'AC Sleeper 2+1',
    rating: '4.7 ★',
    amenities: ['⚡ Charging', '📶 Wi-Fi', '🛌 Bedding'],
    slots: [
      { time: '06:30 PM', fare: '₹999', status: 'available' },
      { time: '08:30 PM', fare: '₹1050', status: 'available' }
    ]
  },

  // Bangalore → Chennai
  {
    id: 'TN01BC7001',
    operator: 'KSRTC Airavat Club Class',
    busName: 'Silicon Express',
    source: 'Bangalore',
    destination: 'Chennai',
    departureTime: '06:30 AM',
    arrivalTime: '12:30 PM',
    duration: '6h 00m',
    price: 550,
    availableSeats: 30,
    busType: 'Volvo Multi-Axle AC',
    rating: '4.9 ★',
    amenities: ['⚡ Charging', '📶 Wi-Fi', '🥛 Packaged Water', '❄️ Climate Control'],
    slots: [
      { time: '06:30 AM', fare: '₹550', status: 'available' },
      { time: '02:00 PM', fare: '₹550', status: 'available' },
      { time: '11:00 PM', fare: '₹620', status: 'filling' }
    ]
  },
  // Chennai → Bangalore
  {
    id: 'TN01CB7002',
    operator: 'Parveen Travels',
    busName: 'Coromandel Express',
    source: 'Chennai',
    destination: 'Bangalore',
    departureTime: '07:00 AM',
    arrivalTime: '01:00 PM',
    duration: '6h 00m',
    price: 550,
    availableSeats: 25,
    busType: 'Volvo AC Seater',
    rating: '4.8 ★',
    amenities: ['⚡ Charging', '📶 Wi-Fi', '🥛 Packaged Water'],
    slots: [
      { time: '07:00 AM', fare: '₹550', status: 'available' },
      { time: '03:30 PM', fare: '₹590', status: 'available' }
    ]
  },

  // Bangalore → Goa
  {
    id: 'KA01BG8001',
    operator: 'VRL Travels',
    busName: 'Coastal Breeze Sleeper',
    source: 'Bangalore',
    destination: 'Goa',
    departureTime: '08:00 PM',
    arrivalTime: '07:00 AM',
    duration: '11h 00m',
    price: 850,
    availableSeats: 16,
    busType: 'AC Sleeper 2+1',
    rating: '4.7 ★',
    amenities: ['⚡ Charging', '🛌 Clean Bedding', '🥛 Water Bottle'],
    slots: [
      { time: '08:00 PM', fare: '₹850', status: 'available' },
      { time: '09:30 PM', fare: '₹900', status: 'filling' }
    ]
  },

  // Hyderabad → Vijayawada
  {
    id: 'AP16HV9001',
    operator: 'APSRTC Garuda Plus',
    busName: 'Amaravati Express',
    source: 'Hyderabad',
    destination: 'Vijayawada',
    departureTime: '06:00 AM',
    arrivalTime: '11:30 AM',
    duration: '5h 30m',
    price: 490,
    availableSeats: 24,
    busType: 'Volvo AC Multi-Axle',
    rating: '4.8 ★',
    amenities: ['⚡ Charging', '📶 Wi-Fi', '🥛 Mineral Water'],
    slots: [
      { time: '06:00 AM', fare: '₹490', status: 'available' },
      { time: '02:00 PM', fare: '₹490', status: 'available' },
      { time: '10:30 PM', fare: '₹540', status: 'filling' }
    ]
  },

  // Kolkata → Siliguri
  {
    id: 'WB01KS1001',
    operator: 'WBTC Volvo AC',
    busName: 'North Bengal Express',
    source: 'Kolkata',
    destination: 'Siliguri',
    departureTime: '07:00 PM',
    arrivalTime: '07:30 AM',
    duration: '12h 30m',
    price: 950,
    availableSeats: 20,
    busType: 'Volvo AC Multi-Axle Sleeper',
    rating: '4.7 ★',
    amenities: ['⚡ Charging', '📶 Wi-Fi', '🛌 Bedding', '🥛 Mineral Water'],
    slots: [
      { time: '07:00 PM', fare: '₹950', status: 'available' },
      { time: '08:30 PM', fare: '₹1020', status: 'filling' }
    ]
  },

  // Bhopal → Indore
  {
    id: 'MP04BI2001',
    operator: 'Chartered Bus',
    busName: 'Malwa Express',
    source: 'Bhopal',
    destination: 'Indore',
    departureTime: '07:00 AM',
    arrivalTime: '10:30 AM',
    duration: '3h 30m',
    price: 320,
    availableSeats: 32,
    busType: 'AC Seater 2+2',
    rating: '4.8 ★',
    amenities: ['⚡ Charging', '📶 Wi-Fi', '🥛 Water Bottle'],
    slots: [
      { time: '07:00 AM', fare: '₹320', status: 'available' },
      { time: '11:30 AM', fare: '₹320', status: 'available' },
      { time: '05:00 PM', fare: '₹350', status: 'filling' }
    ]
  },

  // Ahmedabad → Surat
  {
    id: 'GJ01AS3001',
    operator: 'GSRTC Gurjanagari',
    busName: 'Diamond Corridor AC',
    source: 'Ahmedabad',
    destination: 'Surat',
    departureTime: '06:30 AM',
    arrivalTime: '11:00 AM',
    duration: '4h 30m',
    price: 360,
    availableSeats: 28,
    busType: 'AC Seater 2+2',
    rating: '4.7 ★',
    amenities: ['⚡ Charging', '💺 Pushback Seats', '🥛 Water Bottle'],
    slots: [
      { time: '06:30 AM', fare: '₹360', status: 'available' },
      { time: '01:30 PM', fare: '₹360', status: 'available' },
      { time: '06:30 PM', fare: '₹390', status: 'filling' }
    ]
  },

  // Lucknow → Varanasi
  {
    id: 'UP32LV4001',
    operator: 'UPSRTC Goldline',
    busName: 'Kashi Vishwanath Express',
    source: 'Lucknow',
    destination: 'Varanasi',
    departureTime: '06:00 AM',
    arrivalTime: '11:30 AM',
    duration: '5h 30m',
    price: 449,
    availableSeats: 26,
    busType: 'AC Seater 2+2',
    rating: '4.7 ★',
    amenities: ['⚡ Charging', '💺 Reclining Seats', '🥛 Mineral Water'],
    slots: [
      { time: '06:00 AM', fare: '₹449', status: 'available' },
      { time: '02:00 PM', fare: '₹479', status: 'available' }
    ]
  }
];

