const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/user.model');
const Lawyer = require('./models/lawyer.model');

const lawyers = [
  { name: 'James Wilson', specialization: 'Criminal Law', fee: 200, img: 1, bio: 'Expert criminal defense attorney with 15 years of experience.' },
  { name: 'Sarah Mitchell', specialization: 'Criminal Law', fee: 250, img: 2, bio: 'Specialized in white-collar crime and defense litigation.' },
  { name: 'Robert Chen', specialization: 'Corporate Law', fee: 350, img: 3, bio: 'Corporate lawyer with expertise in mergers and acquisitions.' },
  { name: 'Emily Davis', specialization: 'Corporate Law', fee: 400, img: 4, bio: 'Business law specialist with Fortune 500 experience.' },
  { name: 'Michael Brown', specialization: 'Family Law', fee: 150, img: 5, bio: 'Compassionate family lawyer handling divorce and custody cases.' },
  { name: 'Jessica Taylor', specialization: 'Family Law', fee: 180, img: 6, bio: 'Dedicated to protecting families through legal challenges.' },
  { name: 'David Martinez', specialization: 'Immigration Law', fee: 300, img: 7, bio: 'Immigration specialist helping clients achieve their American dream.' },
  { name: 'Amanda Johnson', specialization: 'Immigration Law', fee: 280, img: 8, bio: 'Expert in visa applications, green cards and citizenship.' },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_DB_URL);
  console.log('MongoDB Connected!');

  // Clear existing data
  await Lawyer.deleteMany({});
  await User.deleteMany({ role: { $in: ['lawyer', 'admin'] } });

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
    const user = await User.create({
      name: l.name,
      email: l.name.toLowerCase().replace(' ', '.') + '@legalease.com',
      password: hashedPassword,
      role: 'lawyer',
      photo: `https://i.pravatar.cc/150?img=${l.img}`,
    });

    await Lawyer.create({
      userId: user._id,
      name: l.name,
      email: user.email,
      photo: `https://i.pravatar.cc/150?img=${l.img}`,
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