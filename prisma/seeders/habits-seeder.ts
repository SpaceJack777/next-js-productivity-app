import { PrismaClient } from "@prisma/client";

export async function seedHabits(prisma: PrismaClient, userId: string) {
  const habitsData = [
    // Fitness & Health
    {
      name: "Morning Run",
      description: "Start the day with a refreshing 5km run",
      icon: "Dumbbell",
    },
    {
      name: "Gym Workout",
      description: "Strength training session at the gym",
      icon: "Dumbbell",
    },
    {
      name: "Yoga Practice",
      description: "30-minute yoga session for flexibility and mindfulness",
      icon: "Heart",
    },
    {
      name: "Drink Water",
      description: "Drink 8 glasses of water throughout the day",
      icon: "Coffee",
    },
    {
      name: "Healthy Breakfast",
      description: "Prepare and eat a nutritious breakfast",
      icon: "Coffee",
    },
    {
      name: "Meditation",
      description: "10-minute daily meditation practice",
      icon: "Moon",
    },
    {
      name: "Sleep 8 Hours",
      description: "Get at least 8 hours of quality sleep",
      icon: "Moon",
    },
    {
      name: "No Sugar Day",
      description: "Avoid all added sugars for the entire day",
      icon: "Heart",
    },
    {
      name: "Stretch Routine",
      description: "Daily stretching to improve flexibility",
      icon: "Dumbbell",
    },
    {
      name: "Vitamin Intake",
      description: "Take daily vitamins and supplements",
      icon: "Heart",
    },

    // Learning & Productivity
    {
      name: "Read 30 Minutes",
      description: "Read for at least 30 minutes daily",
      icon: "BookOpen",
    },
    {
      name: "Learn New Skill",
      description: "Spend time learning something new",
      icon: "BookOpen",
    },
    {
      name: "Code Practice",
      description: "Practice coding for 1 hour",
      icon: "Zap",
    },
    {
      name: "Write Journal",
      description: "Write in personal journal every evening",
      icon: "BookOpen",
    },
    {
      name: "Language Learning",
      description: "Practice a foreign language for 20 minutes",
      icon: "BookOpen",
    },
    {
      name: "Deep Work",
      description: "2 hours of focused, uninterrupted work",
      icon: "Target",
    },
    {
      name: "Planning Session",
      description: "Plan tasks and goals for the day",
      icon: "Target",
    },
    {
      name: "Review Progress",
      description: "Review weekly progress and adjust goals",
      icon: "Target",
    },
    {
      name: "Skill Development",
      description: "Work on improving a specific skill",
      icon: "Zap",
    },
    {
      name: "Mind Mapping",
      description: "Create mind maps for complex projects",
      icon: "Zap",
    },

    // Creativity & Hobbies
    {
      name: "Draw Daily",
      description: "Create one piece of art every day",
      icon: "Star",
    },
    {
      name: "Play Guitar",
      description: "Practice guitar for 30 minutes",
      icon: "Star",
    },
    {
      name: "Photography",
      description: "Take and edit at least 5 photos",
      icon: "Star",
    },
    {
      name: "Write Stories",
      description: "Write 500 words of creative fiction",
      icon: "BookOpen",
    },
    {
      name: "Music Listening",
      description: "Listen to new music and discover artists",
      icon: "Star",
    },
    {
      name: "Cooking Experiment",
      description: "Try cooking a new recipe",
      icon: "Coffee",
    },
    {
      name: "Gardening",
      description: "Spend time tending to plants or garden",
      icon: "Heart",
    },
    {
      name: "Puzzle Solving",
      description: "Solve crossword or logic puzzles",
      icon: "Target",
    },
    {
      name: "Knitting",
      description: "Work on knitting project for 30 minutes",
      icon: "Heart",
    },
    {
      name: "Photography Walk",
      description: "Go for a walk specifically to take photos",
      icon: "Star",
    },

    // Social & Relationships
    {
      name: "Call Family",
      description: "Call a family member for a meaningful conversation",
      icon: "Heart",
    },
    {
      name: "Meet Friend",
      description: "Spend quality time with a friend",
      icon: "Heart",
    },
    {
      name: "Volunteer Work",
      description: "Volunteer for a local cause or organization",
      icon: "Heart",
    },
    {
      name: "Write Thank You",
      description: "Send thank you notes or messages",
      icon: "Heart",
    },
    {
      name: "Network Meeting",
      description: "Attend or organize a networking event",
      icon: "Zap",
    },
    {
      name: "Mentor Session",
      description: "Mentor someone or seek mentorship",
      icon: "BookOpen",
    },
    {
      name: "Group Activity",
      description: "Participate in a group sport or activity",
      icon: "Dumbbell",
    },
    {
      name: "Community Event",
      description: "Attend a local community event",
      icon: "Star",
    },
    {
      name: "Help Neighbor",
      description: "Help a neighbor or someone in need",
      icon: "Heart",
    },
    {
      name: "Team Collaboration",
      description: "Work on a collaborative project",
      icon: "Target",
    },

    // Finance & Organization
    {
      name: "Budget Review",
      description: "Review monthly budget and expenses",
      icon: "Target",
    },
    {
      name: "Save Money",
      description: "Save a specific amount towards goals",
      icon: "Trophy",
    },
    {
      name: "Organize Desk",
      description: "Clean and organize workspace",
      icon: "Target",
    },
    {
      name: "Digital Detox",
      description: "Spend 1 hour without screens",
      icon: "Moon",
    },
    {
      name: "Meal Prep",
      description: "Prepare healthy meals for the week",
      icon: "Coffee",
    },
    {
      name: "Laundry Day",
      description: "Complete all laundry and folding",
      icon: "Target",
    },
    {
      name: "Grocery Shopping",
      description: "Plan and complete weekly grocery shopping",
      icon: "Coffee",
    },
    {
      name: "Bill Payments",
      description: "Pay all monthly bills on time",
      icon: "Target",
    },
    {
      name: "Investment Review",
      description: "Review investment portfolio",
      icon: "Trophy",
    },
    {
      name: "Goal Setting",
      description: "Set and review personal goals",
      icon: "Target",
    },

    // Professional Development
    {
      name: "LinkedIn Post",
      description: "Share valuable content on LinkedIn",
      icon: "Zap",
    },
    {
      name: "Conference Call",
      description: "Attend important work meetings",
      icon: "Target",
    },
    {
      name: "Email Management",
      description: "Process and organize inbox",
      icon: "Target",
    },
    {
      name: "Skill Certification",
      description: "Work towards professional certification",
      icon: "Trophy",
    },
    {
      name: "Industry Reading",
      description: "Read industry news and articles",
      icon: "BookOpen",
    },
    {
      name: "Project Planning",
      description: "Plan upcoming projects thoroughly",
      icon: "Target",
    },
    {
      name: "Feedback Session",
      description: "Give or receive constructive feedback",
      icon: "Heart",
    },
    {
      name: "Time Tracking",
      description: "Track time spent on different activities",
      icon: "Target",
    },
    {
      name: "Professional Networking",
      description: "Connect with industry professionals",
      icon: "Zap",
    },
    {
      name: "Career Planning",
      description: "Work on career development plan",
      icon: "Trophy",
    },

    // Personal Growth
    {
      name: "Gratitude Practice",
      description: "Write down 3 things I'm grateful for",
      icon: "Star",
    },
    {
      name: "Positive Affirmations",
      description: "Practice daily positive affirmations",
      icon: "Heart",
    },
    {
      name: "Limit News",
      description: "Limit news consumption to 30 minutes",
      icon: "Moon",
    },
    {
      name: "Nature Walk",
      description: "Spend time walking in nature",
      icon: "Heart",
    },
    {
      name: "Breathing Exercise",
      description: "Practice deep breathing exercises",
      icon: "Moon",
    },
    {
      name: "Random Act of Kindness",
      description: "Perform one random act of kindness",
      icon: "Heart",
    },
    {
      name: "Vision Board",
      description: "Work on or review vision board",
      icon: "Star",
    },
    {
      name: "Self-Reflection",
      description: "Spend time reflecting on personal growth",
      icon: "Moon",
    },
    {
      name: "Mindfulness Practice",
      description: "Practice mindfulness throughout the day",
      icon: "Heart",
    },
    {
      name: "Goal Achievement",
      description: "Celebrate small wins and achievements",
      icon: "Trophy",
    },
  ];

  for (const habitData of habitsData) {
    await prisma.habit.create({
      data: {
        ...habitData,
        userId,
      },
    });
  }

  console.log("Seeded", habitsData.length, "habits");
}
