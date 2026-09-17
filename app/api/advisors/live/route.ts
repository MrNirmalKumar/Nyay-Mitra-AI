import { NextResponse } from 'next/server';
import { faker } from '@faker-js/faker';

export async function GET() {
  const activities = [];
  const count = Math.floor(Math.random() * 3) + 2; // Return 2 to 4 activities at a time

  const regions = ["Mumbai", "Delhi", "Bengaluru", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Lucknow"];
  const topics = ["Tenancy Law", "Labour & Employment", "Consumer Rights", "Family Dispute", "Cyber Fraud", "Intellectual Property", "Property Dispute", "Contract Breach"];
  const actions = ["answered a query on", "provided a consultation for", "shared a precedent regarding", "resolved a case about", "drafted a notice for"];

  for (let i = 0; i < count; i++) {
    const isAdvocate = Math.random() > 0.3;
    const name = isAdvocate ? `Advocate ${faker.person.lastName()}` : "Nyay Mitra AI";
    const region = faker.helpers.arrayElement(regions);
    const topic = faker.helpers.arrayElement(topics);
    const action = faker.helpers.arrayElement(actions);
    
    // Fake timestamp within the last 5 minutes
    const timestamp = new Date(Date.now() - Math.floor(Math.random() * 300000)).toISOString();

    activities.push({
      id: faker.string.uuid(),
      message: `${name} just ${action} ${topic} in ${region}.`,
      timestamp,
      type: isAdvocate ? 'advocate' : 'ai',
      topic
    });
  }

  // Sort newest first
  activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return NextResponse.json({ activities });
}
