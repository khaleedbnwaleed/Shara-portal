require('dotenv').config({ path: '.env.local' });

const testData = {
  fullName: 'Database Submission Test',
  email: 'test-db@example.com',
  phoneNumber: '+2348012345678',
  location: 'Lagos',
  country: 'Nigeria',
  state: 'Lagos',
  age: 25,
  gender: 'Male',
  position: 'Social Media Manager Intern',
  highestQualification: 'Bachelor',
  fieldOfStudy: 'Marketing',
  institution: 'Test University',
  graduationYear: 2024,
  currentOccupation: 'Student',
  previousExperience: 'I have experience in social media marketing and content creation.',
  relevantSkills: 'Social media, content creation, graphic design.',
  interestReason: 'I am interested in joining Shara for its environmental mission.',
  learningGoals: 'I want to learn sustainable marketing practices.',
  contribution: 'I can contribute creative content and social media expertise.',
  socialMediaPlatforms: 'Instagram, TikTok, LinkedIn',
  socialMediaTools: 'Meta Business Suite, Canva',
  socialMediaPortfolio: 'https://example.com/portfolio',
  socialMediaCampaign: 'I managed a successful awareness campaign.',
  preferredStartDate: '2026-09-01',
  availability: 'Part-time',
  workingArrangement: 'Remote',
  unpaidInternshipAccepted: true,
  declarationAccepted: true,
};

(async () => {
  try {
    console.log('Testing internship application submission...\n');
    
    const response = await fetch('http://127.0.0.1:3000/api/internship/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData),
    });

    const data = await response.json();

    console.log('Response Status:', response.status);
    console.log('Response Body:', JSON.stringify(data, null, 2));

    if (data.ok) {
      console.log('\n✅ Application submitted successfully!');
      console.log('- Reference:', data.applicationRef);
      console.log('- Storage:', data.storage);
    } else {
      console.log('\n❌ Submission failed:', data.error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();
