import Header from '@/components/header';
import Footer from '@/components/footer';
import TeamPage, { TeamCategory } from '@/components/team-page';

const categories: TeamCategory[] = [
  {
    title: 'Board of Directors',
    description:
      'Our board provides strategic direction and governance to support our mission.',
    members: [
      {
        id: 1,
        name: 'Adamu',
        role: 'Board Chair',
        image: '/asset/image/Adamu.JPG',
        social: {
          linkedin: '#',
          twitter: '#',
        },
      },
      {
        id: 2,
        name: 'Abubakar',
        role: 'Board Member',
        image: '/asset/image/Abubakar.jpeg',
        social: {
          linkedin: '#',
          twitter: '#',
        },
      },
      {
        id: 3,
        name: 'Nafiu',
        role: 'Board Member',
        image: '/asset/image/Nafiu.jpeg',
        social: {
          linkedin: '#',
          twitter: '#',
        },
      },
      {
        id: 4,
        name: 'Jamilu',
        role: 'Board Member',
        image: '/asset/image/Jamilu.JPG',
        social: {
          linkedin: '#',
          twitter: '#',
        },
      },
    ],
  },
  {
    title: 'Core Team',
    description:
      'Our full-time staff members working across programs, operations, and community outreach.',
    members: [
      {
        id: 10,
        name: 'Khalid Abdullahi',
        role: 'Executive Director',
        image: '/asset/image/khalid-abdullahi.jpg',
        social: {
          linkedin: 'https://www.linkedin.com/in/khaleedbnwaleed/',
          twitter: 'https://twitter.com',
        },
      },
      {
        id: 11,
        name: 'Kabiru Mustapha',
        role: 'Business Development Manager',
        image: '/asset/image/KB.png',
        social: {
          linkedin: '#',
          twitter: '#',
        },
      },
      {
        id: 12,
        name: 'Muhammad K. Muhammad',
        role: 'Operations Manager',
        image: '/asset/image/Amigo.jpg',
        social: {
          linkedin: '#',
          twitter: 'https://x.com/bnwaleed_khalid',
        },
      },
      {
        id: 13,
        name: 'Ibrahim Suleiman',
        role: 'Technical Officer',
        image: '/asset/image/yarima.png',
        social: {
          linkedin: '#',
          twitter: '#',
        },
      },
      {
        id: 14,
        name: 'Abdulhakim Aminu',
        role: 'Community Engagement Officer',
        image: '/asset/image/Abdul.jpg',
        social: {
          linkedin: '#',
          twitter: '#',
        },
      },
      {
        id: 15,
        name: 'Auwalu Habibu',
        role: 'Recycling Coordinator',
        image: '/asset/image/auwal.png',
        social: {
          linkedin: 'https://linkedin.com',
          twitter: 'https://twitter.com',
        },
      },
      {
        id: 16,
        name: 'Saadatu Ahmed Shehu',
        role: 'Co-Founder',
        image: '/asset/image/moh.png',
        social: {
          linkedin: 'https://linkedin.com',
          twitter: 'https://twitter.com',
        },
      },
      {
        id: 17,
        name: 'Lurwanu Hamza',
        role: 'Mobilizing Officer I',
        image: '/asset/image/wanana.png',
        social: {
          linkedin: '#',
          twitter: '#',
        },
      },
      {
        id: 18,
        name: 'Haruna Sabo',
        role: 'Staff Officer',
        image: '/asset/image/Haro.png',
        social: {
          linkedin: '#',
          twitter: '#',
        },
      },
    ],
  },
  {
    title: 'Volunteers',
    description:
      'Our volunteers keep the wheels turning on the ground—they support events, outreach, and collection drives.',
    members: [
      {
        id: 20,
        name: 'Aisha Bello',
        role: 'Volunteer Coordinator',
        image: '/asset/image/placeholder-profile.jpg',
        social: {
          linkedin: '#',
          twitter: '#',
        },
      },
      {
        id: 21,
        name: 'Chinedu Okafor',
        role: 'Outreach Volunteer',
        image: '/asset/image/placeholder-profile.jpg',
        social: {
          linkedin: '#',
          twitter: '#',
        },
      },
    ],
  },
  {
    title: 'Ambassadors',
    description:
      'Our ambassadors amplify the mission in their networks and support community engagement.',
    members: [
      {
        id: 30,
        name: 'Zainab Suleiman',
        role: 'Community Ambassador',
        image: '/asset/image/placeholder-profile.jpg',
        social: {
          linkedin: '#',
          twitter: '#',
        },
      },
      {
        id: 31,
        name: 'Emeka Nwafor',
        role: 'Youth Ambassador',
        image: '/asset/image/placeholder-profile.jpg',
        social: {
          linkedin: '#',
          twitter: '#',
        },
      },
    ],
  },
];

export default function TeamRoute() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <TeamPage categories={categories} />
      <Footer />
    </main>
  );
}
