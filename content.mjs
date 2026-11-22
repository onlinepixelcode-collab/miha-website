// MiHa's menu as listed on Dineplan ("MiHa Johannesburg", last updated by the venue 4 July 2025).
// Dineplan marks it a sample menu; prices may have changed. Tags: sig = signature, spicy, veg, share.
export const MENU = [
  { id: 'starters', title: 'Starters &amp; <em>tapas</em>', img: 'g-platter', alt: 'A MiHa tapas board with falafel, kebabs and dips', items: [
    ['Tapas Board for 2', '4 falafels, 4 sheesh kebab, halloumi fingers, chick ’n cheese bombs and chicken strips, with hummus, tzatziki, chilli mayo and laffa bread.', 'R 299', 'sig share'],
    ['Tapas Board for 1', 'A smaller board of MiHa favourites with dips and laffa bread.', 'R 199', ''],
    ['Falafels', '3 falafels with hummus, tzatziki and laffa bread.', 'R 48', 'veg'],
    ['Halloumi Fingers', 'Grilled halloumi with sweet chilli dip.', 'R 66', 'veg'],
    ['Spicy Asian Prawns', '4 crispy prawns in MiHa’s sriracha sauce.', 'R 99', 'spicy'],
    ['Chick ’n Cheese Bomb', '3 bombs with chilli mayo.', 'R 59', ''],
    ['Garlic &amp; Herb Focaccia', 'With melted cheese.', 'R 69', 'veg'],
  ]},
  { id: 'steak', title: 'Signature <em>steak</em>', img: 'g-burger-board', alt: 'A MiHa dish served on a wooden board', items: [
    ['Fillet Steak, 200g', '28-day aged, flame-grilled in MiHa’s signature basting. Chips and onion rings.', 'R 279', 'sig'],
    ['Ribeye on the Bone, 600g', '28-day aged prime cut, basted and flame-grilled.', 'R 349', 'sig'],
    ['Cheddamelt Fillet, 200g', 'With melted cheese and mushroom sauce.', 'R 299', ''],
    ['Rump Steak', '28-day aged, basted and flame-grilled.', 'from R 220', ''],
    ['Cheddamelt Rump, 300g', 'With melted cheese and mushroom sauce.', 'R 269', ''],
    ['MiHa Mixed Grill Platter', '3 queen prawns, 100g steak, ¼ chicken, rice and chips. For one or two.', 'R 339', 'share'],
  ]},
  { id: 'seafood', title: 'Prawns <em>&amp; chicken</em>', img: 'g-prawns', alt: 'MiHa Portuguese prawns with chips and charred lemon', items: [
    ['MiHa Signature Portuguese Prawns', '6 butterflied queen prawns in MiHa’s peri-peri rub, hot, mild or lemon butter. 1kg option available.', 'R 279', 'sig spicy'],
    ['Kingklip, Cajun', 'In a spicy Cajun sauce with chips or rice.', 'R 249', 'spicy'],
    ['½ Portuguese Chicken', 'Flame-grilled with Portuguese-style spices and mild peri-peri.', 'R 159', 'spicy'],
    ['Prawn Platter', '2 dozen queen prawns with rice and chips.', 'R 996', 'share'],
    ['Chicken Platter', '2 full chickens with rice and chips.', 'R 619', 'share'],
  ]},
  { id: 'sushi', title: '<em>Sushi</em>', img: 'g-sushi', alt: 'MiHa sushi rolls on a blue platter', items: [
    ['Okinawa Tempura Platter', 'Tempura crunch, signature prawn sushi, crispy sumo and tiger rolls.', 'R 780', 'sig share'],
    ['Kyoto Salmon Platter', 'California rolls, signature salmon, maki and rainbow rolls.', 'R 600', 'share'],
    ['Kobe Vegetarian Platter', 'Osaka vegetarian rolls, halloumi crunch, California rolls and fashion sandwiches.', 'R 499', 'veg share'],
    ['MiHa Signature Sushi, 8pc', 'Very spicy: salmon, prawn or tuna with chilli, spring onion and avo.', 'R 182', 'sig spicy'],
    ['Spicy Sashimi, 8pc', 'Salmon, ponzu, sesame oil and jalapeño.', 'R 140', 'spicy'],
    ['Halloumi Crunch, 8pc', 'Fried halloumi, cream cheese and avo.', 'R 162', 'veg'],
  ]},
  { id: 'pizza', title: 'Pizza <em>&amp; pasta</em>', img: 'g-pizza', alt: 'A stone-fired MiHa pizza', items: [
    ['Chicken Tikka Pizza', 'Chicken tikka, peppers, feta and mozzarella, from the stone-fired oven.', 'R 150', 'sig'],
    ['Meat Pizza', 'Spicy mince, fresh chilli and garlic.', 'R 139', 'spicy'],
    ['Margherita', 'Tomato, cheese and basil.', 'R 95', 'veg'],
    ['Arrabbiata Pasta', 'Spicy Italian tomato, chilli, olives and basil. Penne or spaghetti.', 'R 135', 'veg spicy'],
    ['Alfredo Pasta', 'Creamy mushroom sauce.', 'R 148', 'veg'],
  ]},
  { id: 'burgers', title: 'Burgers, <em>wraps</em> &amp; bowls', img: 'g-burger', alt: 'A MiHa burger with avocado and crispy nachos', items: [
    ['MiHa Signature Asian Prawn Burger', 'Crispy prawns, pineapple salsa and sriracha on brioche.', 'R 139', 'sig spicy'],
    ['Nacho Burger', 'Flame-grilled chicken with guacamole, nachos and cream cheese.', 'from R 99', ''],
    ['Yankee Burger', 'Cheddar melt with smoked beef, cheese and mushroom sauce.', 'R 139', ''],
    ['Steak &amp; Avo Wrap', 'Peppered steak, smashed avo, cream cheese and feta.', 'R 125', ''],
    ['Salmon Bagel', 'Salmon, caramelised onion, avo, rocket and cream cheese.', 'R 159', ''],
    ['Salmon Poke Bowl', 'Grilled salmon on spicy rice with avo and chilli mayo.', 'R 139', 'spicy'],
  ]},
  { id: 'sweet', title: '<em>Sweet</em> endings', img: 'g-dessert-choc', alt: 'A MiHa chocolate dessert with brownie pieces', items: [
    ['Chocolate Fondant', 'MiHa’s signature dessert: double chocolate with an oozing centre and ice cream.', 'R 129', 'sig veg'],
    ['MiHa’s Decadent Brownies', 'With vanilla bean ice cream, hot chocolate sauce and a chocolate nest.', 'R 120', 'veg'],
    ['Basque Cheesecake', 'Crustless, with a burnt top. Served with cream.', 'R 99', 'veg'],
    ['Crème Brûlée', 'Custard under crackled caramelised sugar.', 'R 65', 'veg'],
    ['Croffle', 'Croissant meets waffle, with white chocolate, strawberries and cream.', 'R 69', 'veg'],
    ['MiHa’s Signature French Toast', 'Brioche stuffed with Nutella, with cream.', 'R 69', 'veg'],
  ]},
];

export const BUFFETS = [
  { day: 5, name: 'Friday Night Dinner Buffet', where: 'MiHa Melrose Arch', time: '18:30 – 21:00', start: '18:30', price: 'R250 per adult · Kids 6–12 R125', note: 'Comforting favourites, hearty mains, sides and something sweet to finish. Bookings are essential.', img: 'g-curry', branch: 'jhb' },
  { day: 6, name: 'Weekend Breakfast Buffet', where: 'MiHa Melrose Arch', time: '09:30 – 12:00', start: '09:30', price: 'R199 per person', note: 'Every Saturday and Sunday morning.', img: 'g-crepe', branch: 'jhb' },
  { day: 0, name: 'Weekend Breakfast Buffet', where: 'MiHa Melrose Arch', time: '09:30 – 12:00', start: '09:30', price: 'R199 per person', note: 'Every Saturday and Sunday morning.', img: 'g-bagel', branch: 'jhb' },
];

// Compact sections (no photo), from the same Dineplan menu
export const EXTRAS = [
  { id: 'kids', title: 'Little <em>ones</em>', items: [
    ['Macon, Eggs &amp; Toast', 'Scrambled eggs and macon on toast.', 'R 59', ''],
    ['French Toast', 'Cinnamon ciabatta with syrup.', 'R 49', 'veg'],
    ['Slider Burger', 'Beef or chicken patty on a slider roll.', 'R 59', ''],
    ['Margherita Pizza', 'Neapolitan sauce and cheese.', 'R 79', 'veg'],
    ['Chicken Strips', '3 crumbed strips.', 'R 59', ''],
    ['Creamy Pasta', 'Penne in a cream sauce.', 'R 99', 'veg'],
  ]},
  { id: 'sides', title: 'On the <em>side</em>', items: [
    ['Chips', '', 'R 29', 'veg'],
    ['Onion Rings', '', 'R 40', 'veg'],
    ['Spicy Rice', '', 'R 55', 'veg spicy'],
    ['Roasted Vegetables', '', 'R 59', 'veg'],
    ['Side Greek Salad', '', 'R 75', 'veg'],
  ]},
];

export const SIGNATURES = [
  ['MiHa Signature Portuguese Prawns', 'Butterflied queen prawns in MiHa’s peri-peri rub.', 'R 279', 'g-prawns'],
  ['Tapas Board for 2', 'Falafel, sheesh kebab, halloumi and dips with laffa.', 'R 299', 'g-platter'],
  ['Okinawa Tempura Platter', 'Tempura crunch, prawn sushi, sumo and tiger rolls.', 'R 780', 'g-sushi'],
  ['Chocolate Fondant', 'MiHa’s signature dessert with an oozing centre.', 'R 129', 'g-dessert-choc'],
];
