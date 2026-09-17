import requests
import json

url = "http://localhost:3005/api/chat"
headers = {"Content-Type": "application/json"}

scenarios = [
    ("Tenant Eviction", "mera landlord mujhe ghar se nikal raha hai bina notice diye"),
    ("Unpaid Salary", "company ne meri 3 mahine ki salary nahi di aur hr phone nahi utha raha"),
    ("Defective Product", "flipkart se laptop mangwaya tha kharab nikla aur return reject kar diya"),
    ("College Ragging", "mere sath ragging ho raha hai college me seniors pareshan kar rahe hain"),
    ("Generic Question", "what is the recipe for butter chicken?")
]

print("Running 5 Demo Scenarios (Hinglish/English)...\n")

for name, query in scenarios:
    print(f"--- Scenario: {name} ---")
    print(f"Query: {query}")
    try:
        response = requests.post(url, headers=headers, json={"message": query})
        if response.status_code == 200:
            data = response.json()
            if not data.get("isLegalIssue"):
                print("Intent: Non-Legal")
                print("Response:", data.get("nonLegalResponse"))
            else:
                print("Intent: Legal")
                guidance = data.get("guidance", {})
                print("Understanding:", guidance.get("understanding"))
                print("Legal Area:", guidance.get("legalArea"))
                print("Next Steps:", guidance.get("nextSteps"))
        else:
            print("Error:", response.status_code, response.text)
    except Exception as e:
        print("Failed to connect:", e)
    print("\n")
