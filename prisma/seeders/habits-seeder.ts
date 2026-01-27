import { PrismaClient } from "@prisma/client";

export async function seedHabits(prisma: PrismaClient, userId: string) {
  const habitsData = [
    {
      name: "Morning Workout",
      description: "Start the day with a 30-minute workout session",
      icon: "Dumbbell",
    },
    {
      name: "Evening Gym",
      description: "Strength training and cardio at the gym",
      icon: "Dumbbell",
    },
    {
      name: "Meditation Practice",
      description: "Daily 15-minute mindfulness meditation",
      icon: "Heart",
    },
    {
      name: "Gratitude Journal",
      description: "Write down 3 things I'm grateful for",
      icon: "Heart",
    },
    {
      name: "Read 30 Minutes",
      description: "Read for at least 30 minutes daily",
      icon: "Glasses",
    },
    {
      name: "Learn New Skill",
      description: "Dedicate time to learning something new",
      icon: "Glasses",
    },
    {
      name: "Code Practice",
      description: "Practice coding challenges and projects",
      icon: "SquareTerminal",
    },
    {
      name: "Side Project",
      description: "Work on personal development projects",
      icon: "SquareTerminal",
    },
    {
      name: "Music Practice",
      description: "Practice musical instrument for 30 minutes",
      icon: "Disc3",
    },
    {
      name: "Creative Writing",
      description: "Write 500 words of creative content",
      icon: "Sword",
    },
    {
      name: "Take Vitamins",
      description: "Take daily vitamins and supplements",
      icon: "Pill",
    },
    {
      name: "Drink Water",
      description: "Drink 8 glasses of water throughout the day",
      icon: "Pill",
    },
    {
      name: "Walk the Dog",
      description: "Take the dog for a 30-minute walk",
      icon: "PawPrint",
    },
    {
      name: "Pet Care",
      description: "Feed and play with pets",
      icon: "PawPrint",
    },
    {
      name: "Clean House",
      description: "Tidy up and organize living space",
      icon: "HouseHeart",
    },
    {
      name: "Home Maintenance",
      description: "Complete one home improvement task",
      icon: "HouseHeart",
    },
    {
      name: "Call Family",
      description: "Call a family member for meaningful conversation",
      icon: "Phone",
    },
    {
      name: "Connect with Friends",
      description: "Reach out to friends and stay connected",
      icon: "Phone",
    },
    {
      name: "Language Learning",
      description: "Practice foreign language for 20 minutes",
      icon: "Glasses",
    },
    {
      name: "Yoga Session",
      description: "30-minute yoga practice for flexibility",
      icon: "Heart",
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
