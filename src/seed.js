const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/user.model');
const Lawyer = require('./models/lawyer.model');

const lawyers = [
  { name: 'James Wilson', gender: 'men', specialization: 'Criminal Law', fee: 200, img: 1, bio: 'Expert criminal defense attorney with 15 years of experience.' },
  { name: 'Sarah Mitchell', gender: 'women', specialization: 'Criminal Law', fee: 250, img: 1, bio: 'Specialized in white-collar crime and defense litigation.' },
  { name: 'Robert Chen', gender: 'men', specialization: 'Corporate Law', fee: 350, img: 2, bio: 'Corporate lawyer with expertise in mergers and acquisitions.' },
  { name: 'Emily Davis', gender: 'women', specialization: 'Corporate Law', fee: 400, img: 2, bio: 'Business law specialist with Fortune 500 experience.' },
  { name: 'Michael Brown', gender: 'men', specialization: 'Family Law', fee: 150, img: 3, bio: 'Compassionate family lawyer handling divorce and custody cases.' },
  { name: 'Jessica Taylor', gender: 'women', specialization: 'Family Law', fee: 180, img: 3, bio: 'Dedicated to protecting families through legal challenges.' },
  { name: 'David Martinez', gender: 'men', specialization: 'Immigration Law', fee: 300, img: 4, bio: 'Immigration specialist helping clients achieve their American dream.' },
  { name: 'Amanda Johnson', gender: 'women', specialization: 'Immigration Law', fee: 280, img: 4, bio: 'Expert in visa applications, green cards and citizenship.' },
  { name: 'Thomas Anderson', gender: 'men', specialization: 'Property Law', fee: 220, img: 5, bio: 'Expert in real estate and property disputes with 10 years experience.' },
  { name: 'Lisa Thompson', gender: 'women', specialization: 'Property Law', fee: 190, img: 5, bio: 'Specialized in land acquisition and property rights.' },
  { name: 'Kevin Park', gender: 'men', specialization: 'Civil Law', fee: 160, img: 6, bio: 'Civil litigation expert with 12 years of experience.' },
  { name: 'Rachel Green', gender: 'women', specialization: 'Civil Law', fee: 175, img: 6, bio: 'Dedicated civil rights attorney fighting for justice.' },
  { name: 'Daniel White', gender: 'men', specialization: 'Criminal Law', fee: 310, img: 7, bio: 'Former prosecutor now defending clients in criminal cases.' },
  { name: 'Sophia Martinez', gender: 'women', specialization: 'Family Law', fee: 200, img: 7, bio: 'Compassionate family lawyer specializing in child custody.' },
  { name: 'Ethan Brooks', gender: 'men', specialization: 'Corporate Law', fee: 450, img: 8, bio: 'Senior corporate attorney with Fortune 500 clients.' },
  { name: 'Olivia Scott', gender: 'women', specialization: 'Immigration Law', fee: 260, img: 8, bio: 'Helping families navigate complex immigration processes.' },
  { name: 'Nathan Rivera', gender: 'men', specialization: 'Criminal Law', fee: 280, img: 9, bio: 'Aggressive defense attorney with high success rate.' },
  { name: 'Emma Collins', gender: 'women', specialization: 'Corporate Law', fee: 380, img: 9, bio: 'Expert in startup law, contracts and business formation.' },
  { name: 'Jacob Turner', gender: 'men', specialization: 'Property Law', fee: 240, img: 10, bio: 'Real estate attorney handling commercial and residential cases.' },
  { name: 'Ava Mitchell', gender: 'women', specialization: 'Civil Law', fee: 195, img: 10, bio: 'Civil law specialist focusing on personal injury cases.' },
  { name: 'Mason Carter', gender: 'men', specialization: 'Immigration Law', fee: 320, img: 11, bio: 'Immigration attorney with 15 years of international experience.' },
  { name: 'Isabella Lewis', gender: 'women', specialization: 'Family Law', fee: 155, img: 11, bio: 'Helping families through difficult times with care and expertise.' },
  { name: 'Logan Walker', gender: 'men', specialization: 'Criminal Law', fee: 290, img: 12, bio: 'Criminal defense specialist with expertise in white collar crime.' },
  { name: 'Mia Hall', gender: 'women', specialization: 'Corporate Law', fee: 420, img: 12, bio: 'M&A specialist with extensive cross-border transaction experience.' },
  { name: 'Lucas Allen', gender: 'men', specialization: 'Property Law', fee: 210, img: 13, bio: 'Property law expert specializing in commercial real estate.' },
  { name: 'Charlotte Young', gender: 'women', specialization: 'Civil Law', fee: 185, img: 13, bio: 'Consumer rights advocate with proven track record.' },
  { name: 'Benjamin King', gender: 'men', specialization: 'Immigration Law', fee: 275, img: 14, bio: 'Specialized in work visas, green cards and asylum cases.' },
  { name: 'Amelia Wright', gender: 'women', specialization: 'Family Law', fee: 165, img: 14, bio: 'Divorce and family mediation specialist.' },
  { name: 'Henry Lopez', gender: 'men', specialization: 'Criminal Law', fee: 330, img: 15, bio: 'High-profile criminal defense attorney with national recognition.' },
  { name: 'Harper Hill', gender: 'women', specialization: 'Corporate Law', fee: 395, img: 15, bio: 'Corporate governance and compliance expert.' },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_DB_URL);
  console.log('MongoDB Connected!');

  // Clear existing data
  await Lawyer.deleteMany({});
  await User.deleteMany({});

  // Create admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await User.create({
    name: 'Admin',
    email: 'admin@legalease.com',
    password: hashedPassword,
    role: 'admin',
  });
  console.log('Admin created!');

  // Create lawyers
  for (const l of lawyers) {
    const email = l.name.toLowerCase().replace(/ /g, '.') + '@legalease.com';
    const photo = `https://randomuser.me/api/portraits/${l.gender}/${l.img}.jpg`;

    const user = await User.create({
      name: l.name,
      email,
      password: hashedPassword,
      role: 'lawyer',
      photo,
    });

    await Lawyer.create({
      userId: user._id,
      name: l.name,
      email,
      photo,
      bio: l.bio,
      specialization: l.specialization,
      consultationFee: l.fee,
      status: 'available',
      isPublished: true,
      totalHires: Math.floor(Math.random() * 50),
    });
  }

  console.log('Seed completed!');
  await mongoose.disconnect();
}

seed().catch(console.error);