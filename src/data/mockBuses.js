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
 rating: '4.8 ',
 amenities: [' Charging', ' Free Wi-Fi', ' Water Bottle', ' Reclining Seats'],
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
 rating: '4.9 ',
 amenities: [' Charging', ' Wi-Fi', ' Climate Control', ' Movies'],
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
 rating: '4.6 ',
 amenities: [' Charging', ' Pushback Seats', ' Emergency Kit'],
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
 rating: '4.7 ',
 amenities: [' Charging', ' Free Wi-Fi', ' Clean Blankets'],
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
 rating: '4.9 ',
 amenities: [' Charging', ' Wi-Fi', ' Personal TV', ' Mineral Water'],
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
 rating: '4.8 ',
 amenities: [' Blankets', ' Charging', '𚰰 Mineral Water'],
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
 rating: '4.9 ',
 amenities: [' Charging', ' Wi-Fi', ' Climate Control'],
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
 rating: '4.7 ',
 amenities: [' Blankets', ' Charging', ' Free Wi-Fi'],
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
 rating: '4.5 ',
 amenities: [' Charging', ' Comfortable Recliners'],
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
 rating: '4.4 ',
 amenities: [' Extra Luggage Space', ' Window Views'],
 slots: [
 { time: '08:30 AM', fare: '₹220', status: 'available' },
 { time: '01:30 PM', fare: '₹220', status: 'available' }
 ]
 },
 {
 id: 'UP78KL1122',
 operator: 'Awadh Sleeper Liner',
 busName: 'Lucknow Night Sleeper',
 source: 'Kanpur',
 destination: 'Lucknow',
 departureTime: '07:30 PM',
 arrivalTime: '09:45 PM',
 duration: '2h 15m',
 price: 450,
 availableSeats: 16,
 busType: 'AC Sleeper 2+1',
 rating: '4.7 ',
 amenities: [' Charging', ' Wi-Fi', ' Clean Blankets'],
 slots: [
 { time: '07:30 PM', fare: '₹450', status: 'available' },
 { time: '09:30 PM', fare: '₹490', status: 'available' }
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
 rating: '4.6 ',
 amenities: [' Charging', ' Reclining Seats'],
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
 rating: '4.7 ',
 amenities: [' Charging', ' Water Bottle', ' Wi-Fi'],
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
 rating: '4.8 ',
 amenities: [' Charging', ' Wi-Fi', ' Climate Control'],
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
 rating: '4.8 ',
 amenities: [' Charging', ' Wi-Fi', ' Water Bottle'],
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
 rating: '4.7 ',
 amenities: [' Charging', ' Wi-Fi', ' Packaged Water'],
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
 rating: '4.8 ',
 amenities: [' Charging', ' Free Wi-Fi', ' Clean Blankets'],
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
 rating: '4.8 ',
 amenities: [' Charging', ' Wi-Fi', ' Heated Blankets', ' Mineral Water', ' Hot Beverage'],
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
 rating: '4.7 ',
 amenities: [' Charging', ' Mineral Water', ' Pushback Seats'],
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
 rating: '4.9 ',
 amenities: [' Charging', ' Free Wi-Fi', ' Clean Linen'],
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
 rating: '4.8 ',
 amenities: [' Charging', ' Wi-Fi', ' Packaged Water'],
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
 rating: '4.7 ',
 amenities: [' Charging', ' Water Bottle', ' Reclining Seats'],
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
 rating: '4.6 ',
 amenities: [' Charging', ' AC', ' Pushback Seats'],
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
 rating: '4.6 ',
 amenities: [' Charging', ' Mineral Water'],
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
 rating: '4.8 ',
 amenities: [' Charging', ' Wi-Fi', ' Climate Control'],
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
 rating: '4.7 ',
 amenities: [' Charging', ' Wi-Fi', ' Packaged Water'],
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
 rating: '4.8 ',
 amenities: [' Charging', ' Wi-Fi', ' Clean Bedding', ' Water Bottle'],
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
 rating: '4.7 ',
 amenities: [' Charging', ' Wi-Fi', ' Bedding'],
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
 rating: '4.9 ',
 amenities: [' Charging', ' Wi-Fi', ' Packaged Water', ' Climate Control'],
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
 rating: '4.8 ',
 amenities: [' Charging', ' Wi-Fi', ' Packaged Water'],
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
 rating: '4.7 ',
 amenities: [' Charging', ' Clean Bedding', ' Water Bottle'],
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
 rating: '4.8 ',
 amenities: [' Charging', ' Wi-Fi', ' Mineral Water'],
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
 rating: '4.7 ',
 amenities: [' Charging', ' Wi-Fi', ' Bedding', ' Mineral Water'],
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
 rating: '4.8 ',
 amenities: [' Charging', ' Wi-Fi', ' Water Bottle'],
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
 rating: '4.7 ',
 amenities: [' Charging', ' Pushback Seats', ' Water Bottle'],
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
 rating: '4.7 ',
 amenities: [' Charging', ' Reclining Seats', ' Mineral Water'],
 slots: [
 { time: '06:00 AM', fare: '₹449', status: 'available' },
 { time: '02:00 PM', fare: '₹479', status: 'available' }
 ]
 }
,

 {
 "id": "UP32LK5566",
 "busId": "UP32LK5566",
 "operator": "Awadh Janrath Express",
 "operatorName": "Awadh Janrath Express",
 "busName": "Janrath Night Rider",
 "source": "Lucknow",
 "destination": "Delhi",
 "departureTime": "11:00 PM",
 "arrivalTime": "07:30 AM",
 "duration": "8h 30m",
 "price": 649,
 "availableSeats": 28,
 "totalSeats": 40,
 "busType": "AC Seater 2+2",
 "rating": "4.6 ",
 "amenities": [
 " Charging",
 " Reclining Seats",
 " Water Bottle"
 ],
 "boardingPoints": [
 {
 "location": "Alambagh ISBT, Lucknow",
 "time": "11:00 PM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Sarai Kale Khan, Delhi",
 "time": "07:30 AM"
 }
 ],
 "slots": [
 {
 "time": "11:00 PM",
 "fare": "₹649",
 "status": "available"
 },
 {
 "time": "11:45 PM",
 "fare": "₹680",
 "status": "available"
 }
 ]
 },

 {
 "id": "UP14DL9988",
 "busId": "UP14DL9988",
 "operator": "IntrCity SmartBus",
 "operatorName": "IntrCity SmartBus",
 "busName": "SmartBus Club Class",
 "source": "Delhi",
 "destination": "Lucknow",
 "departureTime": "09:45 PM",
 "arrivalTime": "06:15 AM",
 "duration": "8h 30m",
 "price": 899,
 "availableSeats": 21,
 "totalSeats": 40,
 "busType": "Volvo AC Sleeper",
 "rating": "4.9 ",
 "amenities": [
 " Charging",
 " Wi-Fi",
 " Coffee & Snacks",
 " Sanitized Bedding"
 ],
 "boardingPoints": [
 {
 "location": "Anand Vihar, Delhi",
 "time": "09:45 PM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Charbagh / Alambagh, Lucknow",
 "time": "06:15 AM"
 }
 ],
 "slots": [
 {
 "time": "09:45 PM",
 "fare": "₹899",
 "status": "available"
 },
 {
 "time": "10:45 PM",
 "fare": "₹950",
 "status": "available"
 }
 ]
 },

 {
 "id": "UP32LK8822",
 "busId": "UP32LK8822",
 "operator": "Ganga Express",
 "operatorName": "Ganga Express",
 "busName": "Kanpur Superfast",
 "source": "Lucknow",
 "destination": "Kanpur",
 "departureTime": "05:30 PM",
 "arrivalTime": "07:30 PM",
 "duration": "2h 00m",
 "price": 230,
 "availableSeats": 32,
 "totalSeats": 40,
 "busType": "AC Seater 2+2",
 "rating": "4.5 ",
 "amenities": [
 " Charging",
 " Pushback Seats"
 ],
 "boardingPoints": [
 {
 "location": "Charbagh, Lucknow",
 "time": "05:30 PM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Rama Devi Flyover, Kanpur",
 "time": "07:30 PM"
 }
 ],
 "slots": [
 {
 "time": "05:30 PM",
 "fare": "₹230",
 "status": "available"
 },
 {
 "time": "08:00 PM",
 "fare": "₹260",
 "status": "available"
 }
 ]
 },

 {
 "id": "DL01DJ9012",
 "busId": "DL01DJ9012",
 "operator": "Goldline Super",
 "operatorName": "Goldline Super",
 "busName": "Jaipur Highway Cruiser",
 "source": "Delhi",
 "destination": "Jaipur",
 "departureTime": "11:00 PM",
 "arrivalTime": "04:30 AM",
 "duration": "5h 30m",
 "price": 650,
 "availableSeats": 19,
 "totalSeats": 40,
 "busType": "AC Sleeper 2+1",
 "rating": "4.7 ",
 "amenities": [
 " Charging",
 " Sanitized Blankets",
 " Mineral Water"
 ],
 "boardingPoints": [
 {
 "location": "Kashmere Gate ISBT, Delhi",
 "time": "11:00 PM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Narayan Singh Circle, Jaipur",
 "time": "04:30 AM"
 }
 ],
 "slots": [
 {
 "time": "11:00 PM",
 "fare": "₹650",
 "status": "available"
 }
 ]
 },

 {
 "id": "RJ14JP5678",
 "busId": "RJ14JP5678",
 "operator": "RSRTC Gold",
 "operatorName": "RSRTC Gold",
 "busName": "Heritage Volvo Liner",
 "source": "Jaipur",
 "destination": "Delhi",
 "departureTime": "05:30 PM",
 "arrivalTime": "10:30 PM",
 "duration": "5h 00m",
 "price": 550,
 "availableSeats": 24,
 "totalSeats": 40,
 "busType": "Volvo AC Multi-Axle",
 "rating": "4.8 ",
 "amenities": [
 " Charging",
 " Wi-Fi",
 " Pushback Seats"
 ],
 "boardingPoints": [
 {
 "location": "Polo Victory, Jaipur",
 "time": "05:30 PM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Sarai Kale Khan, Delhi",
 "time": "10:30 PM"
 }
 ],
 "slots": [
 {
 "time": "05:30 PM",
 "fare": "₹550",
 "status": "available"
 }
 ]
 },

 {
 "id": "DL04CH1100",
 "busId": "DL04CH1100",
 "operator": "Chandigarh Holidayers",
 "operatorName": "Chandigarh Holidayers",
 "busName": "City Beautiful Express",
 "source": "Delhi",
 "destination": "Chandigarh",
 "departureTime": "06:30 AM",
 "arrivalTime": "11:15 AM",
 "duration": "4h 45m",
 "price": 480,
 "availableSeats": 27,
 "totalSeats": 40,
 "busType": "Volvo AC Multi-Axle",
 "rating": "4.8 ",
 "amenities": [
 " Charging",
 " Wi-Fi",
 " Mineral Water"
 ],
 "boardingPoints": [
 {
 "location": "Kashmere Gate ISBT, Delhi",
 "time": "06:30 AM"
 },
 {
 "location": "Majnu Ka Tilla",
 "time": "06:45 AM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Sector 43 ISBT, Chandigarh",
 "time": "11:15 AM"
 }
 ],
 "slots": [
 {
 "time": "06:30 AM",
 "fare": "₹480",
 "status": "available"
 },
 {
 "time": "01:30 PM",
 "fare": "₹510",
 "status": "available"
 }
 ]
 },

 {
 "id": "CH01DL2200",
 "busId": "CH01DL2200",
 "operator": "PUNBUS Platinum",
 "operatorName": "PUNBUS Platinum",
 "busName": "Chandigarh Delhi Fastliner",
 "source": "Chandigarh",
 "destination": "Delhi",
 "departureTime": "07:00 AM",
 "arrivalTime": "11:45 AM",
 "duration": "4h 45m",
 "price": 460,
 "availableSeats": 25,
 "totalSeats": 40,
 "busType": "AC Seater 2+2",
 "rating": "4.7 ",
 "amenities": [
 " Charging",
 " Reclining Seats",
 " AC"
 ],
 "boardingPoints": [
 {
 "location": "Sector 43 ISBT, Chandigarh",
 "time": "07:00 AM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Kashmere Gate ISBT, Delhi",
 "time": "11:45 AM"
 }
 ],
 "slots": [
 {
 "time": "07:00 AM",
 "fare": "₹460",
 "status": "available"
 },
 {
 "time": "03:00 PM",
 "fare": "₹490",
 "status": "available"
 }
 ]
 },

 {
 "id": "DL01AG3300",
 "busId": "DL01AG3300",
 "operator": "Taj Expresslines",
 "operatorName": "Taj Expresslines",
 "busName": "Taj Corridor Superfast",
 "source": "Delhi",
 "destination": "Agra",
 "departureTime": "07:00 AM",
 "arrivalTime": "10:30 AM",
 "duration": "3h 30m",
 "price": 399,
 "availableSeats": 28,
 "totalSeats": 40,
 "busType": "AC Seater 2+2",
 "rating": "4.6 ",
 "amenities": [
 " Charging",
 " Pushback Seats"
 ],
 "boardingPoints": [
 {
 "location": "Sarai Kale Khan, Delhi",
 "time": "07:00 AM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Idgah Bus Stand, Agra",
 "time": "10:30 AM"
 }
 ],
 "slots": [
 {
 "time": "07:00 AM",
 "fare": "₹399",
 "status": "available"
 },
 {
 "time": "02:00 PM",
 "fare": "₹420",
 "status": "available"
 }
 ]
 },

 {
 "id": "UP80DL4400",
 "busId": "UP80DL4400",
 "operator": "Yamuna Expressway Fleet",
 "operatorName": "Yamuna Expressway Fleet",
 "busName": "Yamuna Jet Liner",
 "source": "Agra",
 "destination": "Delhi",
 "departureTime": "08:00 AM",
 "arrivalTime": "11:30 AM",
 "duration": "3h 30m",
 "price": 410,
 "availableSeats": 26,
 "totalSeats": 40,
 "busType": "AC Seater 2+2",
 "rating": "4.7 ",
 "amenities": [
 " Charging",
 " Free Wi-Fi"
 ],
 "boardingPoints": [
 {
 "location": "ISBT Agra",
 "time": "08:00 AM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Kashmere Gate ISBT, Delhi",
 "time": "11:30 AM"
 }
 ],
 "slots": [
 {
 "time": "08:00 AM",
 "fare": "₹410",
 "status": "available"
 }
 ]
 },

 {
 "id": "UP78AG5500",
 "busId": "UP78AG5500",
 "operator": "Bundelkhand Royal",
 "operatorName": "Bundelkhand Royal",
 "busName": "Taj Link Express",
 "source": "Kanpur",
 "destination": "Agra",
 "departureTime": "08:00 AM",
 "arrivalTime": "01:00 PM",
 "duration": "5h 00m",
 "price": 480,
 "availableSeats": 22,
 "totalSeats": 40,
 "busType": "AC Seater 2+2",
 "rating": "4.6 ",
 "amenities": [
 " Charging",
 " Reclining Seats",
 " Water Bottle"
 ],
 "boardingPoints": [
 {
 "location": "Jhakarkati Bus Terminal, Kanpur",
 "time": "08:00 AM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Idgah Bus Stand, Agra",
 "time": "01:00 PM"
 }
 ],
 "slots": [
 {
 "time": "08:00 AM",
 "fare": "₹480",
 "status": "available"
 }
 ]
 },

 {
 "id": "UP80KN6600",
 "busId": "UP80KN6600",
 "operator": "Bundelkhand Royal",
 "operatorName": "Bundelkhand Royal",
 "busName": "Kanpur Heritage Liner",
 "source": "Agra",
 "destination": "Kanpur",
 "departureTime": "03:00 PM",
 "arrivalTime": "08:00 PM",
 "duration": "5h 00m",
 "price": 490,
 "availableSeats": 24,
 "totalSeats": 40,
 "busType": "AC Seater 2+2",
 "rating": "4.6 ",
 "amenities": [
 " Charging",
 " Reclining Seats"
 ],
 "boardingPoints": [
 {
 "location": "Idgah Bus Stand, Agra",
 "time": "03:00 PM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Jhakarkati Bus Terminal, Kanpur",
 "time": "08:00 PM"
 }
 ],
 "slots": [
 {
 "time": "03:00 PM",
 "fare": "₹490",
 "status": "available"
 }
 ]
 },

 {
 "id": "UP32AG7700",
 "busId": "UP32AG7700",
 "operator": "Expressway Cruiser",
 "operatorName": "Expressway Cruiser",
 "busName": "Agra Lucknow Expressway Star",
 "source": "Lucknow",
 "destination": "Agra",
 "departureTime": "06:30 AM",
 "arrivalTime": "11:00 AM",
 "duration": "4h 30m",
 "price": 520,
 "availableSeats": 29,
 "totalSeats": 40,
 "busType": "Volvo AC Multi-Axle",
 "rating": "4.8 ",
 "amenities": [
 " Charging",
 " Wi-Fi",
 " Climate Control"
 ],
 "boardingPoints": [
 {
 "location": "Alambagh ISBT, Lucknow",
 "time": "06:30 AM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Water Works Chauraha, Agra",
 "time": "11:00 AM"
 }
 ],
 "slots": [
 {
 "time": "06:30 AM",
 "fare": "₹520",
 "status": "available"
 }
 ]
 },

 {
 "id": "UP80LK8800",
 "busId": "UP80LK8800",
 "operator": "Expressway Cruiser",
 "operatorName": "Expressway Cruiser",
 "busName": "Nawab City Express",
 "source": "Agra",
 "destination": "Lucknow",
 "departureTime": "04:00 PM",
 "arrivalTime": "08:30 PM",
 "duration": "4h 30m",
 "price": 520,
 "availableSeats": 25,
 "totalSeats": 40,
 "busType": "Volvo AC Multi-Axle",
 "rating": "4.8 ",
 "amenities": [
 " Charging",
 " Wi-Fi"
 ],
 "boardingPoints": [
 {
 "location": "Water Works, Agra",
 "time": "04:00 PM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Alambagh ISBT, Lucknow",
 "time": "08:30 PM"
 }
 ],
 "slots": [
 {
 "time": "04:00 PM",
 "fare": "₹520",
 "status": "available"
 }
 ]
 },

 {
 "id": "DL01DD1122",
 "busId": "DL01DD1122",
 "operator": "Doon Valley Travels",
 "operatorName": "Doon Valley Travels",
 "busName": "Doon Super Express",
 "source": "Delhi",
 "destination": "Dehradun",
 "departureTime": "07:00 AM",
 "arrivalTime": "01:00 PM",
 "duration": "6h 00m",
 "price": 550,
 "availableSeats": 21,
 "totalSeats": 40,
 "busType": "AC Sleeper / Seater",
 "rating": "4.7 ",
 "amenities": [
 " Charging",
 " Wi-Fi",
 " Scenic View Seats"
 ],
 "boardingPoints": [
 {
 "location": "Kashmere Gate ISBT, Delhi",
 "time": "07:00 AM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Dehradun ISBT",
 "time": "01:00 PM"
 }
 ],
 "slots": [
 {
 "time": "07:00 AM",
 "fare": "₹550",
 "status": "available"
 }
 ]
 },

 {
 "id": "UK07DL2233",
 "busId": "UK07DL2233",
 "operator": "Uttarakhand Star",
 "operatorName": "Uttarakhand Star",
 "busName": "Capital Doon Flyer",
 "source": "Dehradun",
 "destination": "Delhi",
 "departureTime": "03:00 PM",
 "arrivalTime": "09:00 PM",
 "duration": "6h 00m",
 "price": 570,
 "availableSeats": 23,
 "totalSeats": 40,
 "busType": "Volvo AC Multi-Axle",
 "rating": "4.8 ",
 "amenities": [
 " Charging",
 " AC",
 " Water Bottle"
 ],
 "boardingPoints": [
 {
 "location": "Dehradun ISBT",
 "time": "03:00 PM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Kashmere Gate ISBT, Delhi",
 "time": "09:00 PM"
 }
 ],
 "slots": [
 {
 "time": "03:00 PM",
 "fare": "₹570",
 "status": "available"
 }
 ]
 },

 {
 "id": "DL01HD3344",
 "busId": "DL01HD3344",
 "operator": "Ganga Darshan Travels",
 "operatorName": "Ganga Darshan Travels",
 "busName": "Haridwar Teerth Express",
 "source": "Delhi",
 "destination": "Haridwar",
 "departureTime": "06:00 AM",
 "arrivalTime": "11:30 AM",
 "duration": "5h 30m",
 "price": 490,
 "availableSeats": 26,
 "totalSeats": 40,
 "busType": "AC Seater 2+2",
 "rating": "4.7 ",
 "amenities": [
 " Charging",
 " Reclining Seats",
 " Water Bottle"
 ],
 "boardingPoints": [
 {
 "location": "Kashmere Gate ISBT, Delhi",
 "time": "06:00 AM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Haridwar Bus Stand near Har Ki Pauri",
 "time": "11:30 AM"
 }
 ],
 "slots": [
 {
 "time": "06:00 AM",
 "fare": "₹490",
 "status": "available"
 }
 ]
 },

 {
 "id": "UK08DL4455",
 "busId": "UK08DL4455",
 "operator": "Ganga Darshan Travels",
 "operatorName": "Ganga Darshan Travels",
 "busName": "Holy Ganga Return",
 "source": "Haridwar",
 "destination": "Delhi",
 "departureTime": "04:00 PM",
 "arrivalTime": "09:30 PM",
 "duration": "5h 30m",
 "price": 490,
 "availableSeats": 22,
 "totalSeats": 40,
 "busType": "AC Seater 2+2",
 "rating": "4.7 ",
 "amenities": [
 " Charging",
 " Reclining Seats"
 ],
 "boardingPoints": [
 {
 "location": "Haridwar Bus Stand",
 "time": "04:00 PM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Kashmere Gate ISBT, Delhi",
 "time": "09:30 PM"
 }
 ],
 "slots": [
 {
 "time": "04:00 PM",
 "fare": "₹490",
 "status": "available"
 }
 ]
 },

 {
 "id": "DL01AS5566",
 "busId": "DL01AS5566",
 "operator": "Golden Temple Express",
 "operatorName": "Golden Temple Express",
 "busName": "Amritsar Grand Volvo",
 "source": "Delhi",
 "destination": "Amritsar",
 "departureTime": "09:00 PM",
 "arrivalTime": "06:00 AM",
 "duration": "9h 00m",
 "price": 890,
 "availableSeats": 17,
 "totalSeats": 40,
 "busType": "Volvo AC Sleeper",
 "rating": "4.9 ",
 "amenities": [
 " Charging",
 " Wi-Fi",
 " Premium Blankets",
 " Mineral Water"
 ],
 "boardingPoints": [
 {
 "location": "Majnu Ka Tilla, Delhi",
 "time": "09:00 PM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Amritsar Bus Stand",
 "time": "06:00 AM"
 }
 ],
 "slots": [
 {
 "time": "09:00 PM",
 "fare": "₹890",
 "status": "available"
 }
 ]
 },

 {
 "id": "PB02DL6677",
 "busId": "PB02DL6677",
 "operator": "Punjab Roadways Volvo",
 "operatorName": "Punjab Roadways Volvo",
 "busName": "Amritsar Capital Liner",
 "source": "Amritsar",
 "destination": "Delhi",
 "departureTime": "08:30 PM",
 "arrivalTime": "05:30 AM",
 "duration": "9h 00m",
 "price": 850,
 "availableSeats": 20,
 "totalSeats": 40,
 "busType": "Volvo AC Sleeper",
 "rating": "4.8 ",
 "amenities": [
 " Charging",
 " Wi-Fi",
 " Blankets"
 ],
 "boardingPoints": [
 {
 "location": "Amritsar Bus Stand",
 "time": "08:30 PM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Kashmere Gate ISBT, Delhi",
 "time": "05:30 AM"
 }
 ],
 "slots": [
 {
 "time": "08:30 PM",
 "fare": "₹850",
 "status": "available"
 }
 ]
 },

 {
 "id": "UP65LK1100",
 "busId": "UP65LK1100",
 "operator": "Kashi Vishwanath Travels",
 "operatorName": "Kashi Vishwanath Travels",
 "busName": "Kashi Awadh Express",
 "source": "Varanasi",
 "destination": "Lucknow",
 "departureTime": "07:30 AM",
 "arrivalTime": "01:30 PM",
 "duration": "6h 00m",
 "price": 490,
 "availableSeats": 24,
 "totalSeats": 40,
 "busType": "AC Seater 2+2",
 "rating": "4.6 ",
 "amenities": [
 " Charging",
 " Reclining Seats",
 " Water Bottle"
 ],
 "boardingPoints": [
 {
 "location": "Cantt Bus Station, Varanasi",
 "time": "07:30 AM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Alambagh ISBT, Lucknow",
 "time": "01:30 PM"
 }
 ],
 "slots": [
 {
 "time": "07:30 AM",
 "fare": "₹490",
 "status": "available"
 }
 ]
 },

 {
 "id": "UP32VN2200",
 "busId": "UP32VN2200",
 "operator": "Kashi Vishwanath Travels",
 "operatorName": "Kashi Vishwanath Travels",
 "busName": "Awadh Kashi Superfast",
 "source": "Lucknow",
 "destination": "Varanasi",
 "departureTime": "02:30 PM",
 "arrivalTime": "08:30 PM",
 "duration": "6h 00m",
 "price": 510,
 "availableSeats": 26,
 "totalSeats": 40,
 "busType": "AC Seater 2+2",
 "rating": "4.7 ",
 "amenities": [
 " Charging",
 " Reclining Seats"
 ],
 "boardingPoints": [
 {
 "location": "Charbagh, Lucknow",
 "time": "02:30 PM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Cantt Bus Station, Varanasi",
 "time": "08:30 PM"
 }
 ],
 "slots": [
 {
 "time": "02:30 PM",
 "fare": "₹510",
 "status": "available"
 }
 ]
 },

 {
 "id": "UP70VN3300",
 "busId": "UP70VN3300",
 "operator": "Sangam City Lines",
 "operatorName": "Sangam City Lines",
 "busName": "Prayag Kashi Intercity",
 "source": "Prayagraj",
 "destination": "Varanasi",
 "departureTime": "08:00 AM",
 "arrivalTime": "11:00 AM",
 "duration": "3h 00m",
 "price": 240,
 "availableSeats": 30,
 "totalSeats": 40,
 "busType": "AC Seater 2+2",
 "rating": "4.6 ",
 "amenities": [
 " Charging",
 " Reclining Seats"
 ],
 "boardingPoints": [
 {
 "location": "Civil Lines Bus Stand, Prayagraj",
 "time": "08:00 AM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Cantt Bus Station, Varanasi",
 "time": "11:00 AM"
 }
 ],
 "slots": [
 {
 "time": "08:00 AM",
 "fare": "₹240",
 "status": "available"
 }
 ]
 },

 {
 "id": "UP65PR4400",
 "busId": "UP65PR4400",
 "operator": "Sangam City Lines",
 "operatorName": "Sangam City Lines",
 "busName": "Kashi Prayag Shuttle",
 "source": "Varanasi",
 "destination": "Prayagraj",
 "departureTime": "04:00 PM",
 "arrivalTime": "07:00 PM",
 "duration": "3h 00m",
 "price": 240,
 "availableSeats": 31,
 "totalSeats": 40,
 "busType": "AC Seater 2+2",
 "rating": "4.6 ",
 "amenities": [
 " Charging",
 " Reclining Seats"
 ],
 "boardingPoints": [
 {
 "location": "Cantt Bus Station, Varanasi",
 "time": "04:00 PM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Civil Lines, Prayagraj",
 "time": "07:00 PM"
 }
 ],
 "slots": [
 {
 "time": "04:00 PM",
 "fare": "₹240",
 "status": "available"
 }
 ]
 },

 {
 "id": "UP70DL5500",
 "busId": "UP70DL5500",
 "operator": "Sangam Volvo Express",
 "operatorName": "Sangam Volvo Express",
 "busName": "Triveni Capital Liner",
 "source": "Prayagraj",
 "destination": "Delhi",
 "departureTime": "07:30 PM",
 "arrivalTime": "06:00 AM",
 "duration": "10h 30m",
 "price": 890,
 "availableSeats": 18,
 "totalSeats": 40,
 "busType": "Volvo AC Sleeper",
 "rating": "4.8 ",
 "amenities": [
 " Charging",
 " Wi-Fi",
 " Blankets"
 ],
 "boardingPoints": [
 {
 "location": "Civil Lines Bus Station, Prayagraj",
 "time": "07:30 PM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Anand Vihar ISBT, Delhi",
 "time": "06:00 AM"
 }
 ],
 "slots": [
 {
 "time": "07:30 PM",
 "fare": "₹890",
 "status": "available"
 }
 ]
 },

 {
 "id": "DL01PR6600",
 "busId": "DL01PR6600",
 "operator": "Sangam Volvo Express",
 "operatorName": "Sangam Volvo Express",
 "busName": "Delhi Sangam Sleeper",
 "source": "Delhi",
 "destination": "Prayagraj",
 "departureTime": "08:00 PM",
 "arrivalTime": "06:30 AM",
 "duration": "10h 30m",
 "price": 890,
 "availableSeats": 19,
 "totalSeats": 40,
 "busType": "Volvo AC Sleeper",
 "rating": "4.8 ",
 "amenities": [
 " Charging",
 " Wi-Fi",
 " Blankets"
 ],
 "boardingPoints": [
 {
 "location": "Anand Vihar, Delhi",
 "time": "08:00 PM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Civil Lines, Prayagraj",
 "time": "06:30 AM"
 }
 ],
 "slots": [
 {
 "time": "08:00 PM",
 "fare": "₹890",
 "status": "available"
 }
 ]
 },

 {
 "id": "MH12PM8888",
 "busId": "MH12PM8888",
 "operator": "Shivneri Super",
 "operatorName": "Shivneri Super",
 "busName": "Shivneri Volvo Intercity",
 "source": "Pune",
 "destination": "Mumbai",
 "departureTime": "06:30 AM",
 "arrivalTime": "10:00 AM",
 "duration": "3h 30m",
 "price": 480,
 "availableSeats": 22,
 "totalSeats": 40,
 "busType": "Volvo AC Multi-Axle",
 "rating": "4.9 ",
 "amenities": [
 " Charging",
 " Wi-Fi",
 " Climate Control"
 ],
 "boardingPoints": [
 {
 "location": "Shivajinagar, Pune",
 "time": "06:30 AM"
 },
 {
 "location": "Wakad, Pune",
 "time": "07:00 AM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Dadar, Mumbai",
 "time": "10:00 AM"
 },
 {
 "location": "Borivali Western Express Highway",
 "time": "10:45 AM"
 }
 ],
 "slots": [
 {
 "time": "06:30 AM",
 "fare": "₹480",
 "status": "available"
 },
 {
 "time": "02:00 PM",
 "fare": "₹480",
 "status": "available"
 },
 {
 "time": "06:30 PM",
 "fare": "₹510",
 "status": "available"
 }
 ]
 },

 {
 "id": "MH01MA1100",
 "busId": "MH01MA1100",
 "operator": "Gujarat Travels",
 "operatorName": "Gujarat Travels",
 "busName": "Karnavati Royal Liner",
 "source": "Mumbai",
 "destination": "Ahmedabad",
 "departureTime": "09:00 PM",
 "arrivalTime": "06:00 AM",
 "duration": "9h 00m",
 "price": 850,
 "availableSeats": 16,
 "totalSeats": 40,
 "busType": "Volvo AC Sleeper",
 "rating": "4.8 ",
 "amenities": [
 " Charging",
 " Wi-Fi",
 " Sanitized Blankets",
 " Mineral Water"
 ],
 "boardingPoints": [
 {
 "location": "Borivali West, Mumbai",
 "time": "09:00 PM"
 },
 {
 "location": "Thane Majiwada",
 "time": "09:45 PM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Paldi Cross Road, Ahmedabad",
 "time": "05:45 AM"
 },
 {
 "location": "Geeta Mandir Bus Stand",
 "time": "06:00 AM"
 }
 ],
 "slots": [
 {
 "time": "09:00 PM",
 "fare": "₹850",
 "status": "available"
 },
 {
 "time": "10:30 PM",
 "fare": "₹890",
 "status": "available"
 }
 ]
 },

 {
 "id": "GJ01AM2200",
 "busId": "GJ01AM2200",
 "operator": "Eagle Falcon Bus",
 "operatorName": "Eagle Falcon Bus",
 "busName": "Falcon Night Cruiser",
 "source": "Ahmedabad",
 "destination": "Mumbai",
 "departureTime": "09:30 PM",
 "arrivalTime": "06:30 AM",
 "duration": "9h 00m",
 "price": 880,
 "availableSeats": 18,
 "totalSeats": 40,
 "busType": "Volvo AC Sleeper",
 "rating": "4.8 ",
 "amenities": [
 " Charging",
 " Wi-Fi",
 " Blankets"
 ],
 "boardingPoints": [
 {
 "location": "Paldi, Ahmedabad",
 "time": "09:30 PM"
 },
 {
 "location": "C.T.M. Cross Road",
 "time": "10:00 PM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Borivali, Mumbai",
 "time": "06:00 AM"
 },
 {
 "location": "Dadar, Mumbai",
 "time": "06:30 AM"
 }
 ],
 "slots": [
 {
 "time": "09:30 PM",
 "fare": "₹880",
 "status": "available"
 }
 ]
 },

 {
 "id": "GJ01AS3300",
 "busId": "GJ01AS3300",
 "operator": "GSRTC Gurjarnagari",
 "operatorName": "GSRTC Gurjarnagari",
 "busName": "Diamond City Fastway",
 "source": "Ahmedabad",
 "destination": "Surat",
 "departureTime": "07:00 AM",
 "arrivalTime": "11:30 AM",
 "duration": "4h 30m",
 "price": 360,
 "availableSeats": 25,
 "totalSeats": 40,
 "busType": "AC Seater 2+2",
 "rating": "4.6 ",
 "amenities": [
 " Charging",
 " Reclining Seats",
 " Water Bottle"
 ],
 "boardingPoints": [
 {
 "location": "Geeta Mandir, Ahmedabad",
 "time": "07:00 AM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Surat Central Bus Station",
 "time": "11:30 AM"
 }
 ],
 "slots": [
 {
 "time": "07:00 AM",
 "fare": "₹360",
 "status": "available"
 }
 ]
 },

 {
 "id": "GJ05SA4400",
 "busId": "GJ05SA4400",
 "operator": "GSRTC Gurjarnagari",
 "operatorName": "GSRTC Gurjarnagari",
 "busName": "Sabarmati Intercity",
 "source": "Surat",
 "destination": "Ahmedabad",
 "departureTime": "02:00 PM",
 "arrivalTime": "06:30 PM",
 "duration": "4h 30m",
 "price": 360,
 "availableSeats": 27,
 "totalSeats": 40,
 "busType": "AC Seater 2+2",
 "rating": "4.6 ",
 "amenities": [
 " Charging",
 " Reclining Seats"
 ],
 "boardingPoints": [
 {
 "location": "Surat Central Bus Station",
 "time": "02:00 PM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Geeta Mandir, Ahmedabad",
 "time": "06:30 PM"
 }
 ],
 "slots": [
 {
 "time": "02:00 PM",
 "fare": "₹360",
 "status": "available"
 }
 ]
 },

 {
 "id": "GJ05SV5500",
 "busId": "GJ05SV5500",
 "operator": "Sanskari City Line",
 "operatorName": "Sanskari City Line",
 "busName": "Vadodara Surat Shuttle",
 "source": "Surat",
 "destination": "Vadodara",
 "departureTime": "08:00 AM",
 "arrivalTime": "10:30 AM",
 "duration": "2h 30m",
 "price": 260,
 "availableSeats": 29,
 "totalSeats": 40,
 "busType": "AC Seater 2+2",
 "rating": "4.7 ",
 "amenities": [
 " Charging",
 " Pushback Seats"
 ],
 "boardingPoints": [
 {
 "location": "Surat Bus Station",
 "time": "08:00 AM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Vadodara Central Bus Terminal",
 "time": "10:30 AM"
 }
 ],
 "slots": [
 {
 "time": "08:00 AM",
 "fare": "₹260",
 "status": "available"
 }
 ]
 },

 {
 "id": "GJ06VS6600",
 "busId": "GJ06VS6600",
 "operator": "Sanskari City Line",
 "operatorName": "Sanskari City Line",
 "busName": "Surat Express Link",
 "source": "Vadodara",
 "destination": "Surat",
 "departureTime": "04:30 PM",
 "arrivalTime": "07:00 PM",
 "duration": "2h 30m",
 "price": 260,
 "availableSeats": 30,
 "totalSeats": 40,
 "busType": "AC Seater 2+2",
 "rating": "4.7 ",
 "amenities": [
 " Charging",
 " Pushback Seats"
 ],
 "boardingPoints": [
 {
 "location": "Vadodara Central, Pandya Bridge",
 "time": "04:30 PM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Surat Central Bus Terminal",
 "time": "07:00 PM"
 }
 ],
 "slots": [
 {
 "time": "04:30 PM",
 "fare": "₹260",
 "status": "available"
 }
 ]
 },

 {
 "id": "MH01MN7700",
 "busId": "MH01MN7700",
 "operator": "Panchavati Expresslines",
 "operatorName": "Panchavati Expresslines",
 "busName": "Nashik Ghat Cruiser",
 "source": "Mumbai",
 "destination": "Nashik",
 "departureTime": "07:30 AM",
 "arrivalTime": "11:45 AM",
 "duration": "4h 15m",
 "price": 390,
 "availableSeats": 23,
 "totalSeats": 40,
 "busType": "AC Seater 2+2",
 "rating": "4.7 ",
 "amenities": [
 " Charging",
 " Reclining Seats",
 " Ghat Views"
 ],
 "boardingPoints": [
 {
 "location": "Dadar East, Mumbai",
 "time": "07:30 AM"
 },
 {
 "location": "Kalyan Bypass",
 "time": "08:30 AM"
 }
 ],
 "droppingPoints": [
 {
 "location": "CBS Bus Stand, Nashik",
 "time": "11:45 AM"
 }
 ],
 "slots": [
 {
 "time": "07:30 AM",
 "fare": "₹390",
 "status": "available"
 }
 ]
 },

 {
 "id": "MH15NM8800",
 "busId": "MH15NM8800",
 "operator": "Panchavati Expresslines",
 "operatorName": "Panchavati Expresslines",
 "busName": "Mumbai Coastal Fastway",
 "source": "Nashik",
 "destination": "Mumbai",
 "departureTime": "03:00 PM",
 "arrivalTime": "07:15 PM",
 "duration": "4h 15m",
 "price": 390,
 "availableSeats": 25,
 "totalSeats": 40,
 "busType": "AC Seater 2+2",
 "rating": "4.7 ",
 "amenities": [
 " Charging",
 " Reclining Seats"
 ],
 "boardingPoints": [
 {
 "location": "CBS Stand, Nashik",
 "time": "03:00 PM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Dadar, Mumbai",
 "time": "07:15 PM"
 }
 ],
 "slots": [
 {
 "time": "03:00 PM",
 "fare": "₹390",
 "status": "available"
 }
 ]
 },

 {
 "id": "MP09IB1100",
 "busId": "MP09IB1100",
 "operator": "Chartered Bus MP",
 "operatorName": "Chartered Bus MP",
 "busName": "Chartered Intercity Gold",
 "source": "Indore",
 "destination": "Bhopal",
 "departureTime": "07:00 AM",
 "arrivalTime": "10:30 AM",
 "duration": "3h 30m",
 "price": 380,
 "availableSeats": 28,
 "totalSeats": 40,
 "busType": "Volvo AC Multi-Axle",
 "rating": "4.8 ",
 "amenities": [
 " Charging",
 " Wi-Fi",
 " Packaged Water"
 ],
 "boardingPoints": [
 {
 "location": "AICTSL Bus Stand, Indore",
 "time": "07:00 AM"
 }
 ],
 "droppingPoints": [
 {
 "location": "ISBT Habibganj, Bhopal",
 "time": "10:30 AM"
 }
 ],
 "slots": [
 {
 "time": "07:00 AM",
 "fare": "₹380",
 "status": "available"
 },
 {
 "time": "01:00 PM",
 "fare": "₹380",
 "status": "available"
 },
 {
 "time": "06:00 PM",
 "fare": "₹410",
 "status": "available"
 }
 ]
 },

 {
 "id": "MP04BI2200",
 "busId": "MP04BI2200",
 "operator": "Chartered Bus MP",
 "operatorName": "Chartered Bus MP",
 "busName": "Malwa King Express",
 "source": "Bhopal",
 "destination": "Indore",
 "departureTime": "08:00 AM",
 "arrivalTime": "11:30 AM",
 "duration": "3h 30m",
 "price": 380,
 "availableSeats": 26,
 "totalSeats": 40,
 "busType": "Volvo AC Multi-Axle",
 "rating": "4.8 ",
 "amenities": [
 " Charging",
 " Wi-Fi",
 " Packaged Water"
 ],
 "boardingPoints": [
 {
 "location": "ISBT Habibganj, Bhopal",
 "time": "08:00 AM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Sarwate Bus Stand, Indore",
 "time": "11:30 AM"
 }
 ],
 "slots": [
 {
 "time": "08:00 AM",
 "fare": "₹380",
 "status": "available"
 },
 {
 "time": "03:00 PM",
 "fare": "₹380",
 "status": "available"
 }
 ]
 },

 {
 "id": "KA01BC1100",
 "busId": "KA01BC1100",
 "operator": "SRS Travels",
 "operatorName": "SRS Travels",
 "busName": "Silicon Coastal Express",
 "source": "Bengaluru",
 "destination": "Chennai",
 "departureTime": "06:30 AM",
 "arrivalTime": "12:30 PM",
 "duration": "6h 00m",
 "price": 599,
 "availableSeats": 22,
 "totalSeats": 40,
 "busType": "Volvo AC Multi-Axle",
 "rating": "4.8 ",
 "amenities": [
 " Charging",
 " Wi-Fi",
 " Water Bottle",
 " Recliners"
 ],
 "boardingPoints": [
 {
 "location": "Majestic Bus Stand, Bengaluru",
 "time": "06:30 AM"
 },
 {
 "location": "Electronic City Toll",
 "time": "07:15 AM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Koyambedu CMBT, Chennai",
 "time": "12:30 PM"
 }
 ],
 "slots": [
 {
 "time": "06:30 AM",
 "fare": "₹599",
 "status": "available"
 },
 {
 "time": "02:00 PM",
 "fare": "₹640",
 "status": "available"
 },
 {
 "time": "10:30 PM",
 "fare": "₹750",
 "status": "available"
 }
 ]
 },

 {
 "id": "TN01CB2200",
 "busId": "TN01CB2200",
 "operator": "Parveen Travels",
 "operatorName": "Parveen Travels",
 "busName": "Chennai Bangalore Jet",
 "source": "Chennai",
 "destination": "Bengaluru",
 "departureTime": "07:00 AM",
 "arrivalTime": "01:00 PM",
 "duration": "6h 00m",
 "price": 620,
 "availableSeats": 20,
 "totalSeats": 40,
 "busType": "Volvo AC Multi-Axle",
 "rating": "4.8 ",
 "amenities": [
 " Charging",
 " Wi-Fi",
 " AC",
 " Movies"
 ],
 "boardingPoints": [
 {
 "location": "Koyambedu CMBT, Chennai",
 "time": "07:00 AM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Silk Board, Bengaluru",
 "time": "12:30 PM"
 },
 {
 "location": "Majestic, Bengaluru",
 "time": "01:00 PM"
 }
 ],
 "slots": [
 {
 "time": "07:00 AM",
 "fare": "₹620",
 "status": "available"
 },
 {
 "time": "11:00 PM",
 "fare": "₹780",
 "status": "available"
 }
 ]
 },

 {
 "id": "TS09HB9900",
 "busId": "TS09HB9900",
 "operator": "Orange Tours",
 "operatorName": "Orange Tours",
 "busName": "Deccan Sleeper Super",
 "source": "Hyderabad",
 "destination": "Bengaluru",
 "departureTime": "09:30 PM",
 "arrivalTime": "06:30 AM",
 "duration": "9h 00m",
 "price": 920,
 "availableSeats": 17,
 "totalSeats": 40,
 "busType": "Volvo AC Sleeper",
 "rating": "4.9 ",
 "amenities": [
 " Charging",
 " Wi-Fi",
 " Premium Pillows",
 " Water"
 ],
 "boardingPoints": [
 {
 "location": "MGBS Bus Stand, Hyderabad",
 "time": "09:30 PM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Hebbal, Bengaluru",
 "time": "06:00 AM"
 },
 {
 "location": "Majestic, Bengaluru",
 "time": "06:30 AM"
 }
 ],
 "slots": [
 {
 "time": "09:30 PM",
 "fare": "₹920",
 "status": "available"
 }
 ]
 },

 {
 "id": "KA09BM3300",
 "busId": "KA09BM3300",
 "operator": "KSRTC Airavat",
 "operatorName": "KSRTC Airavat",
 "busName": "Heritage Expressway Club",
 "source": "Bengaluru",
 "destination": "Mysuru",
 "departureTime": "07:30 AM",
 "arrivalTime": "10:00 AM",
 "duration": "2h 30m",
 "price": 340,
 "availableSeats": 26,
 "totalSeats": 40,
 "busType": "Volvo AC Multi-Axle",
 "rating": "4.9 ",
 "amenities": [
 " Charging",
 " Reclining Seats",
 " Packaged Water"
 ],
 "boardingPoints": [
 {
 "location": "Satellite Bus Stand, Bengaluru",
 "time": "07:30 AM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Mysuru KSRTC Suburban Stand",
 "time": "10:00 AM"
 }
 ],
 "slots": [
 {
 "time": "07:30 AM",
 "fare": "₹340",
 "status": "available"
 },
 {
 "time": "11:00 AM",
 "fare": "₹340",
 "status": "available"
 },
 {
 "time": "04:00 PM",
 "fare": "₹340",
 "status": "available"
 }
 ]
 },

 {
 "id": "KA09MB4400",
 "busId": "KA09MB4400",
 "operator": "KSRTC Airavat",
 "operatorName": "KSRTC Airavat",
 "busName": "Palace City Express",
 "source": "Mysuru",
 "destination": "Bengaluru",
 "departureTime": "08:00 AM",
 "arrivalTime": "10:30 AM",
 "duration": "2h 30m",
 "price": 340,
 "availableSeats": 27,
 "totalSeats": 40,
 "busType": "Volvo AC Multi-Axle",
 "rating": "4.9 ",
 "amenities": [
 " Charging",
 " Reclining Seats"
 ],
 "boardingPoints": [
 {
 "location": "Mysuru Suburban Bus Stand",
 "time": "08:00 AM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Kengeri, Bengaluru",
 "time": "10:00 AM"
 },
 {
 "location": "Satellite Stand, Bengaluru",
 "time": "10:30 AM"
 }
 ],
 "slots": [
 {
 "time": "08:00 AM",
 "fare": "₹340",
 "status": "available"
 }
 ]
 },

 {
 "id": "KA01BC5500",
 "busId": "KA01BC5500",
 "operator": "Kallada Travels",
 "operatorName": "Kallada Travels",
 "busName": "Kongu Express Liner",
 "source": "Bengaluru",
 "destination": "Coimbatore",
 "departureTime": "10:00 PM",
 "arrivalTime": "05:30 AM",
 "duration": "7h 30m",
 "price": 720,
 "availableSeats": 19,
 "totalSeats": 40,
 "busType": "AC Sleeper 2+1",
 "rating": "4.8 ",
 "amenities": [
 " Charging",
 " Free Wi-Fi",
 " Blankets"
 ],
 "boardingPoints": [
 {
 "location": "Madiwala, Bengaluru",
 "time": "10:00 PM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Gandhipuram, Coimbatore",
 "time": "05:30 AM"
 }
 ],
 "slots": [
 {
 "time": "10:00 PM",
 "fare": "₹720",
 "status": "available"
 }
 ]
 },

 {
 "id": "TN38CB6600",
 "busId": "TN38CB6600",
 "operator": "Kallada Travels",
 "operatorName": "Kallada Travels",
 "busName": "Manchester Night Rider",
 "source": "Coimbatore",
 "destination": "Bengaluru",
 "departureTime": "10:30 PM",
 "arrivalTime": "06:00 AM",
 "duration": "7h 30m",
 "price": 720,
 "availableSeats": 21,
 "totalSeats": 40,
 "busType": "AC Sleeper 2+1",
 "rating": "4.8 ",
 "amenities": [
 " Charging",
 " Wi-Fi",
 " Blankets"
 ],
 "boardingPoints": [
 {
 "location": "Gandhipuram, Coimbatore",
 "time": "10:30 PM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Electronic City, Bengaluru",
 "time": "05:30 AM"
 },
 {
 "location": "Majestic, Bengaluru",
 "time": "06:00 AM"
 }
 ],
 "slots": [
 {
 "time": "10:30 PM",
 "fare": "₹720",
 "status": "available"
 }
 ]
 },

 {
 "id": "TN01CM7700",
 "busId": "TN01CM7700",
 "operator": "VRL Travelways",
 "operatorName": "VRL Travelways",
 "busName": "Pandiyan Royal Express",
 "source": "Chennai",
 "destination": "Madurai",
 "departureTime": "09:00 PM",
 "arrivalTime": "05:30 AM",
 "duration": "8h 30m",
 "price": 680,
 "availableSeats": 22,
 "totalSeats": 40,
 "busType": "Volvo AC Sleeper",
 "rating": "4.8 ",
 "amenities": [
 " Charging",
 " Wi-Fi",
 " Bedding"
 ],
 "boardingPoints": [
 {
 "location": "Koyambedu CMBT, Chennai",
 "time": "09:00 PM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Mattuthavani Bus Stand, Madurai",
 "time": "05:30 AM"
 }
 ],
 "slots": [
 {
 "time": "09:00 PM",
 "fare": "₹680",
 "status": "available"
 }
 ]
 },

 {
 "id": "TN59MC8800",
 "busId": "TN59MC8800",
 "operator": "VRL Travelways",
 "operatorName": "VRL Travelways",
 "busName": "Temple City to Capital",
 "source": "Madurai",
 "destination": "Chennai",
 "departureTime": "09:30 PM",
 "arrivalTime": "06:00 AM",
 "duration": "8h 30m",
 "price": 680,
 "availableSeats": 20,
 "totalSeats": 40,
 "busType": "Volvo AC Sleeper",
 "rating": "4.8 ",
 "amenities": [
 " Charging",
 " Wi-Fi",
 " Bedding"
 ],
 "boardingPoints": [
 {
 "location": "Mattuthavani, Madurai",
 "time": "09:30 PM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Tambaram, Chennai",
 "time": "05:30 AM"
 },
 {
 "location": "CMBT, Chennai",
 "time": "06:00 AM"
 }
 ],
 "slots": [
 {
 "time": "09:30 PM",
 "fare": "₹680",
 "status": "available"
 }
 ]
 },

 {
 "id": "TS09HV1100",
 "busId": "TS09HV1100",
 "operator": "Morning Star Travels",
 "operatorName": "Morning Star Travels",
 "busName": "Amaravati Highway Cruiser",
 "source": "Hyderabad",
 "destination": "Vijayawada",
 "departureTime": "06:30 AM",
 "arrivalTime": "11:45 AM",
 "duration": "5h 15m",
 "price": 499,
 "availableSeats": 27,
 "totalSeats": 40,
 "busType": "AC Seater 2+2",
 "rating": "4.7 ",
 "amenities": [
 " Charging",
 " Reclining Seats",
 " Water"
 ],
 "boardingPoints": [
 {
 "location": "MGBS Bus Stand, Hyderabad",
 "time": "06:30 AM"
 },
 {
 "location": "LB Nagar, Hyderabad",
 "time": "07:00 AM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Pandit Nehru Bus Station, Vijayawada",
 "time": "11:45 AM"
 }
 ],
 "slots": [
 {
 "time": "06:30 AM",
 "fare": "₹499",
 "status": "available"
 },
 {
 "time": "02:30 PM",
 "fare": "₹530",
 "status": "available"
 }
 ]
 },

 {
 "id": "AP16VH2200",
 "busId": "AP16VH2200",
 "operator": "Morning Star Travels",
 "operatorName": "Morning Star Travels",
 "busName": "Krishna Pearl Jet",
 "source": "Vijayawada",
 "destination": "Hyderabad",
 "departureTime": "03:00 PM",
 "arrivalTime": "08:15 PM",
 "duration": "5h 15m",
 "price": 499,
 "availableSeats": 28,
 "totalSeats": 40,
 "busType": "AC Seater 2+2",
 "rating": "4.7 ",
 "amenities": [
 " Charging",
 " Reclining Seats"
 ],
 "boardingPoints": [
 {
 "location": "PNBS, Vijayawada",
 "time": "03:00 PM"
 }
 ],
 "droppingPoints": [
 {
 "location": "LB Nagar, Hyderabad",
 "time": "07:45 PM"
 },
 {
 "location": "MGBS, Hyderabad",
 "time": "08:15 PM"
 }
 ],
 "slots": [
 {
 "time": "03:00 PM",
 "fare": "₹499",
 "status": "available"
 }
 ]
 },

 {
 "id": "KL07KB3300",
 "busId": "KL07KB3300",
 "operator": "Kerala RTC Swift",
 "operatorName": "Kerala RTC Swift",
 "busName": "Gods Own Country Swift",
 "source": "Kochi",
 "destination": "Bengaluru",
 "departureTime": "08:30 PM",
 "arrivalTime": "06:30 AM",
 "duration": "10h 00m",
 "price": 980,
 "availableSeats": 16,
 "totalSeats": 40,
 "busType": "Volvo AC Sleeper",
 "rating": "4.9 ",
 "amenities": [
 " Charging",
 " Wi-Fi",
 " Sanitized Blankets",
 " Water"
 ],
 "boardingPoints": [
 {
 "location": "Vyttila Mobility Hub, Kochi",
 "time": "08:30 PM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Electronic City, Bengaluru",
 "time": "06:00 AM"
 },
 {
 "location": "Shantinagar, Bengaluru",
 "time": "06:30 AM"
 }
 ],
 "slots": [
 {
 "time": "08:30 PM",
 "fare": "₹980",
 "status": "available"
 }
 ]
 },

 {
 "id": "KA01BK4400",
 "busId": "KA01BK4400",
 "operator": "Kerala RTC Swift",
 "operatorName": "Kerala RTC Swift",
 "busName": "Bengaluru Malabar Swift",
 "source": "Bengaluru",
 "destination": "Kochi",
 "departureTime": "09:00 PM",
 "arrivalTime": "07:00 AM",
 "duration": "10h 00m",
 "price": 980,
 "availableSeats": 18,
 "totalSeats": 40,
 "busType": "Volvo AC Sleeper",
 "rating": "4.9 ",
 "amenities": [
 " Charging",
 " Wi-Fi",
 " Sanitized Blankets"
 ],
 "boardingPoints": [
 {
 "location": "Shantinagar Bus Station, Bengaluru",
 "time": "09:00 PM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Vyttila Mobility Hub, Kochi",
 "time": "07:00 AM"
 }
 ],
 "slots": [
 {
 "time": "09:00 PM",
 "fare": "₹980",
 "status": "available"
 }
 ]
 },

 {
 "id": "WB01KP1100",
 "busId": "WB01KP1100",
 "operator": "Bengal Tiger Travelways",
 "operatorName": "Bengal Tiger Travelways",
 "busName": "Patliputra Royal Express",
 "source": "Kolkata",
 "destination": "Patna",
 "departureTime": "07:00 PM",
 "arrivalTime": "06:30 AM",
 "duration": "11h 30m",
 "price": 799,
 "availableSeats": 21,
 "totalSeats": 40,
 "busType": "AC Sleeper 2+1",
 "rating": "4.7 ",
 "amenities": [
 " Charging",
 " Wi-Fi",
 " Clean Blankets"
 ],
 "boardingPoints": [
 {
 "location": "Babughat, Kolkata",
 "time": "07:00 PM"
 },
 {
 "location": "Santragachi Junction",
 "time": "07:45 PM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Bairiya Bus Stand, Patna",
 "time": "06:30 AM"
 }
 ],
 "slots": [
 {
 "time": "07:00 PM",
 "fare": "₹799",
 "status": "available"
 }
 ]
 },

 {
 "id": "BR01PK2200",
 "busId": "BR01PK2200",
 "operator": "Bihar State Super",
 "operatorName": "Bihar State Super",
 "busName": "Ganga Sagar Sleeper",
 "source": "Patna",
 "destination": "Kolkata",
 "departureTime": "06:30 PM",
 "arrivalTime": "06:00 AM",
 "duration": "11h 30m",
 "price": 799,
 "availableSeats": 19,
 "totalSeats": 40,
 "busType": "AC Sleeper 2+1",
 "rating": "4.7 ",
 "amenities": [
 " Charging",
 " Clean Blankets"
 ],
 "boardingPoints": [
 {
 "location": "Bairiya Bus Terminal, Patna",
 "time": "06:30 PM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Babughat, Kolkata",
 "time": "06:00 AM"
 }
 ],
 "slots": [
 {
 "time": "06:30 PM",
 "fare": "₹799",
 "status": "available"
 }
 ]
 },

 {
 "id": "WB01KB3300",
 "busId": "WB01KB3300",
 "operator": "Odisha Coastal Coach",
 "operatorName": "Odisha Coastal Coach",
 "busName": "Konark Temple Cruiser",
 "source": "Kolkata",
 "destination": "Bhubaneswar",
 "departureTime": "08:30 PM",
 "arrivalTime": "05:30 AM",
 "duration": "9h 00m",
 "price": 680,
 "availableSeats": 22,
 "totalSeats": 40,
 "busType": "Volvo AC Sleeper",
 "rating": "4.8 ",
 "amenities": [
 " Charging",
 " Wi-Fi",
 " Blankets",
 " Water"
 ],
 "boardingPoints": [
 {
 "location": "Esplanade Bus Terminus, Kolkata",
 "time": "08:30 PM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Baramunda Bus Stand, Bhubaneswar",
 "time": "05:30 AM"
 }
 ],
 "slots": [
 {
 "time": "08:30 PM",
 "fare": "₹680",
 "status": "available"
 }
 ]
 },

 {
 "id": "OD02BK4400",
 "busId": "OD02BK4400",
 "operator": "OSRTC Premium",
 "operatorName": "OSRTC Premium",
 "busName": "Kalinga City Jet",
 "source": "Bhubaneswar",
 "destination": "Kolkata",
 "departureTime": "09:00 PM",
 "arrivalTime": "06:00 AM",
 "duration": "9h 00m",
 "price": 680,
 "availableSeats": 24,
 "totalSeats": 40,
 "busType": "Volvo AC Sleeper",
 "rating": "4.8 ",
 "amenities": [
 " Charging",
 " Wi-Fi",
 " Blankets"
 ],
 "boardingPoints": [
 {
 "location": "Baramunda ISBT, Bhubaneswar",
 "time": "09:00 PM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Esplanade, Kolkata",
 "time": "06:00 AM"
 }
 ],
 "slots": [
 {
 "time": "09:00 PM",
 "fare": "₹680",
 "status": "available"
 }
 ]
 },

 {
 "id": "WB01KR5500",
 "busId": "WB01KR5500",
 "operator": "Jharkhand Expresslines",
 "operatorName": "Jharkhand Expresslines",
 "busName": "Chota Nagpur Flyer",
 "source": "Kolkata",
 "destination": "Ranchi",
 "departureTime": "09:15 PM",
 "arrivalTime": "05:45 AM",
 "duration": "8h 30m",
 "price": 590,
 "availableSeats": 23,
 "totalSeats": 40,
 "busType": "AC Sleeper 2+1",
 "rating": "4.6 ",
 "amenities": [
 " Charging",
 " Blankets"
 ],
 "boardingPoints": [
 {
 "location": "Babughat, Kolkata",
 "time": "09:15 PM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Khadgarha Bus Stand, Ranchi",
 "time": "05:45 AM"
 }
 ],
 "slots": [
 {
 "time": "09:15 PM",
 "fare": "₹590",
 "status": "available"
 }
 ]
 },

 {
 "id": "JH01RK6600",
 "busId": "JH01RK6600",
 "operator": "Jharkhand Expresslines",
 "operatorName": "Jharkhand Expresslines",
 "busName": "Ranchi Kolkata Star",
 "source": "Ranchi",
 "destination": "Kolkata",
 "departureTime": "09:00 PM",
 "arrivalTime": "05:30 AM",
 "duration": "8h 30m",
 "price": 590,
 "availableSeats": 25,
 "totalSeats": 40,
 "busType": "AC Sleeper 2+1",
 "rating": "4.6 ",
 "amenities": [
 " Charging",
 " Blankets"
 ],
 "boardingPoints": [
 {
 "location": "Khadgarha Stand, Ranchi",
 "time": "09:00 PM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Babughat, Kolkata",
 "time": "05:30 AM"
 }
 ],
 "slots": [
 {
 "time": "09:00 PM",
 "fare": "₹590",
 "status": "available"
 }
 ]
 },

 {
 "id": "WB01KG7700",
 "busId": "WB01KG7700",
 "operator": "Brahmaputra Highway Star",
 "operatorName": "Brahmaputra Highway Star",
 "busName": "Northeast Expressliner",
 "source": "Kolkata",
 "destination": "Guwahati",
 "departureTime": "03:00 PM",
 "arrivalTime": "09:30 AM",
 "duration": "18h 30m",
 "price": 1350,
 "availableSeats": 15,
 "totalSeats": 40,
 "busType": "Volvo AC Multi-Axle Sleeper",
 "rating": "4.8 ",
 "amenities": [
 " Charging",
 " Free Wi-Fi",
 " Sanitized Bedding",
 " Water Bottle",
 " Refreshments"
 ],
 "boardingPoints": [
 {
 "location": "Esplanade Bus Terminus, Kolkata",
 "time": "03:00 PM"
 }
 ],
 "droppingPoints": [
 {
 "location": "ISBT Betkuchi, Guwahati",
 "time": "09:30 AM"
 }
 ],
 "slots": [
 {
 "time": "03:00 PM",
 "fare": "₹1350",
 "status": "available"
 }
 ]
 },

 {
 "id": "AS01GK8800",
 "busId": "AS01GK8800",
 "operator": "Brahmaputra Highway Star",
 "operatorName": "Brahmaputra Highway Star",
 "busName": "Assam Bengal Deluxe",
 "source": "Guwahati",
 "destination": "Kolkata",
 "departureTime": "02:30 PM",
 "arrivalTime": "09:00 AM",
 "duration": "18h 30m",
 "price": 1350,
 "availableSeats": 16,
 "totalSeats": 40,
 "busType": "Volvo AC Multi-Axle Sleeper",
 "rating": "4.8 ",
 "amenities": [
 " Charging",
 " Wi-Fi",
 " Bedding",
 " Water"
 ],
 "boardingPoints": [
 {
 "location": "ISBT Betkuchi, Guwahati",
 "time": "02:30 PM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Esplanade, Kolkata",
 "time": "09:00 AM"
 }
 ],
 "slots": [
 {
 "time": "02:30 PM",
 "fare": "₹1350",
 "status": "available"
 }
 ]
 },

 {
 "id": "MH31NR1100",
 "busId": "MH31NR1100",
 "operator": "Maan Travels",
 "operatorName": "Maan Travels",
 "busName": "Orange City to Capital",
 "source": "Nagpur",
 "destination": "Raipur",
 "departureTime": "07:30 AM",
 "arrivalTime": "01:30 PM",
 "duration": "6h 00m",
 "price": 520,
 "availableSeats": 26,
 "totalSeats": 40,
 "busType": "AC Seater 2+2",
 "rating": "4.7 ",
 "amenities": [
 " Charging",
 " Reclining Seats",
 " Packaged Water"
 ],
 "boardingPoints": [
 {
 "location": "Ganeshpeth Bus Stand, Nagpur",
 "time": "07:30 AM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Pandri Bus Terminal, Raipur",
 "time": "01:30 PM"
 }
 ],
 "slots": [
 {
 "time": "07:30 AM",
 "fare": "₹520",
 "status": "available"
 }
 ]
 },

 {
 "id": "CG04RN2200",
 "busId": "CG04RN2200",
 "operator": "Maan Travels",
 "operatorName": "Maan Travels",
 "busName": "Chhattisgarh Orange Link",
 "source": "Raipur",
 "destination": "Nagpur",
 "departureTime": "03:00 PM",
 "arrivalTime": "09:00 PM",
 "duration": "6h 00m",
 "price": 520,
 "availableSeats": 24,
 "totalSeats": 40,
 "busType": "AC Seater 2+2",
 "rating": "4.7 ",
 "amenities": [
 " Charging",
 " Reclining Seats"
 ],
 "boardingPoints": [
 {
 "location": "Pandri Bus Stand, Raipur",
 "time": "03:00 PM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Ganeshpeth, Nagpur",
 "time": "09:00 PM"
 }
 ],
 "slots": [
 {
 "time": "03:00 PM",
 "fare": "₹520",
 "status": "available"
 }
 ]
 },

 {
 "id": "MH31NJ3300",
 "busId": "MH31NJ3300",
 "operator": "Narmada Valley Express",
 "operatorName": "Narmada Valley Express",
 "busName": "Marble City Express",
 "source": "Nagpur",
 "destination": "Jabalpur",
 "departureTime": "08:00 AM",
 "arrivalTime": "02:00 PM",
 "duration": "6h 00m",
 "price": 490,
 "availableSeats": 27,
 "totalSeats": 40,
 "busType": "AC Seater 2+2",
 "rating": "4.6 ",
 "amenities": [
 " Charging",
 " Reclining Seats"
 ],
 "boardingPoints": [
 {
 "location": "Ganeshpeth Stand, Nagpur",
 "time": "08:00 AM"
 }
 ],
 "droppingPoints": [
 {
 "location": "ISBT Jabalpur, Deendayal Chowk",
 "time": "02:00 PM"
 }
 ],
 "slots": [
 {
 "time": "08:00 AM",
 "fare": "₹490",
 "status": "available"
 }
 ]
 },

 {
 "id": "MP20JN4400",
 "busId": "MP20JN4400",
 "operator": "Narmada Valley Express",
 "operatorName": "Narmada Valley Express",
 "busName": "Jabalpur Nagpur Jet",
 "source": "Jabalpur",
 "destination": "Nagpur",
 "departureTime": "02:30 PM",
 "arrivalTime": "08:30 PM",
 "duration": "6h 00m",
 "price": 490,
 "availableSeats": 25,
 "totalSeats": 40,
 "busType": "AC Seater 2+2",
 "rating": "4.6 ",
 "amenities": [
 " Charging",
 " Reclining Seats"
 ],
 "boardingPoints": [
 {
 "location": "ISBT Jabalpur",
 "time": "02:30 PM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Ganeshpeth, Nagpur",
 "time": "08:30 PM"
 }
 ],
 "slots": [
 {
 "time": "02:30 PM",
 "fare": "₹490",
 "status": "available"
 }
 ]
 },

 {
 "id": "MP04BJ5500",
 "busId": "MP04BJ5500",
 "operator": "MP State Connect",
 "operatorName": "MP State Connect",
 "busName": "Bhopal Jabalpur Intercity",
 "source": "Bhopal",
 "destination": "Jabalpur",
 "departureTime": "07:30 AM",
 "arrivalTime": "01:30 PM",
 "duration": "6h 00m",
 "price": 460,
 "availableSeats": 28,
 "totalSeats": 40,
 "busType": "AC Seater 2+2",
 "rating": "4.6 ",
 "amenities": [
 " Charging",
 " Pushback Seats"
 ],
 "boardingPoints": [
 {
 "location": "ISBT Habibganj, Bhopal",
 "time": "07:30 AM"
 }
 ],
 "droppingPoints": [
 {
 "location": "Deendayal Bus Stand, Jabalpur",
 "time": "01:30 PM"
 }
 ],
 "slots": [
 {
 "time": "07:30 AM",
 "fare": "₹460",
 "status": "available"
 }
 ]
 },

 {
 "id": "MP20JB6600",
 "busId": "MP20JB6600",
 "operator": "MP State Connect",
 "operatorName": "MP State Connect",
 "busName": "Lake City Express",
 "source": "Jabalpur",
 "destination": "Bhopal",
 "departureTime": "02:00 PM",
 "arrivalTime": "08:00 PM",
 "duration": "6h 00m",
 "price": 460,
 "availableSeats": 29,
 "totalSeats": 40,
 "busType": "AC Seater 2+2",
 "rating": "4.6 ",
 "amenities": [
 " Charging",
 " Pushback Seats"
 ],
 "boardingPoints": [
 {
 "location": "ISBT Jabalpur",
 "time": "02:00 PM"
 }
 ],
 "droppingPoints": [
 {
 "location": "ISBT Habibganj, Bhopal",
 "time": "08:00 PM"
 }
 ],
 "slots": [
 {
 "time": "02:00 PM",
 "fare": "₹460",
 "status": "available"
 }
 ]
 }
];

