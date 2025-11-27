export const questions = [
  "1. What is your preferred rate of growth?",
  "2. Should multi-unit dwellings be allowed as new construction?",
  "3. Should there be more attainable/affordable housing?",
  "4. How could we make housing more attainable and/or affordable??",
  "5. What are the most appropriate locations for new housing units?",
  "6. Other desirable locations for new housing",
  "7. Desirable forms of housing in the Commercial District",
  "8. Desirable locations for multi-unit housing",
  "9. Should infill development have as many as four units?",
  "10. Should the capacity of the school limit housing development?",
  "11. Please explain your answer above",
  "12. Which housing initiatives are important to you?",
  "13. How long have you lived in Lyme?",
  "14. Do you plan to move out of Lyme in the next 5 years?",
  "15. Please explain your answer above",
  "16. How old are you?",
  "17. Do you hope to buy/rent a smaller house?",
  "18. Please explain your answer above",
  "19. Do you currently own/rent/live with friends or relatives?",
  "20. Other thoughts you care to share",
] as const;

export type QuestionPrompt = (typeof questions)[number];
