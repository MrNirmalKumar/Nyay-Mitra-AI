import { NextResponse } from 'next/server';
import { fakerEN_IN as faker } from '@faker-js/faker';

export async function GET() {
  const activities = [];
  const count = Math.floor(Math.random() * 3) + 2;

  const regions = ["Mumbai", "Delhi", "Bengaluru", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Lucknow"];
  const topics = ["Tenancy Law", "Labour & Employment", "Consumer Rights", "Family Dispute", "Cyber Fraud", "Intellectual Property", "Property Dispute", "Contract Breach"];

  // Advocate-only actions — never attribute resolution to AI
  const advocateActions = [
    "answered a query on",
    "provided a consultation for",
    "shared a precedent regarding",
    "resolved a case about",
    "drafted a notice for",
    "filed an RTI application regarding",
  ];

  // AI-specific actions — guidance only, never "resolved"
  const aiActions = [
    "provided initial guidance on a",
    "analyzed a citizen query about",
    "generated a legal notice draft for",
    "summarized applicable statutes for",
    "flagged high-risk clauses in a",
  ];

  for (let i = 0; i < count; i++) {
    const isAdvocate = Math.random() > 0.3;
    const region = faker.helpers.arrayElement(regions);
    const topic = faker.helpers.arrayElement(topics);
    const timestamp = new Date(Date.now() - Math.floor(Math.random() * 300000)).toISOString();

    let message: string;
    if (isAdvocate) {
      const name = `Advocate ${faker.person.fullName()}`;
      const action = faker.helpers.arrayElement(advocateActions);
      message = `${name} just ${action} ${topic} in ${region}.`;
    } else {
      const action = faker.helpers.arrayElement(aiActions);
      message = `Nyay Mitra AI ${action} ${topic} query in ${region}.`;
    }

    activities.push({
      id: faker.string.uuid(),
      message,
      timestamp,
      type: isAdvocate ? 'advocate' : 'ai',
      topic,
    });
  }

  activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return NextResponse.json({ activities });
}
