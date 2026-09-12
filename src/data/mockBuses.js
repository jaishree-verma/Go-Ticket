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

  // Bangalore → Hyderabad
  {
    id: 'KA01BH8888',
    operator: 'Southern Express',
    busName: 'Cyber Cruiser',
    source: 'Bangalore',
    destination: 'Hyderabad',
    departureTime: '09:00 PM',
    arrivalTime: '06:00 AM',
    duration: '9h 00m',
    price: 890,
    availableSeats: 19,
    busType: 'Volvo AC Sleeper',
    rating: '4.9 ★',
    amenities: ['⚡ Charging', '📶 Free Wi-Fi', '🛌 Premium Pillows'],
    slots: [
      { time: '09:00 PM', fare: '₹890', status: 'available' },
      { time: '10:30 PM', fare: '₹940', status: 'filling' }
    ]
  }
];
